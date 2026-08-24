import type { TransactionFrequency } from "@/features/transaction-frequency/database/dal";
import type { getTransactionsDal } from "../../lib/database/get-trx-dal";
import UpsertTransactionButton from "../upsert-transaction-modal/UpsertTransactionButton";
import styles from "./IncomePageView.module.css";
import IncomeTable from "./IncomeTable";

export default function IncomePageView({
  query,
  incomeResult,
  frequencies = [],
}: {
  query: string;
  incomeResult: Awaited<ReturnType<typeof getTransactionsDal>>;
  frequencies?: TransactionFrequency[];
}) {
  const incomes = incomeResult.success ? incomeResult.data : [];

  return (
    <div className={styles.page}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={styles.eyebrow}>Money received</p>
          <h1 className={styles.heading}>Income</h1>
          <p className="mt-3 text-muted-foreground">
            Search and review your recorded income.
          </p>
        </div>

        <UpsertTransactionButton
          transactionType="income"
          frequencies={frequencies}
        />
      </header>

      <TableControls query={query} />

      {incomeResult.success ? (
        <IncomeTable
          incomes={incomes}
          hasSearchQuery={query.length > 0}
          frequencies={frequencies}
        />
      ) : (
        <section className={styles.errorPanel} role="alert">
          <h2>We could not load your income</h2>
          <p>{incomeResult.errorMessage}</p>
        </section>
      )}
    </div>
  );
}

function TableControls({ query }: { query: string }) {
  return (
    <search>
      <form className="flex items-stretch gap-3" action="/income">
        <label className="sr-only" htmlFor="income-search">
          Search income
        </label>

        <input
          className={styles.searchInput}
          id="income-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search income"
        />

        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    </search>
  );
}
