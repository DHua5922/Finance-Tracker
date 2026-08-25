import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup";
import TransactionFrequencyChooser from "./TransactionFrequencyChooser";

describe("TransactionFrequencyChooser", () => {
  test("shows the available frequencies and current choice", async () => {
    const frequencyList = [
      {
        id: 1,
        name: "Weekly",
        description: "One week",
        toMonthlyMultiplier: 4.33,
      },
      {
        id: 2,
        name: "Monthly",
        description: "One month",
        toMonthlyMultiplier: 1,
      },
    ];

    const { container } = render(
      <TransactionFrequencyChooser
        action="/dashboard"
        selectedFrequencyId={2}
        frequenciesResult={{
          success: true,
          data: frequencyList,
        }}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: "Transaction frequency",
    });

    expect(select).toHaveValue("2");
    expect(select.closest("form")).toHaveAttribute("action", "/dashboard");
    expect(select.closest("form")).toHaveAttribute("method", "get");
    expect(
      screen.getByRole("option", { name: frequencyList[0].name }),
    ).toBeVisible();
    expect(
      screen.getByRole("option", { name: frequencyList[1].name }),
    ).toBeVisible();
    expect(
      screen.getByText("Selecting a frequency reloads the dashboard."),
    ).toBeInTheDocument();

    await expectNoA11yViolations(container);
  });

  test("shows an error when frequencies cannot be loaded", () => {
    const errorMessage = "Frequencies are unavailable.";
    render(
      <TransactionFrequencyChooser
        action="/dashboard"
        selectedFrequencyId={1}
        frequenciesResult={{
          success: false,
          data: null,
          errorMessage,
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
