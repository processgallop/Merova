import { expect, test } from "@playwright/test";

/** Critical public journeys (brief §20, A–G). */

test("E · homepage → industry discovery shows cross-segment products", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const finder = page.locator("#industry-finder");
  await finder.scrollIntoViewIfNeeded();
  if (isMobile) await finder.getByRole("combobox", { name: "Select your industry" }).selectOption({ label: "Multiplexes & Cinemas" });
  else await finder.getByRole("button", { name: /Multiplexes/ }).click();
  await expect(finder.getByRole("heading", { name: "Multiplexes & Cinemas" })).toBeVisible();
  await expect(finder.getByRole("link", { name: "Popcorn Tubs" }).first()).toBeVisible();
  await finder.getByRole("link", { name: /Filter all/ }).click();
  await expect(page).toHaveURL(/\/industries\?industry=cinema-multiplex-packaging/);
});

test("A · industry → product → quote → backend confirmation", async ({ page }) => {
  await page.goto("/industries/automotive-packaging");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Automotive & Auto Components");
  await page.getByRole("link", { name: "5-Ply Corrugated Boxes" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("5-Ply Corrugated Boxes");
  await page.getByRole("main").getByRole("link", { name: "Request a Quote" }).first().click();
  await expect(page).toHaveURL(/request-a-quote\?products=5-ply-boxes/);
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Ply", { exact: true }).selectOption("5-ply");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.fill("#name", "Journey A");
  await page.fill("#email", "journey.a@example.com");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page).toHaveURL(/enquiry-received\?ref=MRV-\d{8}-[A-F0-9]{6}/);
  await expect(page.getByText("Your reference:")).toBeVisible();
});

test("B · industry → multiple products → consolidated quote", async ({ page }) => {
  await page.goto("/industries/cinema-multiplex-packaging");
  for (const name of ["Popcorn Tubs", "Nachos Trays", "Popcorn Cones"]) {
    await page.getByRole("button", { name: `Add ${name} to enquiry` }).first().click();
  }
  const tray = page.getByRole("region", { name: "Selected products" });
  await expect(tray).toBeVisible();
  await tray.getByRole("link", { name: /quote/i }).click();
  await expect(page).toHaveURL(/request-a-quote\?products=/);
  await expect(page.locator(".chip.is-active")).toHaveCount(3);
  await page.waitForTimeout(3000);
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Continue" }).click();
  await page.fill("#name", "Journey B");
  await page.fill("#email", "journey.b@example.com");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page).toHaveURL(/enquiry-received/);
});

test("C · product → flyer download returns a real PDF", async ({ page }) => {
  await page.goto("/products/foodservice-packaging/popcorn-tubs");
  const href = await page.getByRole("link", { name: "Download Flyer" }).first().getAttribute("href");
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("D · product → contact / WhatsApp route is always available", async ({ page }) => {
  await page.goto("/products/foodservice-packaging/popcorn-cones");
  await page.getByRole("button", { name: "Chat with Merova" }).click();
  const dialog = page.getByRole("dialog", { name: "Contact Merova" });
  await expect(dialog).toBeVisible();
  // Without a verified business number the dock offers the contact form instead of a fake WhatsApp link.
  await expect(dialog.getByRole("link", { name: "Contact form" })).toBeVisible();
});

test("F · resources → catalogue download", async ({ page }) => {
  await page.goto("/resources");
  const href = await page.locator('a[data-track-download="catalogue"]').getAttribute("href");
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("G · MIRA → product discovery → enquiry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask MIRA" }).click();
  const mira = page.getByRole("dialog", { name: /MIRA/ });
  await expect(mira.getByText("I'm MIRA, an AI assistant")).toBeVisible();
  await mira.getByLabel("Message MIRA").fill("We run a multiplex cinema and need popcorn packaging");
  await mira.getByRole("button", { name: "Send" }).click();
  await expect(mira.getByRole("link", { name: /quote/i }).first()).toBeVisible({ timeout: 30000 });
  const quote = mira.getByRole("link", { name: /quote/i }).last();
  await quote.click();
  await expect(page).toHaveURL(/request-a-quote/);
});

test("filters refine industry results and reset", async ({ page, isMobile }) => {
  test.skip(isMobile, "filter drawer covered by desktop run");
  await page.goto("/industries?industry=food-packaging");
  await expect(page.getByRole("heading", { name: "Food & Beverage" }).first()).toBeVisible();
  await page.getByRole("button", { name: /Plastic & Flexible/ }).first().click();
  await page.getByLabel("Packaging material").selectOption("ldpe");
  await expect(page.getByRole("link", { name: /LDPE/ }).first()).toBeVisible();
  await expect(page).toHaveURL(/segment=D/);
  await expect(page).toHaveURL(/material=ldpe/);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page).not.toHaveURL(/material=/);
});

test("SEO essentials are generated", async ({ page }) => {
  const sm = await (await page.request.get("/sitemap.xml")).text();
  expect(sm).toContain("/products/corrugated-packaging/3-ply-boxes");
  expect(sm).toContain("/industries/automotive-packaging");
  const robots = await (await page.request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");
  await page.goto("/products/corrugated-packaging/3-ply-boxes");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /3-ply-boxes$/);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join(" ")).toContain('"@type":"Product"');
  // Legacy URLs redirect
  const old = await page.request.get("/corrugated-packaging/3-ply-boxes", { maxRedirects: 0 });
  expect([301, 308]).toContain(old.status());
});

test("unknown pages return a branded 404 with routes onward", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Find packaging for your industry" })).toBeVisible();
});
