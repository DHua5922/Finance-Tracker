import { describe, expect, test } from "vitest";
import type { Transaction } from "../lib/database/get-trx-dal";
import { filterIncomes } from "./filterIncomes";

const incomes: Transaction[] = [
  {
    id: 1,
    name: "Monthly salary",
    description: "Main job",
    unitAmount: 5000,
    transactionType: "income",
    transactionDate: new Date("2026-01-15T12:00:00Z"),
    transactionFrequencyId: 1,
    transactionFrequencyName: "Monthly",
    monthlyAmount: 5000,
  },
  {
    id: 2,
    name: "Freelance project",
    description: "Website design",
    unitAmount: 750,
    transactionType: "income",
    transactionDate: new Date("2026-01-20T12:00:00Z"),
    transactionFrequencyId: 1,
    transactionFrequencyName: "Monthly",
    monthlyAmount: 750,
  },
];

describe("filterIncomes", () => {
  test("should return every income when input is empty", () => {
    expect(filterIncomes(incomes, "   ")).toBe(incomes);
  });

  test("should match income names without caring about case or outside spaces", () => {
    expect(filterIncomes(incomes, "  SALARY ")).toEqual([incomes[0]]);
  });

  test("should match income descriptions", () => {
    expect(filterIncomes(incomes, "website")).toEqual([incomes[1]]);
  });

  test("should return an empty list when no income matches", () => {
    expect(filterIncomes(incomes, "interest")).toEqual([]);
  });
});
