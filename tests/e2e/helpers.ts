import { expect, type Page } from "@playwright/test";
import { ADMIN } from "../../playwright.config";

export async function login(page: Page, email = ADMIN.email, password = ADMIN.password) {
  await page.goto("/admin/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type=submit]");
  try {
    await page.waitForURL(/\/admin(\/|$)(?!login)/, { timeout: 15000 });
  } catch {
    const msg = await page.locator('[role="alert"]').allTextContents();
    throw new Error(`Login failed for ${email} (${password.length} chars): ${msg.join(" ") || "no message"}`);
  }
}

export async function expectToast(page: Page, text: RegExp) {
  await expect(page.locator('[role="status"], [role="alert"]').filter({ hasText: text }).first()).toBeVisible({ timeout: 15000 });
}

/** ISR pages regenerate after revalidation; poll until the change is visible. */
export async function pollText(page: Page, url: string, text: string | RegExp, present = true) {
  await expect
    .poll(async () => {
      const res = await page.request.get(url, { headers: { "cache-control": "no-cache" } });
      const body = await res.text();
      const hit = typeof text === "string" ? body.includes(text) : text.test(body);
      return hit === present;
    }, { timeout: 30000, intervals: [500, 1000, 2000] })
    .toBe(true);
}

export async function pollStatus(page: Page, url: string, status: number) {
  await expect.poll(async () => (await page.request.get(url, { maxRedirects: 0 })).status(), { timeout: 30000, intervals: [500, 1000, 2000] }).toBe(status);
}

export function pdf(label: string) {
  const body = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n% ${label}\ntrailer<</Root 1 0 R>>\n%%EOF`;
  return { name: `${label}.pdf`, mimeType: "application/pdf", buffer: Buffer.from(body) };
}

/** Poll a rendered page until `text` is (or is not) present inside `selector` (ignores menus/footers). */
export async function pollIn(page: Page, url: string, selector: string, text: string, present = true) {
  await expect
    .poll(async () => {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const n = await page.locator(selector).filter({ hasText: text }).count();
      return n > 0 === present;
    }, { timeout: 40000, intervals: [1000, 2000, 3000] })
    .toBe(true);
}
