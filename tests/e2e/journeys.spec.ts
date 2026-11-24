import { test, expect, type Page } from "@playwright/test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const LEADS = path.resolve(".data/e2e-leads");
const readLead = (ref: string) => JSON.parse(readFileSync(path.join(LEADS, ref, "lead.json"), "utf8"));

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test("industry → product → quote → confirmation creates a routed lead", async ({ page, isMobile }) => {
  const errors = await collectErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Packaging");

  // Industry-first discovery
  if (isMobile) await page.getByLabel("Choose your industry").selectOption("cinema");
  else await page.getByRole("tab", { name: /Multiplexes/ }).click();
  const panel = page.locator("#industry-panel");
  await expect(panel).toContainText("Popcorn Cones");
  await expect(panel).toContainText("Nachos Trays");

  // Product page
  await panel.getByRole("link", { name: "Popcorn Tubs", exact: true }).first().click();
  await expect(page).toHaveURL(/\/foodservice-packaging\/popcorn-tubs$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Popcorn Tubs");
  await expect(page.getByRole("table")).toBeVisible();

  // Quote form, pre-filled with the product
  await page.locator("main").getByRole("link", { name: /Request a Quote/ }).first().click();
  await expect(page).toHaveURL(/request-a-quote\?product=popcorn-tubs/);
  await expect(page.locator("#product")).toHaveValue("popcorn-tubs");
  await page.locator("#industry").selectOption("cinema");
  await page.getByRole("button", { name: "Continue" }).click();

  // Product-specific fields (foodservice profile)
  await expect(page.getByLabel(/Food and temperature/)).toBeVisible();
  await page.getByLabel(/Product format/).fill("130 oz tub");
  await page.getByLabel(/Food and temperature/).fill("Hot buttered popcorn");
  await page.locator("#quantity").selectOption("25,000 – 1,00,000");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#delivery").fill("Pune, India");
  await page.locator("#timeline").selectOption("1–3 months");
  await page.locator('input[type=file]').setInputFiles({ name: "artwork.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
  await expect(page.getByText("artwork.pdf")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  // Validation: submit empty contact step
  await page.getByRole("button", { name: /Submit quote request/ }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await page.locator("#name").fill("Test Buyer");
  await page.locator("#company").fill("E2E Cinemas");
  await page.locator("#email").fill("buyer@example.com");
  await page.locator("#phone").fill("+91 98765 43210");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3100); // anti-spam minimum completion time
  await page.getByRole("button", { name: /Submit quote request/ }).click();

  await expect(page).toHaveURL(/enquiry-received\?ref=MRV-/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("received");
  const ref = new URL(page.url()).searchParams.get("ref")!;
  const lead = readLead(ref);
  expect(lead.product.slug).toBe("popcorn-tubs");
  expect(lead.industry.id).toBe("cinema");
  expect(lead.team).toBe("Foodservice sales");
  expect(lead.specs["Food and temperature"]).toBe("Hot buttered popcorn");
  expect(lead.files[0].name).toBe("artwork.pdf");
  expect(existsSync(path.join(LEADS, ref, "artwork.pdf"))).toBe(true);
  expect(lead.contact.email).toBe("buyer@example.com");
  expect(errors).toEqual([]);
});

test("custom requirement route submits and is routed to custom development", async ({ page }) => {
  await page.goto("/industries/automotive-packaging");
  await page.getByRole("link", { name: "Discuss Your Custom Requirement" }).first().click();
  await expect(page).toHaveURL(/custom-requirement/);
  await page.locator("#message").fill("We need returnable-style trays for 40 machined gear blanks per layer.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#name").fill("Auto Buyer");
  await page.locator("#email").fill("auto@example.com");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3100);
  await page.getByRole("button", { name: /Submit requirement/ }).click();
  await expect(page).toHaveURL(/enquiry-received\?ref=MRV-/);
  const lead = readLead(new URL(page.url()).searchParams.get("ref")!);
  expect(lead.type).toBe("custom");
  expect(lead.team).toBe("Custom development");
  expect(lead.industry.id).toBe("automotive");
});

test("contact form routes careers enquiries", async ({ page }) => {
  await page.goto("/contact?topic=careers");
  await expect(page.getByRole("radio", { name: "Careers" })).toBeChecked();
  await page.locator("#c-name").fill("Applicant");
  await page.locator("#c-email").fill("applicant@example.com");
  await page.locator("#c-message").fill("Interested in quality roles.");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3100);
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page).toHaveURL(/enquiry-received\?ref=MRV-/);
  expect(readLead(new URL(page.url()).searchParams.get("ref")!).team).toBe("HR & careers");
});

test("product flyer, catalogue and company profile download as real PDFs", async ({ page, request }) => {
  await page.goto("/corrugated-packaging/5-ply-boxes");
  const href = await page.getByRole("link", { name: /Download Product Flyer/ }).getAttribute("href");
  expect(href).toBe("/assets/downloads/flyers/merova-5-ply-boxes-flyer.pdf");
  for (const url of [href!, "/assets/downloads/merova-product-catalogue.pdf", "/assets/downloads/merova-company-profile.pdf"]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect((await res.body()).subarray(0, 4).toString()).toBe("%PDF");
  }
  await page.goto("/resources/downloads");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: /PDF/ }).first().click()]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});

