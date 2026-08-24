import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import TransactionPage from "@/app/(protected)/transaction/page";
import { db } from "@/shared/database/config";
import { mockAuthenticatedTransactionUser } from "./transaction.integrations.mock";

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
    transaction_type: "income",
    name: "Monthly salary",
    description: "Main job",
    amount: "5000.50",
    unit_amount: "5000.50",
    transaction_date: "2026-01-15T12:00:00Z",
    trx_freq_id: "1",
    transaction_frequency_name: "Monthly",
    to_monthly_multiplier: "1",
    monthly_amount: "5000.50",
  },
  {
    id: "2",
    transaction_type: "income",
    name: "Freelance project",
    description: "Website design",
    amount: "750",
    unit_amount: "750",
    transaction_date: "2026-01-20T12:00:00Z",
    trx_freq_id: "1",
    transaction_frequency_name: "Monthly",
    to_monthly_multiplier: "1",
    monthly_amount: "750",
  },
];

const frequencyRows = [
  {
    id: "1",
    name: "Monthly",
    description: "Once a month",
    to_monthly_multiplier: "1",
  },
];

describe("Get Transactions", () => {
  beforeEach(() => {
    mockAuthenticatedTransactionUser();
  });

  test("should load and parse the authenticated user's transactions", async () => {
    vi.mocked(db.execute)
      .mockResolvedValueOnce(databaseRows as never)
      .mockResolvedValueOnce(frequencyRows as never);
    render(await TransactionPage({ searchParams: Promise.resolve({}) }));

    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Monthly salary")).toBeVisible();
    expect(screen.getByText("$5,000.50")).toBeVisible();
    expect(screen.getByText("Freelance project")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
  });

  test("should filter the database results using the URL search query", async () => {
    const searchQuery = "website";

    vi.mocked(db.execute)
      .mockResolvedValueOnce([databaseRows[1]] as never)
      .mockResolvedValueOnce(frequencyRows as never);
    render(
      await TransactionPage({
        searchParams: Promise.resolve({ q: searchQuery }),
      }),
    );

    expect(screen.getByText("Freelance project")).toBeVisible();
    expect(screen.queryByText("Monthly salary")).not.toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search transactions" }),
    ).toHaveValue(searchQuery);
  });

  test("should show an error when the transaction database query fails", async () => {
    const errorMessage = "Income database unavailable.";
    const databaseError = new Error(errorMessage);

    vi.mocked(db.execute)
      .mockRejectedValueOnce(databaseError)
      .mockResolvedValueOnce(frequencyRows as never);
    render(await TransactionPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your transactions",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
  });
});
