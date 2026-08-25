import { expect, test } from "@playwright/test";
import { expectNoAccessibilityViolations } from "@/shared/test/accessibility/accessibility.utilities.e2e";
import { closeAccount, signUp } from "@/shared/test/e2e/auth.utilities.e2e";

test("dashboard should have no WCAG A or AA violations", async ({
  page,
}, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const username = `dashboard-a11y-${runId}`;
  const email = `dashboard-a11y-${runId}@example.com`;
  const password = "SecurePass123!";

  try {
    await signUp(page, username, email, password);
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: `Welcome back, ${username}` }),
    ).toBeVisible();

    await expectNoAccessibilityViolations(page);
  } finally {
    await closeAccount(page).catch(() => {});
  }
});
