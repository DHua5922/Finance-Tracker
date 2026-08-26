import type { PlaywrightTestConfig } from "@playwright/test";

const reuseExistingServer = !process.env.CI;

export const playwrightWebServers = [
  {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer,
    timeout: 120 * 1000,
  },
  {
    command: "pnpm dev:inngest",
    url: "http://localhost:8288",
    reuseExistingServer,
    timeout: 120 * 1000,
  },
] satisfies PlaywrightTestConfig["webServer"];
