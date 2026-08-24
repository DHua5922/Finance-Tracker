import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import IncomePageView from "./IncomePageView";

const incomeResult = {
  success: true as const,
  data: [
    {
      id: 1,
      name: "Monthly salary",
      description: "Main job",
      unitAmount: 5000,
      transactionType: "income" as const,
      transactionDate: new Date(2026, 0, 15),
      transactionFrequencyId: 1,
      transactionFrequencyName: "Monthly",
      monthlyAmount: 5000,
    },
    {
      id: 2,
      name: "Freelance project",
      description: "Website design",
      unitAmount: 750,
      transactionType: "income" as const,
      transactionDate: new Date(2026, 0, 20),
      transactionFrequencyId: 1,
      transactionFrequencyName: "Monthly",
      monthlyAmount: 750,
    },
  ],
};

describe("IncomePageView", () => {
  test("shows the search form and transactions returned by the DAL", async () => {
    const filteredIncomeResult = {
      ...incomeResult,
      data: [incomeResult.data[0]],
    };
    const { container } = render(
      <IncomePageView query="salary" incomeResult={filteredIncomeResult} />,
    );

    expect(screen.getByRole("heading", { name: "Income" })).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: "Search income" }),
    ).toHaveValue("salary");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.queryByText("Freelance project")).not.toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("shows every income when the search query is empty", () => {
    render(<IncomePageView query="" incomeResult={incomeResult} />);

    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.getByText("Freelance project")).toBeVisible();
  });

  test("shows the data error instead of an income table", () => {
    render(
      <IncomePageView
        query=""
        incomeResult={{
          success: false,
          data: null,
          errorMessage: "Income is unavailable.",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your income",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Income is unavailable.",
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
