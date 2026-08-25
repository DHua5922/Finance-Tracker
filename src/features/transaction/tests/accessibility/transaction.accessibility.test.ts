import { expect, test } from "@playwright/test";
import { expectNoAccessibilityViolations } from "@/shared/test/accessibility/accessibility.utilities.e2e";
import { closeAccount, signUp } from "@/shared/test/e2e/auth.utilities.e2e";

test("transaction page and form have no WCAG A or AA violations", async ({
  page,
}, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const email = `accessibility${runId}@example.com`;
  const username = `accessibility${runId}`;
  const password = "SecurePass123!";

  try {
    await signUp(page, username, email, password);
    await page.goto("/transaction");

    await expect(
      page.getByRole("heading", { name: "Transactions", level: 1 }),
    ).toBeVisible();
    await expectNoAccessibilityViolations(page);

    await page.getByRole("button", { name: "Add transaction" }).click();
    const dialog = page.getByRole("dialog", { name: "Add transaction" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("opacity", "1");
    await expectNoAccessibilityViolations(page);
    await dialog
      .getByRole("button", { name: "Close transaction form" })
      .click();
  } finally {
    await closeAccount(page).catch(() => {});
  }
});
