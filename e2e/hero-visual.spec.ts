import { test, expect, type Page } from "@playwright/test";
import { waitForAppReady, forceEnglishLocale, FREEZE_CSS } from "./helpers";

// ═══════════════════════════════════════════════════════════════════════
// Hero / Stats / CTA visual regression — desktop + mobile
// Catches typography, padding, glass-card, and CTA layout drift.
// ═══════════════════════════════════════════════════════════════════════

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile",  width: 390,  height: 844 },
] as const;

async function prepHome(page: Page) {
  await forceEnglishLocale(page);
  await page.goto("/");
  await waitForAppReady(page);
  await page.addStyleTag({ content: FREEZE_CSS });
  // CountUp finishes within ~2.2s; wait for its final number to render.
  await page
    .locator('text=/^26\\+$/')
    .first()
    .waitFor({ state: "visible", timeout: 5000 })
    .catch(() => { /* ignore */ });
  await page.evaluate(() => window.scrollTo(0, 0));
}

test.describe("Hero section — visual regression", () => {
  for (const vp of VIEWPORTS) {
    test(`hero — ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await prepHome(page);

      const hero = page.locator("section").first();
      await expect(hero).toHaveScreenshot(`hero-${vp.name}.png`, {
        maxDiffPixelRatio: 0.03,
      });
    });

    test(`hero CTA buttons — ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await prepHome(page);

      const ctas = page
        .locator('a:has-text("BROWSE EQUIPMENT")')
        .first()
        .locator("xpath=..");
      await expect(ctas).toHaveScreenshot(`hero-ctas-${vp.name}.png`, {
        maxDiffPixelRatio: 0.03,
      });
    });

    test(`hero stats grid — ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await prepHome(page);

      // The stats grid contains the four glass-cards labeled "Years Experience"…
      const stats = page
        .locator('div:has(> div:has-text("Years Experience"))')
        .filter({ has: page.locator('text=Equipment Units') })
        .first();
      await expect(stats).toHaveScreenshot(`hero-stats-${vp.name}.png`, {
        maxDiffPixelRatio: 0.03,
      });
    });
  }
});