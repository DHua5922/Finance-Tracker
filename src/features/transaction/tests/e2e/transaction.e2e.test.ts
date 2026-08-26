import { type Page, test } from "@playwright/test";
import { closeAccount, logIn, signUp } from "@/shared/test/e2e";
import {
  cleanUpTransactions,
  createTransaction,
  deleteTransaction,
  editTransaction,
} from "./transaction.utilities.e2e";

test.setTimeout(60_000);

test("signed-up user should be able to manage transactions and close their account", async ({
  page,
}, testInfo) => {
  page.setDefaultTimeout(10_000);

  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const projectName = testInfo.project.name.toLowerCase();
  const email = `transaction${runId}${projectName}@example.com`;
  const username = `transaction${runId}`;
  const password = "SecurePass123!";
  const originalName = `E2E salary ${runId}`;
  const updatedName = `E2E rent ${runId}`;
  let accountClosed = false;

  try {
    await signUp(page, username, email, password);
    await page.goto("/transaction");

    await createTransaction(page, originalName);
    await editTransaction(page, originalName, updatedName);
    await deleteTransaction(page, updatedName);
    await closeAccount(page);
    accountClosed = true;
  } finally {
    if (!accountClosed) {
      await cleanUpTestUser(page, email, password, originalName, updatedName);
    }
  }
});

async function cleanUpTestUser(
  page: Page,
  email: string,
  password: string,
  ...names: string[]
) {
  try {
    await page.goto("/transaction");

    if (new URL(page.url()).pathname !== "/transaction") {
      await logIn(page, email, password);
      await page.goto("/transaction");
    }

    await cleanUpTransactions(page, names);
    await closeAccount(page);
  } catch {}
}
