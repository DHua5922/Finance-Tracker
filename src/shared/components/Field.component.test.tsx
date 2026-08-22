import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/setup";
import Field from "./Field";

describe("Field", () => {
  it("renders label and associates it to child input", async () => {
    const { container } = render(
      <Field htmlFor="email" label="Email" isError={false} errorMessage="">
        <input id="email" type="email" />
      </Field>,
    );

    const label = screen.getByText("Email");
    const input = screen.getByRole("textbox");

    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(input).toHaveAttribute("id", "email");
    await expectNoA11yViolations(container);
  });

  it("renders required indicator when required is true", () => {
    render(
      <Field
        htmlFor="username"
        label="Username"
        required
        isError={false}
        errorMessage=""
      >
        <input id="username" type="text" />
      </Field>,
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders error message only when isError is true", () => {
    const errorMessage = "Email is invalid";

    const { rerender } = render(
      <Field
        htmlFor="email"
        label="Email"
        isError={false}
        errorMessage={errorMessage}
      >
        <input id="email" type="email" />
      </Field>,
    );
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    rerender(
      <Field htmlFor="email" label="Email" isError errorMessage={errorMessage}>
        <input id="email" type="email" />
      </Field>,
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
