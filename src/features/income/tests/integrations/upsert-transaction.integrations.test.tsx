import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { revalidatePath } from "next/cache";
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

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
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

describe("Upsert Transaction", () => {
  beforeEach(() => {
    mockAuthenticatedIncomeUser();
  });

  test("should create income and refresh income data", async () => {
    const user = userEvent.setup();
    const insertedIncome = {
      id: "3",
      transaction_type: "income",
      name: "Bank interest",
      description: "Savings account",
      amount: "25.50",
      transaction_date: "2026-02-01T12:00:00Z",
      trx_freq_id: "1",
      created_at: "2026-02-01T12:00:00Z",
      updated_at: "2026-02-01T12:00:00Z",
    };

    vi.mocked(db.execute)
      .mockResolvedValueOnce(databaseRows as never)
      .mockResolvedValueOnce(frequencyRows as never)
      .mockResolvedValueOnce([insertedIncome] as never);

    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    await user.click(screen.getByRole("button", { name: "Add transaction" }));
    const dialog = screen.getByRole("dialog", { name: "Add transaction" });
    await user.type(
      within(dialog).getByLabelText(/^Transaction name/),
      "Bank interest",
    );
    await user.type(
      within(dialog).getByLabelText("Description"),
      "Savings account",
    );
    await user.type(within(dialog).getByLabelText(/^Amount/), "25.50");
    await user.type(
      within(dialog).getByLabelText(/^Transaction date/),
      "2026-02-01",
    );
    await user.selectOptions(
      within(dialog).getByLabelText(/^Transaction frequency/),
      "1",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Add transaction" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add transaction" }),
      ).not.toBeInTheDocument();
    });
    expect(db.execute).toHaveBeenCalledTimes(3);
    expect(revalidatePath).toHaveBeenCalledWith("/income");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  test("should show the database error and keep the modal open", async () => {
    const errorMessage = "Unable to save income.";
    const user = userEvent.setup();

    vi.mocked(db.execute)
      .mockResolvedValueOnce(databaseRows as never)
      .mockResolvedValueOnce(frequencyRows as never)
      .mockRejectedValueOnce(new Error(errorMessage));

    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    await user.click(screen.getByRole("button", { name: "Add transaction" }));
    const dialog = screen.getByRole("dialog", { name: "Add transaction" });
    await user.type(
      within(dialog).getByLabelText(/^Transaction name/),
      "Bank interest",
    );
    await user.type(within(dialog).getByLabelText(/^Amount/), "25.50");
    await user.type(
      within(dialog).getByLabelText(/^Transaction date/),
      "2026-02-01",
    );
    await user.selectOptions(
      within(dialog).getByLabelText(/^Transaction frequency/),
      "1",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Add transaction" }),
    );

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      errorMessage,
    );
    expect(dialog).toBeVisible();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
