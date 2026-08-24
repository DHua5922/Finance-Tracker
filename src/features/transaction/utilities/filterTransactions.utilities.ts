import type { Transaction } from "../lib/database/get-trx.dal";

export function filterTransactions(transactions: Transaction[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return transactions;

  return transactions.filter((transaction) =>
    [
      transaction.name,
      transaction.description,
      transaction.transactionType,
      transaction.transactionFrequencyName,
    ].some((value) =>
      value.trim().toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}
