import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component";
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
  test("should show and close an accessible create dialog", async () => {
    const user = userEvent.setup();
    const { container } = render(<CreateModalSample />);

    expect(
      screen.getByRole("dialog", { name: "Add transaction" }),
    ).toBeVisible();
    expect(screen.getByText("New record")).toBeVisible();
    await expectNoA11yViolations(container);

    await user.click(
      screen.getByRole("button", { name: "Close transaction form" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
  });
});

function CreateModalSample() {
  const [open, setOpen] = useState(true);

  return open ? (
    <UpsertTransactionModal
      frequencies={frequencies}
      open
      onOpenChange={setOpen}
    />
  ) : null;
}
