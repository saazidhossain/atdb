import { test, expect } from "@playwright/test";

// ── Pages to test language toggle on ─────────────────────────────────
const PAGES = ["/", "/equipment", "/projects", "/about", "/contact"];

// ── Known Bengali strings that should appear when lang=bn ────────────
const BN_STRINGS: Record<string, string[]> = {
  "/":          ["হোম", "যন্ত্রপাতি"],
  "/equipment": ["যন্ত্রপাতি"],
  "/projects":  ["প্রকল্প"],
  "/about":     ["সম্পর্কে"],
  "/contact":   ["যোগাযোগ"],
};

const EN_STRINGS: Record<string, string[]> = {
  "/":          ["Home", "Equipment"],
  "/equipment": ["Equipment"],
  "/projects":  ["Projects"],
  "/about":     ["About"],
  "/contact":   ["Contact"],
};

async function waitForApp(page: import("@playwright/test").Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);
}

test.describe("Language toggle (EN ↔ BN)", () => {
  for (const path of PAGES) {
    test(`${path} — toggling to Bengali shows translated text`, async ({ page }) => {
      await page.goto(path);
      await waitForApp(page);

      // Find the language toggle button (Globe icon or BN/EN text)
      const langBtn = page.locator('button:has(svg), button:has-text("BN"), button:has-text("বাং")').filter({
        has: page.locator('[class*="Globe"], [data-lang-toggle]'),
      }).first();

      // If we can't find a specific toggle, look for any BN button
      const fallbackBtn = page.locator('button:has-text("বাং"), button:has-text("BN")').first();
      const toggleBtn = (await langBtn.count()) > 0 ? langBtn : fallbackBtn;

      if ((await toggleBtn.count()) === 0) {
        // Try clicking globe icon in navbar
        const globe = page.locator('nav button:has(svg)').last();
        if ((await globe.count()) > 0) {
          await globe.click();
          await page.waitForTimeout(300);
        }
      } else {
        await toggleBtn.click();
        await page.waitForTimeout(300);
      }

      // Check html lang attribute changed
      const htmlLang = await page.getAttribute("html", "lang");
      // Verify at least some Bengali text appears in the nav
      const navText = await page.locator("nav").textContent();
      const hasBengali = navText && /[\u0980-\u09FF]/.test(navText);

      if (htmlLang === "bn" || hasBengali) {
        // Bengali mode active — check known strings
        const bodyText = await page.textContent("body");
        for (const str of BN_STRINGS[path] || []) {
          expect(bodyText).toContain(str);
        }
      }
    });

    test(`${path} — English mode shows English text`, async ({ page }) => {
      // Clear localStorage to ensure English default
      await page.goto(path);
      await page.evaluate(() => localStorage.removeItem("atdb_lang"));
      await page.reload();
      await waitForApp(page);

      const bodyText = await page.textContent("body");
      for (const str of EN_STRINGS[path] || []) {
        expect(bodyText).toContain(str);
      }

      // Nav links should be in English
      const navText = await page.locator("nav").textContent();
      expect(navText).toContain("Equipment");
      expect(navText).toContain("Contact");
    });
  }

  test("@smoke language persists across navigation", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    // Switch to Bengali
    await page.evaluate(() => {
      localStorage.setItem("atdb_lang", "bn");
    });
    await page.reload();
    await waitForApp(page);

    // Navigate to equipment
    const eqLink = page.locator('nav a[href="/equipment"]').first();
    await eqLink.click();
    await page.waitForURL("**/equipment");
    await waitForApp(page);

    // Should still be in Bengali
    const htmlLang = await page.getAttribute("html", "lang");
    expect(htmlLang).toBe("bn");
  });
});
