import "dotenv/config";

import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { z } from "zod";
import { playwrightWebServers } from "../e2e/playwright.web-servers";

const appBaseUrl = z.url().parse(process.env.APP_BASE_URL);

export default defineConfig({
  testDir: path.resolve(__dirname, "../../../.."),
  testMatch: "**/*.accessibility.test.{ts,tsx}",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: appBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: playwrightWebServers,
});
