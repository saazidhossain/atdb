import { test, expect } from "@playwright/test";

// ═══════════════════════════════════════════════════════════════════════
// Visual regression — screenshot every page at desktop, tablet, mobile
// ═══════════════════════════════════════════════════════════════════════

const PAGES = [
  { path: "/", name: "home" },
  { path: "/equipment", name: "equipment-index" },
  { path: "/equipment/cranes", name: "equipment-cranes" },
  { path: "/equipment/rollers", name: "equipment-rollers" },
  { path: "/projects", name: "projects" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

async function waitForApp(page: import("@playwright/test").Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500); // allow animations to settle
  // Disable animations for stable screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  await page.waitForTimeout(200);
}

test.describe("Visual regression — full page screenshots", () => {
  for (const pg of PAGES) {
    test(`${pg.name} — desktop layout`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pg.path);
      await waitForApp(page);

      await expect(page).toHaveScreenshot(`${pg.name}-desktop.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      });
    });

    test(`${pg.name} — mobile layout`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(pg.path);
      await waitForApp(page);

      await expect(page).toHaveScreenshot(`${pg.name}-mobile.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      });
    });

    test(`${pg.name} — tablet layout`, async ({ page }) => {
      await page.setViewportSize({ width: 820, height: 1180 });
      await page.goto(pg.path);
      await waitForApp(page);

      await expect(page).toHaveScreenshot(`${pg.name}-tablet.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      });
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// Component-level visual checks
// ═══════════════════════════════════════════════════════════════════════
test.describe("Component visual regression", () => {
  test("navbar scrolled state", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForApp(page);

    // Scroll down to trigger navbar state change
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });

    const navbar = page.locator("header").first();
    await expect(navbar).toHaveScreenshot("navbar-scrolled.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("equipment card hover state", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/equipment/cranes");
    await waitForApp(page);

    const card = page.locator('a[href*="/equipment/cranes/ATDB-"]').first();
    if ((await card.count()) > 0) {
      await card.hover();
      await page.waitForTimeout(400);
      await page.addStyleTag({
        content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
      });

      await expect(card).toHaveScreenshot("equipment-card-hover.png", {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test("footer renders consistently", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForApp(page);

    const footer = page.locator("footer").first();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });

    await expect(footer).toHaveScreenshot("footer-desktop.png", {
      maxDiffPixelRatio: 0.03,
    });
  });
});
