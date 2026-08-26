import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component";
import UpsertTransactionForm from "./UpsertTransactionForm";

const frequencies = [
  {
    id: 1,
    name: "Monthly",
    description: "Once a month",
    toMonthlyMultiplier: 1,
  },
];

describe("UpsertTransactionForm", () => {
  test("should show empty fields for a new transaction", async () => {
    const { container } = render(
      <UpsertTransactionForm frequencies={frequencies} onSuccess={() => {}} />,
    );

    expect(screen.getByLabelText(/^Transaction type/)).toHaveValue("income");
    expect(screen.getByLabelText(/^Transaction name/)).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(null);
    expect(screen.getByLabelText(/^Transaction date/)).toHaveValue("");
    expect(screen.getByLabelText(/^Transaction frequency/)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "Add transaction" }),
    ).toBeEnabled();
    await expectNoA11yViolations(container);
  });

  test("should allow the user to choose an expense", async () => {
    const user = userEvent.setup();
    render(
      <UpsertTransactionForm frequencies={frequencies} onSuccess={() => {}} />,
    );

    const transactionType = screen.getByLabelText(/^Transaction type/);
    await user.selectOptions(transactionType, "expense");

    expect(transactionType).toHaveValue("expense");
  });

  test("should prefill fields when editing a transaction", () => {
    const transaction = {
      id: 12,
      transactionType: "income" as const,
      name: "Monthly salary",
      description: "Main job",
      unitAmount: 2500.25,
      transactionDate: new Date(2026, 0, 15),
      transactionFrequencyId: 1,
      transactionFrequencyName: "Monthly",
      monthlyAmount: 5000.5,
    };

    render(
      <UpsertTransactionForm
        transaction={transaction}
        frequencies={frequencies}
        onSuccess={() => {}}
      />,
    );

    expect(screen.getByLabelText(/^Transaction type/)).toHaveValue("income");
    expect(screen.getByLabelText(/^Transaction name/)).toHaveValue(
      transaction.name,
    );
    expect(screen.getByLabelText("Description")).toHaveValue(
      transaction.description,
    );
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(
      transaction.unitAmount,
    );
    expect(screen.getByLabelText(/^Transaction date/)).toHaveValue(
      "2026-01-15",
    );
    expect(screen.getByLabelText(/^Transaction frequency/)).toHaveValue("1");
    expect(
      screen.getByRole("button", { name: "Save transaction" }),
    ).toBeEnabled();
  });

  test("should prevent invalid form values from being submitted", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <UpsertTransactionForm frequencies={frequencies} onSuccess={onSuccess} />,
    );

    const nameInput = screen.getByLabelText(/^Transaction name/);
    const amountInput = screen.getByLabelText(/^Amount/);

    await user.type(amountInput, "-1");
    await user.type(screen.getByLabelText(/^Transaction date/), "2026-01-15");
    await user.selectOptions(
      screen.getByLabelText(/^Transaction frequency/),
      "1",
    );
    await user.click(screen.getByRole("button", { name: "Add transaction" }));

    expect(nameInput).toBeInvalid();
    expect(amountInput).toBeInvalid();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
