import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import Button from "./Button";

describe("Button", () => {
  it("renders children when not loading", async () => {
    const { container } = render(<Button>Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Submit");
    expect(button).toHaveAttribute("aria-busy", "false");
    await expectNoA11yViolations(container);
  });

  it("renders loading text and hides children when loading", () => {
    render(
      <Button isLoading loadingText="Creating account...">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Creating account..." });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Creating account...");
    expect(button).not.toHaveTextContent("Submit");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("uses default loading text when loadingText is not provided", () => {
    render(<Button isLoading>Submit</Button>);

    const button = screen.getByRole("button", { name: "Loading..." });

    expect(button).toHaveTextContent("Loading...");
    expect(button).toBeDisabled();
  });

  it("respects disabled prop even when not loading", () => {
    render(<Button disabled>Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "false");
  });
});
