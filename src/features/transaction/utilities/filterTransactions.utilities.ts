import type { Transaction } from "../lib/database/get-trx.dal";

export function filterTransactions(transactions: Transaction[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return transactions;

  return transactions.filter(
    ({ name, description }) =>
      name.trim().toLocaleLowerCase().includes(normalizedQuery) ||
      description.trim().toLocaleLowerCase().includes(normalizedQuery),
  );
}
