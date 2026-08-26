import { Button, Field, Input, Select } from "@/shared/components";
import type { TransactionFrequency } from "@/shared/types";
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
        <Field
          className="min-w-0 flex-1 space-y-1 [&_label]:sr-only"
          htmlFor="transaction-search"
          label="Search transactions"
        >
          <Input
            id="transaction-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search transactions"
          />
        </Field>

        <Field
          className="space-y-1 text-sm font-semibold"
          htmlFor="transaction-type-filter"
          label="Transaction type"
        >
          <Select
            className="min-w-40"
            id="transaction-type-filter"
            name="transactionType"
            defaultValue={selectedTransactionType ?? ""}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </Field>

        <Field
          className="space-y-1 text-sm font-semibold"
          htmlFor="transaction-frequency-filter"
          label="Transaction frequency"
        >
          <Select
            className="min-w-40"
            id="transaction-frequency-filter"
            name="frequencyId"
            defaultValue={selectedFrequencyId ?? ""}
          >
            <option value="">All frequencies</option>
            {frequencies.map((frequency) => (
              <option key={frequency.id} value={frequency.id}>
                {frequency.name}
              </option>
            ))}
          </Select>
        </Field>

        <Button
          className="bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300"
          type="submit"
        >
          Search
        </Button>
      </form>
    </search>
  );
}
