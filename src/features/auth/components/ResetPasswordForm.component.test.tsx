import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import ResetPasswordForm from "./ResetPasswordForm";

test("should show a field error when the passwords do not match", async () => {
  const user = userEvent.setup();

  render(<ResetPasswordForm token="password-reset-token" />);

  await user.type(screen.getByLabelText("New password*"), "new-password");
  await user.type(
    screen.getByLabelText("Confirm password*"),
    "different-password",
  );
  await user.click(screen.getByRole("button", { name: "Reset password" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Please correct the errors below.",
  );
  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  expect(screen.getByLabelText("Confirm password*")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
