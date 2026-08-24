import type { Transaction } from "../lib/database/get-trx-dal";

export function filterIncomes(incomes: Transaction[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return incomes;

  return incomes.filter(
    ({ name, description }) =>
      name.trim().toLocaleLowerCase().includes(normalizedQuery) ||
      description.trim().toLocaleLowerCase().includes(normalizedQuery),
  );
}
