import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import UpsertIncomeModal from "./UpsertIncomeModal";

describe("UpsertIncomeModal", () => {
  test("should show the create form in an accessible dialog", async () => {
    const { container } = render(
      <UpsertIncomeModal open onOpenChange={() => {}} />,
    );

    expect(screen.getByRole("dialog", { name: "Add income" })).toBeVisible();
    expect(screen.getByText("New record")).toBeVisible();
    expect(screen.getByLabelText(/^Income name/)).toHaveValue("");
    await expectNoA11yViolations(container);
  });

  test("should show the edit form with the current income", () => {
    render(
      <UpsertIncomeModal
        open
        onOpenChange={() => {}}
        income={{
          id: 12,
          name: "Monthly salary",
          description: "Main job",
          amount: 5000,
          incomeDate: new Date(2026, 0, 15),
        }}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Edit income" })).toBeVisible();
    expect(screen.getByText("Update record")).toBeVisible();
    expect(screen.getByLabelText(/^Income name/)).toHaveValue("Monthly salary");
  });

  test("should report when the close button is used", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<UpsertIncomeModal open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Close income form" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
