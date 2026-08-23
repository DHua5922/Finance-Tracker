import type { getIncomeDal } from "../../database/dal";
import { filterIncomes } from "../../utilities/filterIncomes";
import styles from "./IncomePageView.module.css";
import IncomeTable from "./IncomeTable";

export default function IncomePageView({
  query,
  incomeResult,
}: {
  query: string;
  incomeResult: Awaited<ReturnType<typeof getIncomeDal>>;
}) {
  const incomes = incomeResult.success
    ? filterIncomes(incomeResult.data, query)
    : [];

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Money received</p>
        <h1 className={styles.heading}>Income</h1>
        <p className="mt-3 text-muted-foreground">
          Search and review your recorded income.
        </p>
      </header>

      <TableControls query={query} />

      {incomeResult.success ? (
        <IncomeTable incomes={incomes} hasSearchQuery={query.length > 0} />
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
