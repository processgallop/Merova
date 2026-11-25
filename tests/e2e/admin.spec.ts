import { expect, test } from "@playwright/test";
import { expectToast, login, pdf, pollIn, pollStatus, pollText } from "./helpers";

/**
 * Backend acceptance tests (brief §21). They run in order against one fresh
 * in-memory database, so later tests build on records created earlier.
 */
test.describe.configure({ mode: "serial" });

const SEG = { name: "QA Test Segment", slug: "qa-test-segment" };
const PROD = { name: "QA Test Carton", code: "MRV-QA-01", slug: "qa-test-carton", slug2: "qa-test-carton-renamed" };
const IND = { name: "QA Test Industry", slug: "qa-test-industry" };
let productId = "";

test.beforeEach(async ({ page }) => login(page));

test("1 · create a product segment and see it on the website", async ({ page }) => {
  await page.goto("/admin/segments/new");
  await page.fill("#f-name", SEG.name);
  await page.fill("#f-navName", "QA Segment");
  await page.fill("#f-code", "Q");
  await page.fill("#f-slug", SEG.slug);
  await page.getByRole("button", { name: "Save & publish" }).click();
  await page.waitForURL(/\/admin\/segments\/\d+$/);
  await pollStatus(page, `/products/${SEG.slug}`, 200);
  await pollIn(page, "/products", "main section h2", SEG.name);
});

test("2 · add a product and assign it to a segment", async ({ page }) => {
  await page.goto("/admin/products/new");
  await page.fill("#f-name", PROD.name);
  await page.fill("#f-code", PROD.code);
  await page.fill("#f-slug", PROD.slug);
  await page.selectOption("#f-segmentSlug", SEG.slug);
  await page.fill("#f-summary", "A QA product used by the automated acceptance tests.");
  await page.getByRole("tab", { name: "Technical" }).click();
  await page.selectOption("#f-availability", "offered");
  await page.getByRole("button", { name: "Save & publish" }).click();
  await page.waitForURL(/\/admin\/products\/\d+$/);
  productId = page.url().split("/").pop()!;
  await pollStatus(page, `/products/${SEG.slug}/${PROD.slug}`, 200);
  await pollIn(page, `/products/${SEG.slug}`, "#range article", PROD.name);
});

test("3 · associate the product with two industries", async ({ page }) => {
  await page.goto(`/admin/products/${productId}`);
  await page.getByRole("tab", { name: "Industries & related" }).click();
  await page.getByRole("button", { name: "Add industry" }).click();
  await page.getByRole("button", { name: "Add industry" }).click();
  const selects = page.getByLabel("Industry", { exact: true });
  await selects.nth(0).selectOption("automotive-packaging");
  await selects.nth(1).selectOption("retail-packaging");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Saved/);
  await pollIn(page, "/industries/automotive-packaging", "#solutions article", PROD.name);
  await pollIn(page, "/industries/retail-packaging", "#solutions article", PROD.name);
});

