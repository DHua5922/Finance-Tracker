import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component";
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
      screen.getByRole("progressbar", { name: "Savings rate" }),
    ).toHaveAttribute("aria-valuenow", "60");
    expect(
      screen.getByRole("link", { name: "Add transaction" }),
    ).toHaveAttribute("href", "/transaction");
    await expectNoA11yViolations(container);
  });
});
