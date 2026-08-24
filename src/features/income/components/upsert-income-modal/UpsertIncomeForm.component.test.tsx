import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import UpsertIncomeForm from "./UpsertIncomeForm";

describe("UpsertIncomeForm", () => {
  test("should show empty fields for a new income", async () => {
    const { container } = render(<UpsertIncomeForm onSuccess={() => {}} />);

    expect(screen.getByLabelText(/^Income name/)).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(null);
    expect(screen.getByLabelText(/^Income date/)).toHaveValue("");
    expect(screen.getByRole("button", { name: "Add income" })).toBeEnabled();
    await expectNoA11yViolations(container);
  });

  test("should prefill fields when editing an income", () => {
    const income = {
      id: 12,
      name: "Monthly salary",
      description: "Main job",
      amount: 5000.5,
      incomeDate: new Date(2026, 0, 15),
    };

    render(<UpsertIncomeForm income={income} onSuccess={() => {}} />);

    expect(screen.getByLabelText(/^Income name/)).toHaveValue(income.name);
    expect(screen.getByLabelText("Description")).toHaveValue(
      income.description,
    );
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(income.amount);
    expect(screen.getByLabelText(/^Income date/)).toHaveValue("2026-01-15");
    expect(screen.getByRole("button", { name: "Save income" })).toBeEnabled();
  });

  test("should prevent invalid form values from being submitted", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<UpsertIncomeForm onSuccess={onSuccess} />);

    const nameInput = screen.getByLabelText(/^Income name/);
    const amountInput = screen.getByLabelText(/^Amount/);

    await user.type(amountInput, "-1");
    await user.type(screen.getByLabelText(/^Income date/), "2026-01-15");
    await user.click(screen.getByRole("button", { name: "Add income" }));

    expect(nameInput).toBeInvalid();
    expect(amountInput).toBeInvalid();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
