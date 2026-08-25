import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import SignUpForm from "./SignUpForm";

it("renders all signup fields and submit button", async () => {
  const { container } = render(<SignUpForm />);

  expect(screen.getByLabelText(/Username/i)).toHaveValue("");
  expect(screen.getByLabelText(/Email/i)).toHaveValue("");
  expect(screen.getByLabelText(/^Password/i)).toHaveValue("");
  expect(screen.getByLabelText(/Confirm password/i)).toHaveValue("");
  expect(
    screen.getByRole("button", { name: "Create account" }),
  ).toBeInTheDocument();
  await expectNoA11yViolations(container);
});

it("shows zod validation errors for required fields", async () => {
  const user = userEvent.setup();

  render(<SignUpForm />);

  await user.click(screen.getByRole("button", { name: "Create account" }));

  expect(await screen.findByText("Username is required")).toBeInTheDocument();
  expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});

it("shows validation error when passwords do not match", async () => {
  const user = userEvent.setup();

  render(<SignUpForm />);

  await user.type(screen.getByLabelText(/Username/i), "Jane");
  await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/^Password/i), "secure-password");
  await user.type(
    screen.getByLabelText(/Confirm password/i),
    "mismatch-password",
  );

  await user.click(screen.getByRole("button", { name: "Create account" }));

  expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
});
