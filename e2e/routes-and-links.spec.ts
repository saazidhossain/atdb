import { test, expect, type Page } from "@playwright/test";

// ── All routes the app should serve ──────────────────────────────────
const ROUTES = [
  { path: "/", title: "ATDB", h1: true },
  { path: "/equipment", title: "Equipment", h1: true },
  { path: "/equipment/cranes", title: "Crane", h1: true },
  { path: "/equipment/rollers", title: "Roller", h1: true },
  { path: "/equipment/excavators", title: "Excavator", h1: true },
  { path: "/equipment/loaders", title: "Loader", h1: true },
  { path: "/equipment/support", title: "Support", h1: true },
  { path: "/projects", title: "Project", h1: true },
  { path: "/about", title: "About", h1: true },
  { path: "/contact", title: "Contact", h1: true },
];

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Equipment", to: "/equipment" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// ── Helper: wait for page load ───────────────────────────────────────
async function waitForApp(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500); // allow hydration
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Every route loads without error
// ═══════════════════════════════════════════════════════════════════════
test.describe("@smoke Page routes load correctly", () => {
  for (const route of ROUTES) {
    test(`${route.path} renders with correct title`, async ({ page }) => {
      const response = await page.goto(route.path);
      await waitForApp(page);

      // No server error
      expect(response?.status()).toBeLessThan(400);

      // Title contains expected text
      const title = await page.title();
      expect(title.toLowerCase()).toContain(route.title.toLowerCase());

      // No uncaught JS errors
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.waitForTimeout(1000);
      expect(errors).toHaveLength(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 2. Navbar links all work
// ═══════════════════════════════════════════════════════════════════════
test.describe("@smoke Navigation links", () => {
  test("desktop nav contains all links and they navigate correctly", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    for (const link of NAV_LINKS) {
      const navLink = page.locator(`nav a[href="${link.to}"]`).first();
      await expect(navLink).toBeVisible();
    }
  });

  test("clicking each nav link navigates to correct page", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    for (const link of NAV_LINKS) {
      await page.goto("/"); // reset
      await waitForApp(page);

      const navLink = page.locator(`nav a[href="${link.to}"]`).first();
      await navLink.click();
      await page.waitForURL(`**${link.to}`);
      expect(page.url()).toContain(link.to === "/" ? "/" : link.to);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 3. Equipment listing shows items and links to detail
// ═══════════════════════════════════════════════════════════════════════
test.describe("Equipment pages", () => {
  test("equipment index shows category cards", async ({ page }) => {
    await page.goto("/equipment");
    await waitForApp(page);

    // Should have category links (cranes, rollers, etc.)
    const categoryLinks = page.locator('a[href*="/equipment/"]');
    const count = await categoryLinks.count();
    expect(count).toBeGreaterThan(3);
  });

  test("category page shows equipment cards with PDF buttons", async ({ page }) => {
    await page.goto("/equipment/cranes");
    await waitForApp(page);

    // Equipment cards should exist
    const cards = page.locator('[class*="card"], [class*="Card"], article, [data-equipment]');
    await expect(cards.first()).toBeVisible({ timeout: 5000 });

    // PDF download buttons should exist on each card
    const pdfButtons = page.locator('button[title*="PDF"], button[title*="pdf"]');
    const pdfCount = await pdfButtons.count();
    expect(pdfCount).toBeGreaterThan(0);
  });

  test("equipment detail page loads and shows spec sheet button", async ({ page }) => {
    // Navigate to first equipment in cranes
    await page.goto("/equipment/cranes");
    await waitForApp(page);

    const firstLink = page.locator('a[href*="/equipment/cranes/ATDB-"]').first();
    await firstLink.click();
    await page.waitForURL("**/equipment/cranes/ATDB-*");
    await waitForApp(page);

    // Should have a download spec sheet button
    const pdfBtn = page.locator('button:has-text("Spec Sheet"), button:has-text("PDF")');
    await expect(pdfBtn.first()).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 4. 404 page for unknown routes
// ═══════════════════════════════════════════════════════════════════════
test("@smoke unknown route shows 404 / not-found", async ({ page }) => {
  await page.goto("/this-does-not-exist-xyz");
  await waitForApp(page);

  const body = await page.textContent("body");
  // Should have some indication it's a 404
  expect(
    body?.includes("404") || body?.includes("not found") || body?.toLowerCase().includes("page not found")
  ).toBeTruthy();
});
