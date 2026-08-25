import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "../../components/LoginForm";
import { mockErrorLogin, mockSuccessfulLogin } from "./auth.integrations.mock";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: vi.fn() }),
}));

describe("Login", () => {
  it("should log in successfully", async () => {
    mockSuccessfulLogin();
    await renderLoginForm();

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should show the error and preserve the inputs", async () => {
    mockErrorLogin();
    await renderLoginForm();

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toHaveValue("email@example.com");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("test123");
  });

  it("should log in with the guest account", async () => {
    const user = userEvent.setup();
    let requestBody: unknown;

    mockSuccessfulLogin((body) => {
      requestBody = body;
    });
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Continue as guest" }));

    await waitFor(() => {
      expect(requestBody).toEqual({
        email: "guest@example.com",
        password: "guest-password",
      });
    });
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});

async function renderLoginForm() {
  const user = userEvent.setup();

  render(<LoginForm />);

  await user.type(screen.getByLabelText(/Email/i), "email@example.com");
  await user.type(screen.getByLabelText(/Password/i), "test123");
  await user.click(screen.getByRole("button", { name: "Log in" }));
}
