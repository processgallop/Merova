import { expect, test } from "@playwright/test";

const WIDTHS = [360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920, 2560];
const PAGES = ["/", "/industries", "/industries/cinema-multiplex-packaging", "/products", "/products/corrugated-packaging", "/products/foodservice-packaging/popcorn-tubs", "/request-a-quote", "/contact", "/about", "/knowledge", "/resources"];

test("no horizontal overflow on key pages at every breakpoint", async ({ browser }, info) => {
  test.skip(info.project.name !== "desktop", "runs once across all widths");
  test.setTimeout(600_000);
  const problems: string[] = [];
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    for (const p of PAGES) {
      await page.goto(p, { waitUntil: "domcontentloaded" });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 1) problems.push(`${p} @ ${w}px overflows by ${over}px`);
    }
    await page.close();
  }
  expect(problems).toEqual([]);
});
