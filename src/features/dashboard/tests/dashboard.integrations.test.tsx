import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import DashboardPage from "@/app/(protected)/dashboard/page";
import { db } from "@/shared/database/config";
import { mockAuthenticatedDashboardUser } from "./dashboard.integrations.mock";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "accessToken" ? { value: "valid-access-token" } : undefined,
  }),
}));

vi.mock("@/shared/database/config", () => ({
  db: { execute: vi.fn() },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    mockAuthenticatedDashboardUser();
  });

  test("loads the authenticated user's dashboard statistics", async () => {
    mockAuthenticatedDashboardUser();
    vi.mocked(db.execute).mockResolvedValue([
      {
        expenses_count: "4",
        total_expenses_amount: "750.25",
        income_count: "2",
        total_income_amount: "2000",
        net_savings: "1249.75",
      },
    ] as never);

    render(await DashboardPage());

    expect(
      screen.getByRole("heading", { name: "Welcome back, Jane" }),
    ).toBeInTheDocument();
    expect(db.execute).toHaveBeenCalledOnce();
    expect(screen.getByText("$2,000.00")).toBeInTheDocument();
    expect(screen.getByText("$750.25")).toBeInTheDocument();
    expect(screen.getByText("$1,249.75")).toBeInTheDocument();
    expect(screen.getByText("4 transactions")).toBeInTheDocument();
  });

  test("shows the dashboard error state when its database query fails", async () => {
    const errorMessage = "Your dashboard data is temporarily unavailable.";
    const databaseError = new Error(errorMessage);
    vi.mocked(db.execute).mockRejectedValue(databaseError);

    render(await DashboardPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your overview",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
  });
});
