import { test, expect, type Page } from "@playwright/test";

// ═══════════════════════════════════════════════════════════════════════
// Hero / Stats / CTA visual regression — desktop + mobile
// Catches typography, padding, glass-card, and CTA layout drift.
// ═══════════════════════════════════════════════════════════════════════

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile",  width: 390,  height: 844 },
] as const;

const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  /* Hide elements that cause flake but aren't part of hero layout */
  video, [data-testid="whatsapp-fab"] { visibility: hidden !important; }
`;

async function prepHome(page: Page) {
  // English locale for stable text width
  await page.addInitScript(() => {
    try { localStorage.setItem("atdb_lang", "en"); } catch { /* */ }
  });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  // Allow lazy hero video gating + font swap to settle
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: FREEZE_CSS });
  // Force CountUp end-state by waiting past its longest duration (~2200ms)
  await page.waitForTimeout(800);
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