import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const isCI = !!process.env.CI;
// Tunable from the CI step via env (e.g. PW_RETRIES=3) without touching code.
const RETRIES = Number(process.env.PW_RETRIES ?? (isCI ? 2 : 0));

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  // Auto-retry failed tests in CI to absorb transient flake (network blips,
  // animation timing, snapshot subpixel diffs). Local runs keep retries=0
  // so real failures fail loudly during development.
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
