import { expect, type Page, test } from "@playwright/test";
import {
  closeAccountApi,
  loginUserApi,
  signUpUserApi,
} from "@/features/auth/lib/api/auth.api";

test.setTimeout(60_000);

test("user can create, edit, and delete a transaction", async ({
  page,
}, testInfo) => {
  page.setDefaultTimeout(10_000);

  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const projectName = testInfo.project.name
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
  const email = `transaction${runId}${projectName}@example.com`;
  const username = `transaction${runId}`;
  const password = "SecurePass123!";
  const originalName = `E2E salary ${runId}`;
  const updatedName = `E2E rent ${runId}`;

  await signUpUserApi({
    username,
    email,
    password,
    confirmPassword: password,
  });

  try {
    await logIn(page, email, password);
    await page.goto("/transaction");

    await createTransaction(page, originalName);
    await editTransaction(page, originalName, updatedName);
    await deleteTransaction(page, updatedName);
  } finally {
    await cleanUpTransaction(page, originalName, updatedName);
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

async function createTransaction(page: Page, transactionName: string) {
  await page.getByRole("button", { name: "Add transaction" }).click();
  const dialog = page.getByRole("dialog", { name: "Add transaction" });

  await dialog.getByLabel(/transaction type/i).selectOption("income");
  await dialog.getByLabel(/transaction name/i).fill(transactionName);
  await dialog.getByLabel("Description").fill("Created by Playwright");
  await dialog.getByLabel(/amount/i).fill("2500.50");
  await dialog.getByLabel(/transaction date/i).fill("2026-08-24");
  await dialog.getByLabel(/transaction frequency/i).selectOption({ index: 1 });
  await dialog.getByRole("button", { name: "Add transaction" }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("row").filter({ hasText: transactionName }),
  ).toBeVisible();
}

async function editTransaction(
  page: Page,
  originalName: string,
  updatedName: string,
) {
  const row = page.getByRole("row").filter({ hasText: originalName });
  await row.getByRole("button", { name: "Edit" }).click();

  const dialog = page.getByRole("dialog", { name: "Edit transaction" });
  await expect(dialog.getByLabel(/amount/i)).toHaveValue("2500.5");
  await dialog.getByLabel(/transaction type/i).selectOption("expense");
  await dialog.getByLabel(/transaction name/i).fill(updatedName);
  await dialog.getByLabel("Description").fill("Updated by Playwright");
  const amountInput = dialog.getByLabel(/amount/i);
  await amountInput.fill("1200.25");
  await amountInput.press("Enter");

  await expect(dialog).toBeHidden();
  const updatedRow = page.getByRole("row").filter({ hasText: updatedName });
  await expect(updatedRow).toContainText("Expense");
  await expect(updatedRow).toContainText("$1,200.25");
  await expect(page.getByText(originalName)).toBeHidden();
}

async function deleteTransaction(page: Page, transactionName: string) {
  const row = page.getByRole("row").filter({ hasText: transactionName });
  await row.getByRole("button", { name: "Delete" }).click();

  const dialog = page.getByRole("dialog", { name: "Delete transaction" });
  await expect(dialog).toContainText(transactionName);
  await dialog
    .getByRole("button", { name: "Delete transaction" })
    .press("Enter");

  await expect(dialog).toBeHidden();
  await expect(page.getByText(transactionName)).toBeHidden();
}

async function cleanUpTransaction(page: Page, ...transactionNames: string[]) {
  const closeFormButton = page.getByRole("button", {
    name: "Close transaction form",
  });
  if (await closeFormButton.isVisible().catch(() => false)) {
    await closeFormButton.click({ force: true });
  }

  for (const transactionName of transactionNames) {
    const row = page.getByRole("row").filter({ hasText: transactionName });
    if (!(await row.isVisible().catch(() => false))) continue;

    await row
      .getByRole("button", { name: "Delete" })
      .click({ force: true })
      .catch(() => {});
    const dialog = page.getByRole("dialog", { name: "Delete transaction" });
    if (!(await dialog.isVisible().catch(() => false))) continue;

    await dialog
      .getByRole("button", { name: "Delete transaction" })
      .click({ force: true })
      .catch(() => {});
    await expect(dialog)
      .toBeHidden()
      .catch(() => {});
  }
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
