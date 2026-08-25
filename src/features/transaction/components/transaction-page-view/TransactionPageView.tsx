import type { TransactionFrequency } from "@/features/transaction-frequency/dal/trx-frequency.dal";
import type { getTransactionsDal } from "../../lib/dal/get-trx.dal";
import { filterTransactions } from "../../utilities/filterTransactions.utilities";
import UpsertTransactionButton from "../upsert-transaction-modal/UpsertTransactionButton";
import styles from "./TransactionPageView.module.css";
import TransactionTable from "./TransactionTable";

export default function TransactionPageView({
  query,
  transactionResult,
  frequencies = [],
  selectedTransactionType = null,
  selectedFrequencyId = null,
}: {
  query: string;
  transactionResult: Awaited<ReturnType<typeof getTransactionsDal>>;
  frequencies?: TransactionFrequency[];
  selectedTransactionType?: "income" | "expense" | null;
  selectedFrequencyId?: number | null;
}) {
  const transactions = transactionResult.success
    ? filterTransactions(transactionResult.data, query)
    : [];

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

      <TableControls
        query={query}
        frequencies={frequencies}
        selectedTransactionType={selectedTransactionType}
        selectedFrequencyId={selectedFrequencyId}
      />

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

function TableControls({
  query,
  frequencies,
  selectedTransactionType,
  selectedFrequencyId,
}: {
  query: string;
  frequencies: TransactionFrequency[];
  selectedTransactionType: "income" | "expense" | null;
  selectedFrequencyId: number | null;
}) {
  return (
    <search>
      <form className="flex flex-wrap items-end gap-3" action="/transaction">
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

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Transaction type
          <select
            className={styles.filterSelect}
            name="transactionType"
            defaultValue={selectedTransactionType ?? ""}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Transaction frequency
          <select
            className={styles.filterSelect}
            name="frequencyId"
            defaultValue={selectedFrequencyId ?? ""}
          >
            <option value="">All frequencies</option>
            {frequencies.map((frequency) => (
              <option key={frequency.id} value={frequency.id}>
                {frequency.name}
              </option>
            ))}
          </select>
        </label>

        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    </search>
  );
}
