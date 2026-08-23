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
      amount: 5000,
      incomeDate: new Date(2026, 0, 15),
    },
    {
      id: 2,
      name: "Freelance project",
      description: "Website design",
      amount: 750,
      incomeDate: new Date(2026, 0, 20),
    },
  ],
};

describe("IncomePageView", () => {
  test("shows the search form and matching income", async () => {
    const { container } = render(
      <IncomePageView query="salary" incomeResult={incomeResult} />,
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
