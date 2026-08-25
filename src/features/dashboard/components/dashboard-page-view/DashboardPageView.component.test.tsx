import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import DashboardPageView from "./DashboardPageView";

describe("DashboardPageView", () => {
  test("renders the authenticated user's financial overview", async () => {
    const username = "Jane";
    const { container } = render(
      <DashboardPageView
        username={username}
        selectedFrequencyName="Monthly"
        statsResult={{
          success: true,
          data: {
            expenses_count: 3,
            total_expenses_amount: 400,
            income_count: 1,
            total_income_amount: 1000,
            net_savings: 600,
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: `Welcome back, ${username}` }),
    ).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("$400.00")).toBeInTheDocument();
    expect(screen.getByText("$600.00")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Income versus expenses" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Bar chart showing $1,000 income and $400 expenses",
    );
    expect(
      screen.getByRole("progressbar", { name: "Savings rate" }),
    ).toHaveAttribute("aria-valuenow", "60");
    expect(
      screen.getByRole("link", { name: "Add transaction" }),
    ).toHaveAttribute("href", "/transaction");
    await expectNoA11yViolations(container);
  });

  test("renders a useful error when dashboard data cannot be loaded", () => {
    const errorMessage = "Dashboard data is temporarily unavailable.";
    render(
      <DashboardPageView
        username="Jane"
        selectedFrequencyName="Monthly"
        statsResult={{
          success: false,
          data: null,
          errorMessage,
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your overview",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
  });
});
