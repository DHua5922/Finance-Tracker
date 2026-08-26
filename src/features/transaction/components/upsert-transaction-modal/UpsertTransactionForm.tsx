"use client";

import { useActionState, useEffect, useId } from "react";
import { Button, Field, Input, Select } from "@/shared/components";
import type { TransactionFrequency } from "@/shared/types";
import { cn } from "@/shared/utilities";
import {
  type UpsertTransactionActionState,
  upsertTransactionAction,
} from "../../lib/actions/upsert-trx.action";
import type { Transaction } from "../../lib/dal/get-trx.dal";

interface Props {
  transaction?: Transaction;
  transactionType?: "income" | "expense";
  frequencies?: TransactionFrequency[];
  onSuccess: () => void;
}

const initialUpsertTransactionState: UpsertTransactionActionState = {
  isError: false,
  isSuccess: false,
  errorMessage: "",
  fieldErrors: {},
};

export default function UpsertTransactionForm({
  transaction,
  transactionType = "income",
  frequencies = [],
  onSuccess,
}: Props) {
  const transactionTypeId = useId();
  const nameId = useId();
  const descriptionId = useId();
  const amountId = useId();
  const transactionDateId = useId();
  const frequencyId = useId();
  const [state, formAction, isPending] = useActionState(
    upsertTransactionAction,
    initialUpsertTransactionState,
  );

  useEffect(() => {
    if (state.isSuccess) onSuccess();
  }, [state.isSuccess, onSuccess]);

  const controlClassName =
    "border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground";

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="id" value={transaction?.id ?? 0} />

      {state.isError && (
        <p className="text-sm text-rose-600" role="alert">
          {state.errorMessage}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          className="space-y-2"
          htmlFor={transactionTypeId}
          label="Transaction type"
          required
          isError={Boolean(state.fieldErrors.transactionType)}
          errorMessage={state.fieldErrors.transactionType?.[0]}
        >
          <Select
            className={cn(
              controlClassName,
              state.fieldErrors.transactionType && "border-rose-500",
            )}
            id={transactionTypeId}
            name="transactionType"
            defaultValue={transaction?.transactionType ?? transactionType}
            required
            aria-invalid={Boolean(state.fieldErrors.transactionType)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </Field>

        <Field
          className="space-y-2"
          htmlFor={frequencyId}
          label="Transaction frequency"
          required
          isError={Boolean(state.fieldErrors.transactionFrequencyId)}
          errorMessage={state.fieldErrors.transactionFrequencyId?.[0]}
        >
          <Select
            className={cn(
              controlClassName,
              state.fieldErrors.transactionFrequencyId && "border-rose-500",
            )}
            id={frequencyId}
            name="transactionFrequencyId"
            defaultValue={transaction?.transactionFrequencyId ?? ""}
            required
            aria-invalid={Boolean(state.fieldErrors.transactionFrequencyId)}
          >
            <option value="" disabled>
              Select a frequency
            </option>
            {frequencies.map((frequency) => (
              <option key={frequency.id} value={frequency.id}>
                {frequency.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          className="space-y-2"
          htmlFor={nameId}
          label="Transaction name"
          required
          isError={Boolean(state.fieldErrors.name)}
          errorMessage={state.fieldErrors.name?.[0]}
        >
          <Input
            className={cn(
              controlClassName,
              state.fieldErrors.name && "border-rose-500",
            )}
            id={nameId}
            name="name"
            defaultValue={transaction?.name}
            autoComplete="off"
            required
            aria-invalid={Boolean(state.fieldErrors.name)}
          />
        </Field>

        <Field
          className="space-y-2"
          htmlFor={descriptionId}
          label="Description"
          isError={Boolean(state.fieldErrors.description)}
          errorMessage={state.fieldErrors.description?.[0]}
        >
          <Input
            className={cn(
              controlClassName,
              state.fieldErrors.description && "border-rose-500",
            )}
            id={descriptionId}
            name="description"
            defaultValue={transaction?.description}
            aria-invalid={Boolean(state.fieldErrors.description)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          className="space-y-2"
          htmlFor={amountId}
          label="Amount"
          required
          isError={Boolean(state.fieldErrors.amount)}
          errorMessage={state.fieldErrors.amount?.[0]}
        >
          <Input
            className={cn(
              controlClassName,
              state.fieldErrors.amount && "border-rose-500",
            )}
            id={amountId}
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={transaction?.unitAmount ?? undefined}
            inputMode="decimal"
            required
            aria-invalid={Boolean(state.fieldErrors.amount)}
          />
        </Field>

        <Field
          className="space-y-2"
          htmlFor={transactionDateId}
          label="Transaction date"
          required
          isError={Boolean(state.fieldErrors.transactionDate)}
          errorMessage={state.fieldErrors.transactionDate?.[0]}
        >
          <Input
            className={cn(
              controlClassName,
              state.fieldErrors.transactionDate && "border-rose-500",
            )}
            id={transactionDateId}
            name="transactionDate"
            type="date"
            defaultValue={
              transaction
                ? formatDateInput(transaction.transactionDate)
                : undefined
            }
            required
            aria-invalid={Boolean(state.fieldErrors.transactionDate)}
          />
        </Field>
      </div>

      <Button
        className="w-full rounded-full bg-emerald-400 py-2.5 text-slate-950 hover:bg-emerald-300"
        type="submit"
        isLoading={isPending}
        loadingText={
          transaction ? "Saving transaction..." : "Adding transaction..."
        }
      >
        {transaction ? "Save transaction" : "Add transaction"}
      </Button>
    </form>
  );
}

function formatDateInput(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
