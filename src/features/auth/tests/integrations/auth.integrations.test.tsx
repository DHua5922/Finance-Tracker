import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import SignUpForm from "../../components/SignUpForm";
import {
  mockRegistrationFailure,
  mockSuccessfulRegistration,
} from "./auth.integrations.mock";

let receivedRequestBody: unknown;

beforeEach(() => {
  receivedRequestBody = undefined;
});

describe("auth integration", () => {
  it("submits signup form and sends expected payload", async () => {
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
