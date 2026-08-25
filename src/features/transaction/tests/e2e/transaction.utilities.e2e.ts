import { expect, type Page } from "@playwright/test";

export async function createTransaction(page: Page, name: string) {
  await page.getByRole("button", { name: "Add transaction" }).click();
  const dialog = page.getByRole("dialog", { name: "Add transaction" });
  await dialog
    .getByLabel("Transaction type*", { exact: true })
    .selectOption("income");
  await dialog.getByLabel("Transaction name*", { exact: true }).fill(name);
  await dialog.getByLabel("Description").fill("Created by Playwright");
  await dialog.getByLabel("Amount*", { exact: true }).fill("2500.50");
  await dialog
    .getByLabel("Transaction date*", { exact: true })
    .fill("2026-08-24");
  await dialog
    .getByLabel("Transaction frequency*", { exact: true })
    .selectOption({ index: 1 });
  await dialog.getByRole("button", { name: "Add transaction" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("row").filter({ hasText: name })).toBeVisible();
}

export async function editTransaction(
  page: Page,
  oldName: string,
  newName: string,
) {
  const row = page.getByRole("row").filter({ hasText: oldName });
  await row.getByRole("button", { name: "Edit" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit transaction" });
  await expect(dialog.getByLabel("Amount*", { exact: true })).toHaveValue(
    "2500.5",
  );
  await dialog
    .getByLabel("Transaction type*", { exact: true })
    .selectOption("expense");
  await dialog.getByLabel("Transaction name*", { exact: true }).fill(newName);
  await dialog.getByLabel("Description").fill("Updated by Playwright");
  const amount = dialog.getByLabel("Amount*", { exact: true });
  await amount.fill("1200.25");
  await amount.press("Enter");
  await expect(dialog).toBeHidden();
  const updatedRow = page.getByRole("row").filter({ hasText: newName });
  await expect(updatedRow).toContainText("Expense");
  await expect(updatedRow).toContainText("$1,200.25");
  await expect(page.getByText(oldName)).toBeHidden();
}

export async function deleteTransaction(page: Page, name: string) {
  const row = page.getByRole("row").filter({ hasText: name });
  await row.getByRole("button", { name: "Delete" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete transaction" });
  await expect(dialog).toContainText(name);
  await dialog
    .getByRole("button", { name: "Delete transaction" })
    .press("Enter");
  await expect(dialog).toBeHidden();
  await expect(page.getByText(name)).toBeHidden();
}

export async function cleanUpTransactions(page: Page, names: string[]) {
  const closeButton = page.getByRole("button", {
    name: "Close transaction form",
  });
  if (await closeButton.isVisible().catch(() => false))
    await closeButton.click({ force: true });

  for (const name of names) {
    const row = page.getByRole("row").filter({ hasText: name });

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
