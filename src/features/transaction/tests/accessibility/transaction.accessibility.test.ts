import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import {
  closeAccountApi,
  loginUserApi,
  signUpUserApi,
} from "@/features/auth/lib/api/auth.api";

test("transaction page and form have no WCAG A or AA violations", async ({
  page,
}, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const email = `accessibility${runId}@example.com`;
  const username = `accessibility${runId}`;
  const password = "SecurePass123!";

  await signUpUserApi({
    username,
    email,
    password,
    confirmPassword: password,
  });

  try {
    await logIn(page, email, password);
    await page.goto("/transaction");

    await expect(
      page.getByRole("heading", { name: "Transactions", level: 1 }),
    ).toBeVisible();
    await expectTransactionAccessibility(page);

    await page.getByRole("button", { name: "Add transaction" }).click();
    const dialog = page.getByRole("dialog", { name: "Add transaction" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("opacity", "1");
    await expectTransactionAccessibility(page);
  } finally {
    await cleanUpAccount(email, password);
  }
});

async function logIn(page: Page, email: string, password: string) {
  await page.goto("/");
  await page
    .locator("#main-content")
    .getByRole("button", { name: /get started/i })
    .click();

  const authDialog = page.getByRole("dialog");
  await authDialog.getByLabel("Email").fill(email);
  await authDialog.getByLabel("Password").fill(password);
  await authDialog.getByRole("button", { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function expectTransactionAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}

async function cleanUpAccount(email: string, password: string) {
  const loginPayload = await loginUserApi({ email, password });
  const userId = loginPayload.user?._id;

  if (typeof userId !== "string" || !/^[a-f\d]{24}$/i.test(userId)) return;

  const response = await closeAccountApi({
    userId,
    accessToken: loginPayload.accessToken,
  });
  expect(response.status).not.toBe(401);
  expect(response.status).toBeLessThan(500);
}
