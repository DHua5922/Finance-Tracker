import { expect, test } from "@playwright/test";
import { closeAccount, signUp } from "@/shared/test/e2e/auth.utilities.e2e";

test("dashboard should load without crashing", async ({ page }, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const projectName = testInfo.project.name.toLowerCase();
  const username = `dashboard${runId}`;
  const email = `dashboard${runId}${projectName}@example.com`;
  const password = "SecurePass123!";
  let accountCreated = false;
  let accountClosed = false;

  try {
    await signUp(page, username, email, password);
    accountCreated = true;
    await page.goto("/dashboard");

    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: `Welcome back, ${username}` }),
    ).toBeVisible();

    await closeAccount(page);
    accountClosed = true;
  } finally {
    if (accountCreated && !accountClosed) {
      await closeAccount(page).catch(() => {});
    }
  }
});
