import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import TransactionPageView from "./TransactionPageView";

const transactionResult = {
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

describe("TransactionPageView", () => {
  test("shows the search form and transactions returned by the DAL", async () => {
    const { container } = render(
      <TransactionPageView
        query="salary"
        transactionResult={transactionResult}
      />,
    );

    expect(screen.getByRole("heading", { name: "Transactions" })).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: "Search transactions" }),
    ).toHaveValue("salary");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.queryByText("Freelance project")).not.toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("shows every transaction when the search query is empty", () => {
    render(
      <TransactionPageView query="" transactionResult={transactionResult} />,
    );

    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.getByText("Freelance project")).toBeVisible();
  });

  test("shows the data error instead of a transaction table", () => {
    render(
      <TransactionPageView
        query=""
        transactionResult={{
          success: false,
          data: null,
          errorMessage: "Income is unavailable.",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your transactions",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Income is unavailable.",
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
