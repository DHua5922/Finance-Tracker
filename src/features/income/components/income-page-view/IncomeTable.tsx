import type { TransactionFrequency } from "@/features/transaction-frequency/database/dal";
import type { Transaction } from "../../lib/database/get-trx-dal";
import DeleteIncomeButton from "../delete-income-modal/DeleteIncomeButton";
import UpsertTransactionButton from "../upsert-transaction-modal/UpsertTransactionButton";
import styles from "./IncomeTable.module.css";

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

export default function IncomeTable({
  incomes,
  hasSearchQuery,
  frequencies = [],
}: {
  incomes: Transaction[];
  hasSearchQuery: boolean;
  frequencies?: TransactionFrequency[];
}) {
  if (incomes.length === 0) {
    return (
      <section className={styles.emptyState} aria-live="polite">
        <h2>{hasSearchQuery ? "No matching income" : "No income yet"}</h2>
        <p>
          {hasSearchQuery
            ? "Try another name or description."
            : "Your income records will appear here."}
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

        <TableRows incomes={incomes} frequencies={frequencies} />
      </table>
    </div>
  );
}

function TableRows({
  incomes,
  frequencies,
}: {
  incomes: Transaction[];
  frequencies: TransactionFrequency[];
}) {
  return (
    <tbody>
      {incomes.map((income) => (
        <tr key={income.id}>
          <td>{income.transactionType === "income" ? "Income" : "Expense"}</td>
          <th scope="row">{income.name}</th>
          <td>{income.description}</td>

          <td className="font-bold tabular-nums text-accent-foreground">
            {income.unitAmount === null
              ? "—"
              : currencyFormatter.format(income.unitAmount)}
          </td>

          <td>{dateFormatter.format(income.transactionDate)}</td>

          <td>{income.transactionFrequencyName}</td>

          <td>
            <div className={styles.actions}>
              <UpsertTransactionButton
                transaction={income}
                transactionType="income"
                frequencies={frequencies}
              />

              <DeleteIncomeButton income={income} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
