import type { Page } from "@playwright/test";

/**
 * Wait for the app's `window.__APP_READY__` flag, set by PagePreloader once
 * load + fonts + eager images + CountUp + 2× rAF have all settled (hard cap
 * 6s). Snapshot tests should ALWAYS gate on this — never on fixed timeouts.
 */
export async function waitForAppReady(page: Page, timeout = 10_000) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .waitForFunction(
      () => (window as Window & { __APP_READY__?: boolean }).__APP_READY__ === true,
      undefined,
      { timeout },
    )
    .catch(() => {
      /* fall through — caller can still proceed */
    });
  // Belt-and-braces: re-await fonts in the test context too, since the
  // page may have navigated after the initial flag was set.
  await page.evaluate(
    () => (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready,
  );
}

/** CSS that freezes animations + hides flaky overlays for stable snapshots. */
export const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  video, [data-testid="whatsapp-fab"] { visibility: hidden !important; }
`;

/** Force English locale so snapshot text widths are deterministic. */
export async function forceEnglishLocale(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("atdb_lang", "en");
    } catch {
      /* ignore */
    }
  });
}
