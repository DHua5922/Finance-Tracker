import type { TransactionFrequency } from "@/features/transaction-frequency/database/dal";
import type { getTransactionsDal } from "../../lib/database/get-trx.dal";
import UpsertTransactionButton from "../upsert-transaction-modal/UpsertTransactionButton";
import styles from "./TransactionPageView.module.css";
import TransactionTable from "./TransactionTable";

export default function TransactionPageView({
  query,
  transactionResult,
  frequencies = [],
}: {
  query: string;
  transactionResult: Awaited<ReturnType<typeof getTransactionsDal>>;
  frequencies?: TransactionFrequency[];
}) {
  const transactions = transactionResult.success ? transactionResult.data : [];

  return (
    <div className={styles.page}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={styles.eyebrow}>Money in and out</p>
          <h1 className={styles.heading}>Transactions</h1>
          <p className="mt-3 text-muted-foreground">
            Search and review your recorded transactions.
          </p>
        </div>

        <UpsertTransactionButton
          transactionType="income"
          frequencies={frequencies}
        />
      </header>

      <TableControls query={query} />

      {transactionResult.success ? (
        <TransactionTable
          transactions={transactions}
          hasSearchQuery={query.length > 0}
          frequencies={frequencies}
        />
      ) : (
        <section className={styles.errorPanel} role="alert">
          <h2>We could not load your transactions</h2>
          <p>{transactionResult.errorMessage}</p>
        </section>
      )}
    </div>
  );
}

function TableControls({ query }: { query: string }) {
  return (
    <search>
      <form className="flex items-stretch gap-3" action="/transaction">
        <label className="sr-only" htmlFor="transaction-search">
          Search transactions
        </label>

        <input
          className={styles.searchInput}
          id="transaction-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search transactions"
        />

        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    </search>
  );
}
