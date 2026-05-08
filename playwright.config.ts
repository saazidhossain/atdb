import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const isCI = !!process.env.CI;

/**
 * Retry policy is split per suite so the fast "smoke" lane stays strict
 * (catches real regressions quickly) while the long "full" lane absorbs
 * more transient flake without going red.
 *
 * Selection order (first match wins):
 *   1. SUITE=smoke           → PW_SMOKE_RETRIES (default 1)
 *   2. SUITE=full            → PW_FULL_RETRIES  (default 2)
 *   3. PW_RETRIES set        → that value (back-compat override)
 *   4. CI                    → 2
 *   5. local                 → 0
 *
 * Override any of these from the CI step without changing code:
 *   env:
 *     SUITE: smoke
 *     PW_SMOKE_RETRIES: "0"
 */
const SUITE = (process.env.SUITE ?? "").toLowerCase();
const SMOKE_RETRIES = Number(process.env.PW_SMOKE_RETRIES ?? 1);
const FULL_RETRIES = Number(process.env.PW_FULL_RETRIES ?? 2);
const RETRIES =
  SUITE === "smoke"
    ? SMOKE_RETRIES
    : SUITE === "full"
      ? FULL_RETRIES
      : process.env.PW_RETRIES !== undefined
        ? Number(process.env.PW_RETRIES)
        : isCI
          ? 2
          : 0;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: RETRIES,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [["list"], ["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
  use: {
    baseURL: BASE_URL,
    // Capture rich diagnostics ONLY on retried/failed runs so the artifact
    // is small when everything is green.
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "tablet", use: { ...devices["iPad (gen 7)"] } },
  ],
});
