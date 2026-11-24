import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const reveal = async (page: import("@playwright/test").Page) => page.evaluate(() => document.querySelectorAll(".reveal,.reveal-img").forEach((e) => e.classList.add("is-in")));
const noOverflow = async (page: import("@playwright/test").Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

test.describe("core pages render without overflow or errors", () => {
  for (const url of ["/", "/products/", "/products/paper-products/", "/products/plastic-products-films/bopp-hst-rolls/", "/industries/", "/industries/food-beverage/sweet-shops/", "/about/", "/resources/downloads/", "/insights/", "/request-a-quote/", "/contact/", "/custom-packaging/"]) {
    test(url, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(url);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await noOverflow(page);
      expect(errors).toEqual([]);
    });
  }
});

test("held single-use plastic products are not published", async ({ page }) => {
  const res = await page.goto("/products/plastic-products-films/pet-glasses/");
  expect(res?.status()).toBe(404);
});

test("old URLs redirect to the new structure", async ({ page }) => {
  await page.goto("/paper-packaging/pharmaceutical-cartons");
  await expect(page).toHaveURL(/\/products\/paper-products\/mono-cartons\/$/);
  await page.goto("/industries/cinema-multiplex-packaging");
  await expect(page).toHaveURL(/\/industries\/food-beverage\/multiplex-cinema\/$/);
});

test("product → basket → RFQ submission is confirmed by the server", async ({ page }) => {
  await page.goto("/products/paper-products/popcorn-tubs/");
  await page.getByRole("button", { name: "Regular / medium / large / combo" }).click();
  await page.getByRole("button", { name: /Add to enquiry/ }).first().click();
  await expect(page.getByRole("button", { name: /Added to enquiry/ }).first()).toBeVisible();
  await page.goto("/request-a-quote/");
  await expect(page.locator("#main").getByRole("link", { name: "Popcorn Tubs" })).toBeVisible();
  // Validation: quantity required
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("Add an approximate quantity.")).toBeVisible();
  await page.getByLabel("Approximate quantity").fill("20,000 per month");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByLabel("Delivery location").fill("Pune 411001");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByLabel("Full name").fill("Test Buyer");
  await page.getByLabel("Company").fill("Example Cinemas");
  await page.getByLabel("Work email").fill("buyer@example.com");
  await page.getByLabel("Phone / WhatsApp").fill("+91 20 1234 5678");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3200); // minimum completion time (spam control)
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page).toHaveURL(/enquiry-received/);
  const ref = new URL(page.url()).searchParams.get("ref")!;
  expect(ref).toMatch(/^MRV-\d{8}-[0-9A-F]{6}$/);
  await expect(page.getByText(ref)).toBeVisible();
  const lead = JSON.parse(fs.readFileSync(path.join(".data/e2e-leads", ref, "lead.json"), "utf8"));
  expect(lead.items[0]).toMatchObject({ id: "PA-09", quantity: "20,000 per month", variant: "Regular / medium / large / combo" });
  expect(lead.team).toBe("Paper packaging sales");
});

test("operator kit adds products from several categories to one enquiry", async ({ page }) => {
  await page.goto("/industries/food-beverage/multiplex-cinema/");
  await page.getByRole("button", { name: /Add the complete kit/ }).first().click();
  await page.goto("/request-a-quote/");
  await expect(page.getByText("Kit for Multiplexes & Cinemas.")).toBeVisible();
  await expect(page.locator("#main").getByRole("link", { name: "3-Ply Corrugated Boxes" })).toBeVisible();
  await expect(page.locator("#main").getByRole("link", { name: "Popcorn Cones" })).toBeVisible();
});

test("enquiry API rejects invalid submissions", async ({ request }) => {
  const res = await request.post("/api/enquiry/", { multipart: { type: "quote", startedAt: String(Date.now() - 10000), name: "A", email: "bad", consent: "no", items: "[]" } });
  expect(res.status()).toBe(422);
  const json = await res.json();
  expect(json.fields).toHaveProperty("email");
});

test("Mira answers the cinema scenario with product cards", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.getByRole("button", { name: isMobile ? "Mira" : "Ask Mira" }).click();
  await page.getByRole("button", { name: /We run a cinema/ }).click();
  await expect(page.getByRole("dialog", { name: /Mira/ }).getByRole("link", { name: "Popcorn Tubs" })).toBeVisible({ timeout: 20000 });
});

test("search finds products by alternative names", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop feature");
  await page.goto("/");
  await page.getByRole("button", { name: /Search products/ }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("mithai");
  await expect(page.getByRole("dialog", { name: "Search" }).getByText("Sweet Boxes").first()).toBeVisible();
});

test("WhatsApp link carries product context", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop dock");
  await page.goto("/products/plastic-products-films/bopp-hst-rolls/");
  await reveal(page);
  const href = await page.getByRole("link", { name: /Ask about BOPP Heat-Sealable/ }).first().getAttribute("href");
  expect(decodeURIComponent(href ?? "")).toContain("BOPP Heat-Sealable (HST) Rolls");
});

test("mega menu opens and links to a category", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await page.locator("#panel-products").getByRole("link", { name: "Corrugated & Fluted Products" }).click();
  await expect(page).toHaveURL(/corrugated-fluted-products\/$/);
});

test("mobile menu opens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
});
