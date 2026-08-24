"use client";

import { useActionState, useEffect, useId } from "react";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";
import { cn } from "@/shared/utilities/css";
import type { Income } from "../../database/dal";
import {
  type UpsertIncomeActionState,
  upsertIncomeAction,
} from "../../lib/actions/upsert-income";

interface Props {
  income?: Income;
  onSuccess: () => void;
}

const initialUpsertIncomeState: UpsertIncomeActionState = {
  isError: false,
  isSuccess: false,
  errorMessage: "",
  fieldErrors: {},
};

export default function UpsertIncomeForm({ income, onSuccess }: Props) {
  const nameId = useId();
  const descriptionId = useId();
  const amountId = useId();
  const incomeDateId = useId();
  const [state, formAction, isPending] = useActionState(
    upsertIncomeAction,
    initialUpsertIncomeState,
  );

  useEffect(() => {
    if (state.isSuccess) onSuccess();
  }, [state.isSuccess, onSuccess]);

  const inputClassName =
    "border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/30";

  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="id" value={income?.id ?? 0} />

      {state.isError && (
        <p className="text-sm text-rose-600" role="alert">
          {state.errorMessage}
        </p>
      )}

      <Field
        className="space-y-2"
        htmlFor={nameId}
        label="Income name"
        required
        isError={Boolean(state.fieldErrors.name)}
        errorMessage={state.fieldErrors.name?.[0]}
      >
        <Input
          className={cn(
            inputClassName,
            state.fieldErrors.name && "border-rose-500",
          )}
          id={nameId}
          name="name"
          defaultValue={income?.name}
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
            inputClassName,
            state.fieldErrors.description && "border-rose-500",
          )}
          id={descriptionId}
          name="description"
          defaultValue={income?.description}
          aria-invalid={Boolean(state.fieldErrors.description)}
        />
      </Field>

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
            inputClassName,
            state.fieldErrors.amount && "border-rose-500",
          )}
          id={amountId}
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          defaultValue={income?.amount}
          inputMode="decimal"
          required
          aria-invalid={Boolean(state.fieldErrors.amount)}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={incomeDateId}
        label="Income date"
        required
        isError={Boolean(state.fieldErrors.incomeDate)}
        errorMessage={state.fieldErrors.incomeDate?.[0]}
      >
        <Input
          className={cn(
            inputClassName,
            state.fieldErrors.incomeDate && "border-rose-500",
          )}
          id={incomeDateId}
          name="incomeDate"
          type="date"
          defaultValue={income ? formatDateInput(income.incomeDate) : undefined}
          required
          aria-invalid={Boolean(state.fieldErrors.incomeDate)}
        />
      </Field>

      <Button
        className="w-full rounded-full bg-emerald-400 py-2.5 text-slate-950 hover:bg-emerald-300"
        type="submit"
        isLoading={isPending}
        loadingText={income ? "Saving income..." : "Adding income..."}
      >
        {income ? "Save income" : "Add income"}
      </Button>
    </form>
  );
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
