import { expect, test } from "@playwright/test";
import {
  closeAccount,
  logIn,
  signUp,
} from "@/shared/test/e2e/auth.utilities.e2e";

test("user should be able to log out", async ({ page }, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const projectName = testInfo.project.name.toLowerCase();
  const username = `auth${runId}`;
  const email = `auth${runId}${projectName}@example.com`;
  const password = "SecurePass123!";
  let accountCreated = false;

  try {
    await signUp(page, username, email, password);
    accountCreated = true;

    await page.getByRole("button", { name: "Open account menu" }).click();
    const menu = page.getByRole("menu", { name: "Account menu" });
    await expect(menu).toContainText(username);
    await expect(menu).toContainText(email);
    await menu.getByRole("menuitem", { name: "Log out" }).click();

    await expect(page).toHaveURL("/");
  } finally {
    if (accountCreated) {
      await logIn(page, email, password).catch(() => {});
      await closeAccount(page).catch(() => {});
    }
  }
});
