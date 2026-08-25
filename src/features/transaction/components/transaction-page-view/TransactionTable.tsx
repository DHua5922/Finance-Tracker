import type { TransactionFrequency } from "@/features/transaction-frequency/dal/trx-frequency.dal";
import type { Transaction } from "../../lib/dal/get-trx.dal";
import DeleteTransactionButton from "../delete-transaction-modal/DeleteTransactionButton";
import UpsertTransactionButton from "../upsert-transaction-modal/UpsertTransactionButton";
import styles from "./TransactionTable.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function TransactionTable({
  transactions,
  hasSearchQuery,
  frequencies = [],
}: {
  transactions: Transaction[];
  hasSearchQuery: boolean;
  frequencies?: TransactionFrequency[];
}) {
  if (transactions.length === 0) {
    return (
      <section className={styles.emptyState} aria-live="polite">
        <h2>
          {hasSearchQuery ? "No matching transactions" : "No transactions yet"}
        </h2>
        <p>
          {hasSearchQuery
            ? "Try another name or description."
            : "Your transaction records will appear here."}
        </p>
      </section>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <caption className="sr-only">Transaction records</caption>

        <thead>
          <tr>
            <th scope="col">Transaction type</th>
            <th scope="col">Transaction name</th>
            <th scope="col">Transaction description</th>
            <th scope="col">Transaction amount</th>
            <th scope="col">Transaction date</th>
            <th scope="col">Transaction frequency</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <TableRows transactions={transactions} frequencies={frequencies} />
      </table>
    </div>
  );
}

function TableRows({
  transactions,
  frequencies,
}: {
  transactions: Transaction[];
  frequencies: TransactionFrequency[];
}) {
  return (
    <tbody>
      {transactions.map((transaction) => (
        <tr key={transaction.id}>
          <td>
            {transaction.transactionType === "income" ? "Income" : "Expense"}
          </td>
          <th scope="row">{transaction.name}</th>
          <td>{transaction.description}</td>

          <td className="font-bold tabular-nums text-accent-foreground">
            {transaction.unitAmount === null
              ? "—"
              : currencyFormatter.format(transaction.unitAmount)}
          </td>

          <td>{formatTransactionDate(transaction.transactionDate)}</td>

          <td>{transaction.transactionFrequencyName}</td>

          <td>
            <div className={styles.actions}>
              <UpsertTransactionButton
                transaction={transaction}
                transactionType={transaction.transactionType}
                frequencies={frequencies}
              />

              <DeleteTransactionButton transaction={transaction} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function formatTransactionDate(date: Date) {
  const localDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  return dateFormatter.format(localDate);
}
