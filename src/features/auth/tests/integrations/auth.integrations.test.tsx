import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignUpForm from "../../components/SignUpForm";
import {
  mockErrorLogin,
  mockRegistrationFailure,
  mockSuccessfulLogin,
  mockSuccessfulRegistration,
} from "./auth.integrations.mock";
import LoginForm from "../../components/LoginForm";
import { redirect } from "next/navigation";

let receivedRequestBody: unknown;

beforeEach(() => {
  receivedRequestBody = undefined;
});

vi.mock("next/navigation", () => {
  return {
    redirect: vi.fn(),
    // Include these if your components or actions use them
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
    }),
    usePathname: () => "/",
  };
});

describe("Registration", () => {
  it("submits signup form", async () => {
    const user = userEvent.setup();
    mockSuccessfulRegistration((body) => {
      receivedRequestBody = body;
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/Username/i), "Jane");
    await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^Password/i), "secure-password");
    await user.type(
      screen.getByLabelText(/Confirm password/i),
      "secure-password",
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(receivedRequestBody).toEqual({
        username: "Jane",
        email: "jane@example.com",
        password: "secure-password",
        confirmPassword: "secure-password",
      });
    });

    expect(screen.getByLabelText(/Username/i)).toHaveValue("");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("");
    expect(screen.getByLabelText(/^Password/i)).toHaveValue("");
    expect(screen.getByLabelText(/Confirm password/i)).toHaveValue("");
  });

  it("shows backend error message when register request fails", async () => {
    const user = userEvent.setup();
    mockRegistrationFailure(undefined, (body) => {
      receivedRequestBody = body;
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/Username/i), "Jane");
    await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^Password/i), "secure-password");
    await user.type(
      screen.getByLabelText(/Confirm password/i),
      "secure-password",
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });
});

describe("Login", () => {
  it("should submit login form", async () => {
    mockSuccessfulLogin();
    await renderLoginForm();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should show error message on login failure", async () => {
    mockErrorLogin();
    await renderLoginForm();

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  async function renderLoginForm() {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/Email/i), "email@example.com");
    await user.type(screen.getByLabelText(/Password/i), "test123");
    await user.click(screen.getByRole("button", { name: "Log in" }));
  }
});