test("4 · remove one industry association; the product remains", async ({ page }) => {
  await page.goto(`/admin/products/${productId}`);
  await page.getByRole("tab", { name: "Industries & related" }).click();
  const rows = page.locator("li").filter({ has: page.getByLabel("Industry", { exact: true }) });
  await rows.first().getByRole("button", { name: "Remove" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Saved/);
  await pollIn(page, "/industries/automotive-packaging", "#solutions article", PROD.name, false);
  await pollIn(page, "/industries/retail-packaging", "#solutions article", PROD.name);
  await pollStatus(page, `/products/${SEG.slug}/${PROD.slug}`, 200);
});

test("5 · add a new industry and publish its landing page", async ({ page }) => {
  await page.goto("/admin/industries/new");
  await page.fill("#f-name", IND.name);
  await page.fill("#f-slug", IND.slug);
  await page.fill("#f-intro", "Industry created by the acceptance tests.");
  await page.getByRole("tab", { name: "Product mapping" }).click();
  await page.getByRole("button", { name: "Add product" }).click();
  await page.getByLabel("Product", { exact: true }).first().selectOption(PROD.slug);
  await page.getByRole("button", { name: "Save & publish" }).click();
  await page.waitForURL(/\/admin\/industries\/\d+$/);
  await pollStatus(page, `/industries/${IND.slug}`, 200);
  await pollIn(page, `/industries/${IND.slug}`, "#solutions article", PROD.name);
  await pollIn(page, "/industries", "main a", IND.name);
});

test("6 · change the homepage hero heading and image", async ({ page }) => {
  await page.goto("/admin/pages/home");
  await page.getByRole("button", { name: /Hero banner/ }).click();
  await page.fill("#f-heading", "QA Headline For The Homepage");
  await page.getByRole("button", { name: "Replace" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Choose media" });
  await dialog.getByPlaceholder("Search media…").fill("industry-cinema");
  await dialog.locator("ul button").first().click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Saved/);
  await pollText(page, "/", "QA Headline");
  await expect
    .poll(async () => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      return (await page.locator("main section").first().locator("img").first().getAttribute("src")) ?? "";
    }, { timeout: 40000, intervals: [1000, 2000] })
    .toContain("industry-cinema");
});

test("7 · change the primary brand colour and see it applied site-wide", async ({ page }) => {
  await page.goto("/admin/appearance");
  await page.fill("#f-primary", "#0b6e4f");
  await page.getByRole("button", { name: "Save & apply" }).click();
  await expectToast(page, /Saved/);
  for (const url of ["/", "/products", "/contact"]) await pollText(page, url, "--c-red:#0b6e4f");
  // restore the official palette
  await page.getByRole("button", { name: "Load defaults" }).click();
  await page.getByRole("button", { name: "Save & apply" }).click();
  await pollText(page, "/", "--c-red:#d52b1e");
});

test("8 · create and publish a knowledge-centre article", async ({ page }) => {
  await page.goto("/admin/posts/new");
  await page.fill("#f-title", "QA Article On Board Grades");
  await page.fill("#f-slug", "qa-article-board-grades");
  await page.fill("#f-excerpt", "An article published by the automated tests.");
  await page.getByRole("tab", { name: "Body" }).click();
  await page.getByPlaceholder("Section heading").first().fill("Why grades matter");
  await page.getByPlaceholder("Body (Markdown)").first().fill("Board grade drives **stacking strength**.\n\n- Point one\n- Point two");
  await page.getByRole("button", { name: "Save & publish" }).click();
  await page.waitForURL(/\/admin\/posts\/\d+$/);
  await pollText(page, "/knowledge/qa-article-board-grades", "stacking strength");
  await pollIn(page, "/knowledge", "main a", "QA Article On Board Grades");
});

test("9 · upload and replace a product PDF flyer", async ({ page }) => {
  await page.goto(`/admin/products/${productId}`);
  await page.getByRole("tab", { name: "Media & flyer" }).click();
  await page.locator('input[type=file][accept="application/pdf"]').setInputFiles(pdf("flyer-v1"));
  await expect(page.locator("a", { hasText: "flyer-v1.pdf" })).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Saved/);
  const url = `/products/${SEG.slug}/${PROD.slug}`;
  await pollText(page, url, "flyer-v1.pdf");
  const html1 = await (await page.request.get(url)).text();
  const href1 = html1.match(/href="(\/media\/[^"]+flyer-v1\.pdf)"/)![1];
  const r1 = await page.request.get(href1);
  expect(r1.status()).toBe(200);
  expect(r1.headers()["content-type"]).toContain("application/pdf");
  expect(await r1.text()).toContain("flyer-v1");
  await page.locator('input[type=file][accept="application/pdf"]').setInputFiles(pdf("flyer-v2"));
  await expect(page.locator("a", { hasText: "flyer-v2.pdf" })).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Saved/);
  await pollText(page, url, "flyer-v2.pdf");
  const href2 = (await (await page.request.get(url)).text()).match(/href="(\/media\/[^"]+flyer-v2\.pdf)"/)![1];
  expect(await (await page.request.get(href2)).text()).toContain("flyer-v2");
});

test("10 · receive a website enquiry and manage its status", async ({ page, browser }) => {
  const visitor = await browser.newPage();
  await visitor.goto(`/request-a-quote?products=${PROD.slug},5-ply-boxes&industry=retail-packaging`);
  await expect(visitor.locator(".chip.is-active")).toHaveCount(2);
  await visitor.waitForTimeout(3000); // the form enforces a minimum completion time
  for (let i = 0; i < 3; i++) await visitor.getByRole("button", { name: "Continue" }).click();
  await visitor.fill("#name", "QA Buyer");
  await visitor.fill("#company", "QA Industries");
  await visitor.fill("#email", "qa.buyer@example.com");
  await visitor.getByLabel(/I agree that Merova may contact me/).check();
  await visitor.getByRole("button", { name: "Submit enquiry" }).click();
  await visitor.waitForURL(/enquiry-received\?ref=MRV-/);
  const ref = new URL(visitor.url()).searchParams.get("ref")!;
  await visitor.close();
  await page.goto("/admin/enquiries");
  await page.getByRole("link", { name: "QA Buyer" }).click();
  await expect(page.getByText(ref)).toBeVisible();
  await expect(page.getByText(PROD.name).first()).toBeVisible();
  await page.getByLabel("Lead status").selectOption("quotation_in_progress");
  await expectToast(page, /updated/i);
  await page.getByLabel("Internal note").fill("Called the buyer — sampling next week.");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByText("Called the buyer — sampling next week.")).toBeVisible();
  await page.goto("/admin/enquiries?status=quotation_in_progress");
  await expect(page.getByRole("link", { name: "QA Buyer" })).toBeVisible();
});

