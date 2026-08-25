import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import RequestPasswordResetForm from "../../components/RequestPasswordResetForm";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import {
  mockPasswordResetFailure,
  mockPasswordResetRequestFailure,
  mockSuccessfulPasswordReset,
  mockSuccessfulPasswordResetRequest,
} from "./auth.integrations.mock";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("Password reset request", () => {
  it("should request a token and send the reset email", async () => {
    const user = userEvent.setup();
    let tokenRequestBody: unknown;
    let emailRequestBody: unknown;

    mockSuccessfulPasswordResetRequest(
      (body) => {
        tokenRequestBody = body;
      },
      (body) => {
        emailRequestBody = body;
      },
    );
    render(<RequestPasswordResetForm />);

    await user.type(screen.getByLabelText("Email*"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    const status = await screen.findByText(
      "Check your email for a password reset link.",
    );
    expect(status).toHaveAttribute("role", "status");
    expect(tokenRequestBody).toEqual({ email: "jane@example.com" });
    expect(emailRequestBody).toMatchObject({
      to: "jane@example.com",
      subject: "Reset your FinanceFlow password",
      html: expect.stringContaining(
        "http://localhost:3000/reset-password?token=password-reset-token",
      ),
    });
  });

  it("should show the API error and preserve the email", async () => {
    const user = userEvent.setup();

    mockPasswordResetRequestFailure();
    render(<RequestPasswordResetForm />);

    await user.type(screen.getByLabelText("Email*"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "User not found",
    );
    expect(screen.getByLabelText("Email*")).toHaveValue("jane@example.com");
  });
});

describe("Password reset", () => {
  it("should submit the new password with the reset token", async () => {
    const user = userEvent.setup();
    let requestBody: unknown;
    let authorization: string | null = null;

    mockSuccessfulPasswordReset((body, header) => {
      requestBody = body;
      authorization = header;
    });
    render(<ResetPasswordForm token="password-reset-token" />);

    await fillPasswordForm(user);
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/?login=1");
    });
    expect(authorization).toBe("Bearer password-reset-token");
    expect(requestBody).toEqual({
      password: "new-password",
      confirmPassword: "new-password",
    });
  });

  it("should show an expired-link error from the API", async () => {
    const user = userEvent.setup();

    mockPasswordResetFailure();
    render(<ResetPasswordForm token="expired-token" />);

    await fillPasswordForm(user);
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Reset link expired",
    );
  });
});

async function fillPasswordForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("New password*"), "new-password");
  await user.type(screen.getByLabelText("Confirm password*"), "new-password");
}
