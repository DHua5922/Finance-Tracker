import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  test("should render an accessible empty form", async () => {
    const { container } = render(<LoginForm />);

    expect(screen.getByLabelText(/Email/i)).toHaveValue("");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("");
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
