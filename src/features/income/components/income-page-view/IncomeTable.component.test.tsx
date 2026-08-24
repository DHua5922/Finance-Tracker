import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import type { Income } from "../../database/dal";
import IncomeTable from "./IncomeTable";

const incomes: Income[] = [
  {
    id: 1,
    name: "Monthly salary",
    description: "Main job",
    amount: 5000.5,
    incomeDate: new Date(2026, 0, 15),
  },
];

describe("IncomeTable", () => {
  test("shows formatted income data and row actions", async () => {
    const rowHeader = "Monthly salary";

    const { container } = render(
      <IncomeTable incomes={incomes} hasSearchQuery={false} />,
    );

    expect(screen.getByRole("table", { name: "Income records" })).toBeVisible();
    expect(screen.getByRole("rowheader", { name: rowHeader })).toBeVisible();
    expect(screen.getByText("Main job")).toBeVisible();
    expect(screen.getByText("$5,000.50")).toBeVisible();
    expect(screen.getByText("Jan 15, 2026")).toBeVisible();

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
    ).toBeDisabled();
    await expectNoA11yViolations(container);
  });

  test("opens a prefilled edit form", async () => {
    const user = userEvent.setup();
    render(<IncomeTable incomes={incomes} hasSearchQuery={false} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByRole("dialog", { name: "Edit income" })).toBeVisible();
    expect(screen.getByLabelText(/^Income name/)).toHaveValue("Monthly salary");
    expect(screen.getByLabelText(/^Amount/)).toHaveValue(5000.5);
  });

  test("shows the first-use empty state", () => {
    render(<IncomeTable incomes={[]} hasSearchQuery={false} />);

    expect(
      screen.getByRole("heading", { name: "No income yet" }),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  test("shows the search empty state", () => {
    render(<IncomeTable incomes={[]} hasSearchQuery />);

    expect(
      screen.getByRole("heading", { name: "No matching income" }),
    ).toBeVisible();
    expect(screen.getByText("Try another name or description.")).toBeVisible();
  });
});
