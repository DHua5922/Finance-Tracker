import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import ProtectedShell from "./ProtectedShell";

describe("ProtectedShell", () => {
  it("renders accessible protected navigation", async () => {
    const { container } = render(<ProtectedShell>Page content</ProtectedShell>);

    for (const link of screen.getAllByRole("link", { name: "Transactions" })) {
      expect(link).toHaveAttribute("href", "/transaction");
    }

    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(screen.getAllByRole("button", { name: "Log out" })).toHaveLength(2);
    await expectNoA11yViolations(container);
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<ProtectedShell>Page content</ProtectedShell>);

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(openButton);

    expect(openButton).toHaveAttribute("aria-expanded", "true");
    const closeButtons = screen.getAllByRole("button", {
      name: "Close navigation menu",
    });
    expect(closeButtons.at(-1)).toHaveFocus();

    await user.click(closeButtons[1]);

    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(openButton).toHaveFocus();
  });

  it("closes the mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    render(<ProtectedShell>Page content</ProtectedShell>);

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(openButton);
    await user.keyboard("{Escape}");

    expect(openButton).toHaveAttribute("aria-expanded", "false");
  });
});
