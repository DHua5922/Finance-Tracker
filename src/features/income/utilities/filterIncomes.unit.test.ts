import { describe, expect, test } from "vitest";
import type { Income } from "../database/dal";
import { filterIncomes } from "./filterIncomes";

const incomes: Income[] = [
  {
    id: 1,
    name: "Monthly salary",
    description: "Main job",
    amount: 5000,
    incomeDate: new Date("2026-01-15T12:00:00Z"),
  },
  {
    id: 2,
    name: "Freelance project",
    description: "Website design",
    amount: 750,
    incomeDate: new Date("2026-01-20T12:00:00Z"),
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
