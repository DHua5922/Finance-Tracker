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

const databaseRow = {
  id: "1",
  name: "Monthly salary",
  description: "Main job",
  amount: "5000.50",
  income_date: "2026-01-15T12:00:00Z",
};

describe("Delete Income", () => {
  beforeEach(() => {
    mockAuthenticatedIncomeUser();
  });

  test("should delete the selected income and refresh related data", async () => {
    const dialogName = "Delete income";
    const user = userEvent.setup();

    vi.mocked(db.execute)
      .mockResolvedValueOnce([databaseRow] as never)
      .mockResolvedValueOnce([databaseRow] as never);

    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("dialog", { name: dialogName });
    expect(dialog).toHaveTextContent(databaseRow.name);
    await user.click(
      within(dialog).getByRole("button", { name: "Delete income" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: dialogName }),
      ).not.toBeInTheDocument();
    });
    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith("/income");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  test("should show a database error and keep the confirmation open", async () => {
    const user = userEvent.setup();
    const errorMessage = "Unable to delete income.";

    vi.mocked(db.execute)
      .mockResolvedValueOnce([databaseRow] as never)
      .mockRejectedValueOnce(new Error(errorMessage));

    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("dialog", { name: "Delete income" });
    await user.click(
      within(dialog).getByRole("button", { name: "Delete income" }),
    );

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      errorMessage,
    );
    expect(dialog).toBeVisible();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test("should close without deleting when cancelled", async () => {
    const user = userEvent.setup();
    const dialogName = "Delete income";

    vi.mocked(db.execute).mockResolvedValueOnce([databaseRow] as never);
    render(await IncomePage({ searchParams: Promise.resolve({}) }));

    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("dialog", { name: dialogName });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("dialog", { name: dialogName }),
    ).not.toBeInTheDocument();
    expect(db.execute).toHaveBeenCalledOnce();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
