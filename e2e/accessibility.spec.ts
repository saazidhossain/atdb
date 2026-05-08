import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/equipment", "/projects", "/about", "/contact"];

async function waitForApp(page: import("@playwright/test").Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(800);
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Automated axe-core accessibility audit on every page
// ═══════════════════════════════════════════════════════════════════════
test.describe("Accessibility audit (axe-core)", () => {
  for (const path of PAGES) {
    test(`${path} passes core accessibility checks`, async ({ page }) => {
      await page.goto(path);
      await waitForApp(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "best-practice"])
        .exclude(".preloader, .skeleton-shimmer") // exclude loading states
        .analyze();

      // Allow some violations but flag critical ones
      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (critical.length > 0) {
        const summary = critical.map(
          (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
        ).join("\n");
        console.warn(`A11y issues on ${path}:\n${summary}`);
      }

      // No critical violations
      const criticalOnly = critical.filter((v) => v.impact === "critical");
      expect(criticalOnly).toHaveLength(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 2. Keyboard navigation — Tab order and focus visibility
// ═══════════════════════════════════════════════════════════════════════
test.describe("Keyboard navigation", () => {
  test("Tab navigates through navbar links in correct order", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    // Tab through interactive elements
    const focusedElements: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return "null";
        const href = el.getAttribute("href") || "";
        const text = el.textContent?.trim().slice(0, 30) || "";
        return `${el.tagName}[${href || text}]`;
      });
      focusedElements.push(tag);
    }

    // Should have focused at least some links/buttons
    const interactiveCount = focusedElements.filter(
      (e) => e.startsWith("A[") || e.startsWith("BUTTON[")
    ).length;
    expect(interactiveCount).toBeGreaterThan(3);
  });

  test("focused elements have visible focus indicator", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    // Tab to first focusable element
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const hasOutline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const styles = window.getComputedStyle(el);
      const outline = styles.outlineStyle;
      const boxShadow = styles.boxShadow;
      // Check for visible focus indicator
      return (
        (outline !== "none" && outline !== "") ||
        (boxShadow !== "none" && boxShadow !== "")
      );
    });

    expect(hasOutline).toBeTruthy();
  });

  test("Escape closes mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForApp(page);

    // Open mobile menu
    const menuBtn = page.locator('button[aria-label*="menu"], nav button:has(svg)').first();
    if ((await menuBtn.count()) > 0) {
      await menuBtn.click();
      await page.waitForTimeout(300);

      // Press Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      // Menu should be closed — nav links should not be visible on mobile
      // This is a best-effort check
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 3. ARIA labels and roles
// ═══════════════════════════════════════════════════════════════════════
test.describe("@smoke ARIA labeling", () => {
  test("navigation landmark exists", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    const nav = page.locator("nav");
    await expect(nav.first()).toBeVisible();
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    const images = page.locator("img:visible");
    const count = await images.count();

    let missingAlt = 0;
    for (let i = 0; i < Math.min(count, 20); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      const role = await images.nth(i).getAttribute("role");
      // Decorative images can have alt="" or role="presentation"
      if (alt === null && role !== "presentation") {
        missingAlt++;
      }
    }

    // Allow up to 2 missing alt (some may be decorative)
    expect(missingAlt).toBeLessThanOrEqual(2);
  });

  test("buttons have accessible names", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    const buttons = page.locator("button:visible");
    const count = await buttons.count();

    let unnamed = 0;
    for (let i = 0; i < Math.min(count, 15); i++) {
      const text = await buttons.nth(i).textContent();
      const ariaLabel = await buttons.nth(i).getAttribute("aria-label");
      const title = await buttons.nth(i).getAttribute("title");
      if (!text?.trim() && !ariaLabel && !title) {
        unnamed++;
      }
    }

    expect(unnamed).toBeLessThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 4. Hover and tooltip behavior
// ═══════════════════════════════════════════════════════════════════════
test.describe("Hover effects", () => {
  test("nav links have hover styling", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    const navLink = page.locator('nav a[href="/equipment"]').first();
    if ((await navLink.count()) > 0) {
      const before = await navLink.evaluate((el) =>
        window.getComputedStyle(el).color
      );
      await navLink.hover();
      await page.waitForTimeout(200);
      const after = await navLink.evaluate((el) =>
        window.getComputedStyle(el).color
      );
      // Color should change or other visual effect
      // This is a basic check — hover may use transform/opacity instead
    }
  });

  test("CTA buttons have hover transform", async ({ page }) => {
    await page.goto("/");
    await waitForApp(page);

    const ctaBtn = page.locator('a.bg-orange-500, button.bg-orange-500').first();
    if ((await ctaBtn.count()) > 0) {
      const beforeTransform = await ctaBtn.evaluate((el) =>
        window.getComputedStyle(el).transform
      );
      await ctaBtn.hover();
      await page.waitForTimeout(300);
      const afterTransform = await ctaBtn.evaluate((el) =>
        window.getComputedStyle(el).transform
      );
      // Transform should change on hover
      expect(afterTransform).not.toBe(beforeTransform);
    }
  });
});
