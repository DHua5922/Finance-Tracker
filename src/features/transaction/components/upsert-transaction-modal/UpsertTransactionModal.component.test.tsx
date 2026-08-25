import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import UpsertTransactionModal from "./UpsertTransactionModal";

const frequencies = [
  {
    id: 1,
    name: "Monthly",
    description: "Once a month",
    toMonthlyMultiplier: 1,
  },
];

describe("UpsertTransactionModal", () => {
  test("should show the create form in an accessible dialog", async () => {
    const { container } = render(
      <UpsertTransactionModal
        frequencies={frequencies}
        open
        onOpenChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Add transaction" }),
    ).toBeVisible();
    expect(screen.getByText("New record")).toBeVisible();
    expect(screen.getByLabelText(/^Transaction name/)).toHaveValue("");
    await expectNoA11yViolations(container);
  });

  test("should show the edit form with the current income", () => {
    render(
      <UpsertTransactionModal
        open
        onOpenChange={() => {}}
        frequencies={frequencies}
        transaction={{
          id: 12,
          transactionType: "income",
          name: "Monthly salary",
          description: "Main job",
          unitAmount: 5000,
          transactionDate: new Date(2026, 0, 15),
          transactionFrequencyId: 1,
          transactionFrequencyName: "Monthly",
          monthlyAmount: 5000,
        }}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Edit transaction" }),
    ).toBeVisible();
    expect(screen.getByText("Update record")).toBeVisible();
    expect(screen.getByLabelText(/^Transaction name/)).toHaveValue(
      "Monthly salary",
    );
  });

  test("should report when the close button is used", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<UpsertTransactionModal open onOpenChange={onOpenChange} />);

    await user.click(
      screen.getByRole("button", { name: "Close transaction form" }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