test("11 · change a product URL and the previous URL redirects", async ({ page }) => {
  await page.goto(`/admin/products/${productId}`);
  await page.fill("#f-slug", PROD.slug2);
  await expect(page.getByText("create a 301 redirect")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expectToast(page, /Redirect created/);
  await pollStatus(page, `/products/${SEG.slug}/${PROD.slug}`, 308);
  const res = await page.request.get(`/products/${SEG.slug}/${PROD.slug}`);
  expect(res.url()).toContain(PROD.slug2);
  expect(res.status()).toBe(200);
});

test("12 · restricted roles cannot perform unauthorised operations", async ({ page, browser }) => {
  await page.goto("/admin/users");
  await page.getByPlaceholder("Full name").fill("QA Sales");
  await page.getByPlaceholder("Email").fill("qa.sales@merova.local");
  await page.getByLabel("Role", { exact: true }).selectOption("sales_admin");
  await page.getByRole("button", { name: "Create user" }).click();
  const pw = (await page.getByRole("alert").filter({ hasText: "Temporary password" }).locator("code").textContent())!.trim();
  const ctx = await browser.newContext();
  const sales = await ctx.newPage();
  await login(sales, "qa.sales@merova.local", pw);
  for (const url of ["/admin/users", "/admin/appearance", "/admin/settings", "/admin/media", "/admin/audit"]) {
    await sales.goto(url);
    await expect(sales.getByText("You don't have permission to view this.")).toBeVisible();
  }
  await sales.goto(`/admin/products/${productId}`);
  await expect(sales.getByText("Read-only")).toBeVisible();
  await expect(sales.getByRole("button", { name: "Save changes" })).toHaveCount(0);
  const upload = await sales.request.post("/api/admin/media", { multipart: { file: pdf("nope") } });
  expect(upload.status()).toBe(403);
  // Sales can work enquiries
  await sales.goto("/admin/enquiries");
  await expect(sales.getByRole("heading", { level: 1, name: "Enquiries" })).toBeVisible();
  // Signed-out visitors cannot reach admin APIs
  const anon = await browser.newContext();
  expect((await anon.request.get("/api/admin/media")).status()).toBe(401);
  expect((await anon.request.get("/api/admin/enquiries/export")).status()).toBe(403);
  await ctx.close();
  await anon.close();
});

test("13 · drafts and unpublished content are not publicly accessible", async ({ page }) => {
  await page.goto("/admin/products/new");
  await page.fill("#f-name", "QA Draft Product");
  await page.fill("#f-code", "MRV-QA-DRAFT");
  await page.fill("#f-slug", "qa-draft-product");
  await page.selectOption("#f-segmentSlug", SEG.slug);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(/\/admin\/products\/\d+$/);
  const id = page.url().split("/").pop();
  await pollStatus(page, `/products/${SEG.slug}/qa-draft-product`, 404);
  expect(await (await page.request.get("/sitemap.xml")).text()).not.toContain("qa-draft-product");
  await pollIn(page, `/products/${SEG.slug}`, "#range article", "QA Draft Product", false);
  // Staff can preview it
  await page.goto(`/preview/product/${id}`);
  await expect(page.getByRole("heading", { level: 1, name: "QA Draft Product" })).toBeVisible();
});

test("14 · archiving or deleting content does not break other pages", async ({ page }) => {
  await page.goto("/admin/industries");
  await page.getByRole("link", { name: IND.name }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/industries$/);
  await pollStatus(page, `/industries/${IND.slug}`, 404);
  await pollStatus(page, "/industries", 200);
  await pollStatus(page, `/products/${SEG.slug}/${PROD.slug2}`, 200);
  // Archive the product: its page disappears, industry and segment pages still render
  await page.goto(`/admin/products/${productId}`);
  await page.getByRole("button", { name: "Archive" }).click();
  await expectToast(page, /Saved/);
  await pollStatus(page, `/products/${SEG.slug}/${PROD.slug2}`, 404);
  await pollStatus(page, "/industries/retail-packaging", 200);
  await pollIn(page, "/industries/retail-packaging", "#solutions article", PROD.name, false);
  await pollStatus(page, `/products/${SEG.slug}`, 200);
  // A segment with products cannot be deleted without reassignment
  await page.goto("/admin/segments");
  const del = page.getByLabel("Delete segment");
  await del.selectOption((await del.locator("option", { hasText: "QA Test Segment" }).getAttribute("value"))!);
  await expect(page.getByRole("button", { name: "Reassign & delete" })).toBeDisabled();
});

test("15 · core dashboard functions work on mobile", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await ctx.newPage();
  await login(m);
  await expect(m.getByRole("heading", { name: /Good to see you/ })).toBeVisible();
  await m.getByRole("button", { name: "Menu", exact: true }).click();
  await m.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Enquiries" }).click();
  await expect(m.getByRole("heading", { level: 1, name: "Enquiries" })).toBeVisible();
  await m.getByRole("button", { name: "Menu", exact: true }).click();
  await m.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Products" }).click();
  await expect(m.getByRole("heading", { level: 1, name: "Products" })).toBeVisible();
  expect(await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await ctx.close();
});
