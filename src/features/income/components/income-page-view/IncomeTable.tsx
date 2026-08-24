import type { Income } from "../../database/dal";
import UpsertIncomeButton from "../upsert-income-modal/UpsertIncomeButton";
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
}: {
  incomes: Income[];
  hasSearchQuery: boolean;
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
        <caption className="sr-only">Income records</caption>

        <thead>
          <tr>
            <th scope="col">Income name</th>
            <th scope="col">Income description</th>
            <th scope="col">Income amount</th>
            <th scope="col">Income date</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <TableRows incomes={incomes} />
      </table>
    </div>
  );
}

function TableRows({ incomes }: { incomes: Income[] }) {
  return (
    <tbody>
      {incomes.map((income) => (
        <tr key={income.id}>
          <th scope="row">{income.name}</th>
          <td>{income.description}</td>

          <td className="font-bold tabular-nums text-accent-foreground">
            {currencyFormatter.format(income.amount)}
          </td>

          <td>{dateFormatter.format(income.incomeDate)}</td>

          <td>
            <div className={styles.actions}>
              <UpsertIncomeButton income={income} />

              <button type="button" disabled>
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
