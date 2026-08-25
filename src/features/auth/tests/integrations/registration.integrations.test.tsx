import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignUpForm from "../../components/SignUpForm";
import {
  mockRegistrationFailure,
  mockSuccessfulRegistration,
} from "./auth.integrations.mock";

let receivedRequestBody: unknown;

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: vi.fn() }),
}));

beforeEach(() => {
  receivedRequestBody = undefined;
});

describe("Registration", () => {
  it("should submit signup form successfully", async () => {
    const user = userEvent.setup();
    
    mockSuccessfulRegistration((body) => {
      receivedRequestBody = body;
    });
    render(<SignUpForm />);

    await fillRegistrationForm(user);
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

  it("should show the backend error and preserve the inputs", async () => {
    const user = userEvent.setup();

    mockRegistrationFailure(undefined, (body) => {
      receivedRequestBody = body;
    });
    render(<SignUpForm />);

    await fillRegistrationForm(user);
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

async function fillRegistrationForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Username/i), "Jane");
  await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/^Password/i), "secure-password");
  await user.type(
    screen.getByLabelText(/Confirm password/i),
    "secure-password",
  );
}
