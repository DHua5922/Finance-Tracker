import type { Income } from "../database/dal";

export function filterIncomes(incomes: Income[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return incomes;

  return incomes.filter(
    ({ name, description }) =>
      name.trim().toLocaleLowerCase().includes(normalizedQuery) ||
      description.trim().toLocaleLowerCase().includes(normalizedQuery),
  );
}
