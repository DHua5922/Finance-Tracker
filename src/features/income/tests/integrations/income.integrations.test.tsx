import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import IncomePage from "@/app/(protected)/income/page";
import { db } from "@/shared/database/config";
import { mockAuthenticatedIncomeUser } from "./income.integrations.mock";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "accessToken" ? { value: "valid-access-token" } : undefined,
  }),
}));

vi.mock("@/shared/database/config", () => ({
  db: { execute: vi.fn() },
}));

const databaseRows = [
  {
    id: "1",
    name: "Monthly salary",
    description: "Main job",
    amount: "5000.50",
    income_date: "2026-01-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Freelance project",
    description: "Website design",
    amount: "750",
    income_date: "2026-01-20T12:00:00Z",
  },
];

describe("Income", () => {
  beforeEach(() => {
    mockAuthenticatedIncomeUser();
  });

  test("should load and parse the authenticated user's income", async () => {
    vi.mocked(db.execute).mockResolvedValue(databaseRows as never);
    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    expect(db.execute).toHaveBeenCalledOnce();
    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.getByText("$5,000.50")).toBeVisible();
    expect(screen.getByText("Freelance project")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
  });

  test("should filter the database results using the URL search query", async () => {
    const searchQuery = "website";

    vi.mocked(db.execute).mockResolvedValue(databaseRows as never);
    render(
      await IncomePage({
        searchParams: Promise.resolve({ q: searchQuery }),
      }),
    );

    expect(screen.getByText("Freelance project")).toBeVisible();
    expect(screen.queryByText("Monthly salary")).not.toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search income" }),
    ).toHaveValue(searchQuery);
  });

  test("should show an error when the income database query fails", async () => {
    const errorMessage = "Income database unavailable.";
    const databaseError = new Error(errorMessage);

    vi.mocked(db.execute).mockRejectedValue(databaseError);
    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your income",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
  });
});