test("WhatsApp control is always functional (fallback panel when no number is configured)", async ({ page }) => {
  await page.goto("/foodservice-packaging/nachos-trays");
  const wa = page.getByRole("link", { name: /Chat with Merova on WhatsApp/ });
  if (await wa.count()) {
    const href = await wa.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(href!)).toContain("Nachos Trays");
  } else {
    await page.getByRole("button", { name: "Chat with Merova" }).click();
    const dialog = page.getByRole("dialog", { name: "Contact options" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Request a Quote" })).toHaveAttribute("href", "/request-a-quote");
  }
});

test("Mira discovers products and hands off to an enquiry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask Mira" }).click();
  const mira = page.getByRole("dialog", { name: /Mira/ });
  await expect(mira).toContainText("AI");
  await mira.getByLabel("Message Mira").fill("We run a multiplex and need popcorn packaging");
  await mira.getByRole("button", { name: "Send" }).click();
  await expect(mira.getByRole("link", { name: /Multiplexes packaging|Popcorn/ }).first()).toBeVisible({ timeout: 20_000 });
  await mira.getByLabel("Message Mira").fill("What is the price?");
  await mira.getByRole("button", { name: "Send" }).click();
  await expect(mira.getByText(/can't give prices|cannot give prices|quotation/i).last()).toBeVisible({ timeout: 20_000 });
  await mira.getByRole("link", { name: "Request a Quote" }).last().click();
  await expect(page).toHaveURL(/request-a-quote/);
});

test("mobile and desktop navigation reach products", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-nav").getByRole("button", { name: "Products" }).click();
    await page.locator("#mobile-nav").getByRole("link", { name: /^Plastic & Flexible/ }).first().click();
  } else {
    await page.getByRole("button", { name: "Products" }).click();
    await page.locator("#mega-products").getByRole("link", { name: /Plastic & Flexible/ }).first().click();
  }
  await expect(page).toHaveURL(/\/plastic-packaging$/);
  await expect(page.getByRole("link", { name: "BOPP Film Rolls", exact: true })).toBeVisible();
});

test("enquiry API rejects spam and invalid submissions", async ({ request }) => {
  const base = { type: "quote", startedAt: String(Date.now() - 10_000), name: "A Person", email: "a@example.com", consent: "yes", product: "3-ply-boxes" };
  const honeypot = await request.post("/api/enquiry", { multipart: { ...base, website: "http://spam" } });
  expect(honeypot.status()).toBe(400);
  const fast = await request.post("/api/enquiry", { multipart: { ...base, startedAt: String(Date.now()) } });
  expect(fast.status()).toBe(400);
  const invalid = await request.post("/api/enquiry", { multipart: { ...base, email: "nope" } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).fields.email).toBeTruthy();
  const badFile = await request.post("/api/enquiry", { multipart: { ...base, files: { name: "x.exe", mimeType: "application/octet-stream", buffer: Buffer.from("MZ") } } });
  expect(badFile.status()).toBe(422);
});

test("direct visit to confirmation page without a reference does not claim success", async ({ page }) => {
  await page.goto("/enquiry-received");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No enquiry reference found");
});

test.afterAll(() => {
  if (existsSync(LEADS)) console.log(`leads stored: ${readdirSync(LEADS).length}`);
});
