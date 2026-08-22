import { expectNoA11yViolations } from "@/shared/test/component/setup";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  test("should render the form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
  });

  test("should not have any accessibility violations", async () => {
    const { container } = render(<LoginForm />);
    await expectNoA11yViolations(container);
  });
});
