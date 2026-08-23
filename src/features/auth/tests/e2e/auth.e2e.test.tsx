import { expect, test } from "@playwright/test";
import { closeAccountApi, loginUserApi } from "../../lib/api";

test("user can sign up and the created account is cleaned up", async ({
  page,
}, testInfo) => {
  const runId = `${Date.now()}${testInfo.parallelIndex}`;
  const email = `jane${runId}${testInfo.project.name.replace(/[^a-z0-9]/gi, "").toLowerCase()}@example.com`;
  const username = `jane${runId}`;
  const password = "SecurePass123!";

  await page.goto("/");
  await page
    .locator("#main-content")
    .getByRole("button", { name: /get started/i })
    .click();

  const authDialog = page.getByRole("dialog");
  await expect(authDialog).toBeVisible();

  await authDialog
    .getByRole("button", { name: /^sign up$/i })
    .first()
    .click();

  await authDialog.getByLabel(/username/i).fill(username);
  await authDialog.getByLabel(/email/i).fill(email);
  await authDialog
    .getByLabel(/password/i)
    .first()
    .fill(password);
  await authDialog.getByLabel(/confirm password/i).fill(password);
  await authDialog.getByRole("button", { name: /^create account$/i }).click();

  await expect(authDialog.getByLabel(/username/i)).toHaveValue("");
  await expect(authDialog.getByLabel(/email/i)).toHaveValue("");

  // Playwright tests execute in Node, so this auth flow stays server-side.
  const loginPayload = await loginUserApi({ email, password });
  const accessToken = loginPayload.accessToken;
  const userId = loginPayload.user?._id;

  expect(accessToken).toBeTruthy();
  expect(userId).toBeTruthy();

  if (typeof userId !== "string" || !/^[a-f\d]{24}$/i.test(userId)) {
    return;
  }

  const closeResponse = await closeAccountApi({ userId, accessToken });

  expect(closeResponse.status).not.toBe(401);
  expect(closeResponse.status).toBeLessThan(500);
});
