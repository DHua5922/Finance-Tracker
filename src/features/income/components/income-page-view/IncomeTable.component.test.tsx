import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import type { Transaction } from "../../lib/database/get-trx-dal";
import IncomeTable from "./IncomeTable";

const incomes: Transaction[] = [
  {
    id: 1,
    name: "Monthly salary",
    description: "Main job",
    unitAmount: 5000.5,
    transactionType: "income",
    transactionDate: new Date(2026, 0, 15),
    transactionFrequencyId: 1,
    transactionFrequencyName: "Monthly",
    monthlyAmount: 5000.5,
  },
];

describe("IncomeTable", () => {
  test("should show formatted income data and row actions", async () => {
    const rowHeader = "Monthly salary";

    const { container } = render(
      <IncomeTable incomes={incomes} hasSearchQuery={false} />,
    );

    expect(
      screen.getByRole("table", { name: "Transaction records" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction type" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction name" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction description" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction amount" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction date" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Transaction frequency" }),
    ).toBeVisible();
    expect(screen.getByRole("rowheader", { name: rowHeader })).toBeVisible();
    expect(screen.getByText("Income")).toBeVisible();
    expect(screen.getByText("Main job")).toBeVisible();
    expect(screen.getByText("$5,000.50")).toBeVisible();
    expect(screen.getByText("Jan 15, 2026")).toBeVisible();
    expect(screen.getByText("Monthly")).toBeVisible();

    const dataRow = screen
      .getByRole("rowheader", {
        name: rowHeader,
      })
      .closest("tr");
    expect(dataRow).not.toBeNull();
    expect(
      within(dataRow as HTMLTableRowElement).getByRole("button", {
        name: "Edit",
      }),
    ).toBeEnabled();
    expect(
      within(dataRow as HTMLTableRowElement).getByRole("button", {
        name: "Delete",
      }),
    ).toBeEnabled();
    await expectNoA11yViolations(container);
  });

  test("should open a prefilled edit form", async () => {
    const user = userEvent.setup();
    render(<IncomeTable incomes={incomes} hasSearchQuery={false} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("dialog", { name: "Edit transaction" }),
    ).toBeVisible();
    expect(screen.getByLabelText(/^Transaction name/)).toHaveValue(
      incomes[0].name,
    );
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(incomes[0].unitAmount);
  });

  test("should open a delete confirmation for the selected income", async () => {
    const user = userEvent.setup();
    render(<IncomeTable incomes={incomes} hasSearchQuery={false} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("dialog", { name: "Delete income" });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(incomes[0].name);
    expect(
      within(dialog).getByRole("button", { name: "Delete income" }),
    ).toBeEnabled();
    expect(
      within(dialog).getByRole("button", { name: "Cancel" }),
    ).toBeEnabled();
  });

  test("should show the first-use empty state", () => {
    render(<IncomeTable incomes={[]} hasSearchQuery={false} />);

    expect(
      screen.getByRole("heading", { name: "No income yet" }),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  test("should show the search empty state", () => {
    render(<IncomeTable incomes={[]} hasSearchQuery />);

    expect(
      screen.getByRole("heading", { name: "No matching income" }),
    ).toBeVisible();
    expect(screen.getByText("Try another name or description.")).toBeVisible();
  });
});
