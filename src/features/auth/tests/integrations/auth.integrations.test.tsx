import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LogoutButton from "@/app/_components/LogoutButton";
import LoginForm from "../../components/LoginForm";
import SignUpForm from "../../components/SignUpForm";
import {
  mockErrorLogin,
  mockRegistrationFailure,
  mockSuccessfulLogin,
  mockSuccessfulRegistration,
} from "./auth.integrations.mock";

let receivedRequestBody: unknown;
const { deleteCookie } = vi.hoisted(() => ({ deleteCookie: vi.fn() }));

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

vi.mock("next/headers", () => ({
  cookies: async () => ({
    delete: deleteCookie,
    set: vi.fn(),
  }),
}));

describe("Registration", () => {
  it("should submit signup form successfully", async () => {
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
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should show backend error message when registration fails", async () => {
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
    expect(screen.getByLabelText(/Username/i)).toHaveValue("Jane");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("jane@example.com");
    expect(screen.getByLabelText(/^Password/i)).toHaveValue("secure-password");
    expect(screen.getByLabelText(/Confirm password/i)).toHaveValue(
      "secure-password",
    );
  });
});

describe("Login", () => {
  it("should log in successfully", async () => {
    mockSuccessfulLogin();
    await renderLoginForm();

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should show error message on login failure", async () => {
    mockErrorLogin();
    await renderLoginForm();

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toHaveValue("email@example.com");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("test123");
  });

  async function renderLoginForm() {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/Email/i), "email@example.com");
    await user.type(screen.getByLabelText(/Password/i), "test123");
    await user.click(screen.getByRole("button", { name: "Log in" }));
  }
});

describe("Logout", () => {
  it("should clear the session and redirect home", async () => {
    const user = userEvent.setup();
    render(<LogoutButton placement="desktop-header" />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/");
    });
    expect(deleteCookie).toHaveBeenCalledWith("accessToken");
    expect(deleteCookie).toHaveBeenCalledWith("refreshToken");
  });
});
