import { expect, type Page } from "@playwright/test";

export async function signUp(
  page: Page,
  username: string,
  email: string,
  password: string,
) {
  await page.goto("/");
  await openAuthDialog(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Sign up" }).first().click();
  await dialog.getByLabel("Username*", { exact: true }).fill(username);
  await dialog.getByLabel("Email*", { exact: true }).fill(email);
  await dialog.getByLabel("Password*", { exact: true }).fill(password);
  await dialog.getByLabel("Confirm password*", { exact: true }).fill(password);
  await dialog.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL("/dashboard");
}

export async function logIn(page: Page, email: string, password: string) {
  await page.goto("/");
  await openAuthDialog(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Password").fill(password);
  await dialog.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/dashboard");
}

export async function closeAccount(page: Page) {
  await page.getByRole("button", { name: "Open account menu" }).click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
  await expect(page).toHaveURL("/profile");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Close account" }).click();
  const dialog = page.getByRole("dialog", { name: "Close your account?" });
  await expect(dialog).toContainText("cannot be undone");
  await dialog
    .getByRole("button", { name: "Permanently close account" })
    .click();
  await expect(page).toHaveURL("/");
}

async function openAuthDialog(page: Page) {
  await page
    .locator("#main-content")
    .getByRole("button", { name: "Get started" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
