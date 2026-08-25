import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import DashboardCharts from "./DashboardCharts";

test("renders an accessible income and expenses chart", () => {
  render(<DashboardCharts totalIncome={1000} totalExpenses={400} />);

  expect(
    screen.getByRole("heading", { name: "Income versus expenses" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAccessibleName(
    "Bar chart showing $1,000 income and $400 expenses",
  );
});
