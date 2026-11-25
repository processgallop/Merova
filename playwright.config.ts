import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);
export const ADMIN = { email: "qa-admin@merova.local", password: "QaAdminPass2026" };

/**
 * End-to-end and acceptance tests. Requires a production build:
 *   NEXT_DIST_DIR=.next-qa npx next build && npx playwright test
 * The server runs on a fresh in-memory database seeded from the same content,
 * so every run starts from a known state.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /public\.spec\.ts|responsive\.spec\.ts/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    env: {
      NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-qa",
      PGLITE_MEMORY: "1",
      ALLOW_DEMO_ENQUIRIES: "1",
      ENQUIRY_RATE_LIMIT: "500",
      LOGIN_RATE_LIMIT: "1000",
      ADMIN_EMAIL: ADMIN.email,
      ADMIN_PASSWORD: ADMIN.password,
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
    timeout: 120_000,
  },
});
