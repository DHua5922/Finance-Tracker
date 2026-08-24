"use client";

import { useActionState, useEffect } from "react";
import Button from "@/shared/components/Button";
import {
  type DeleteIncomeActionState,
  deleteIncomeAction,
} from "../../lib/actions/delete-trx";

interface Props {
  incomeId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialState: DeleteIncomeActionState = {
  isError: false,
  isSuccess: false,
  errorMessage: "",
};

export default function DeleteIncomeForm({
  incomeId,
  onCancel,
  onSuccess,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    deleteIncomeAction,
    initialState,
  );

  useEffect(() => {
    if (state.isSuccess) onSuccess();
  }, [state.isSuccess, onSuccess]);

  return (
    <form className="mt-6" action={formAction}>
      <input type="hidden" name="id" value={incomeId} />

      {state.isError && (
        <p className="mb-4 text-sm text-rose-600" role="alert">
          {state.errorMessage}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          className="border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/10"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-rose-600 text-white hover:bg-rose-500"
          isLoading={isPending}
          loadingText="Deleting income..."
        >
          Delete income
        </Button>
      </div>
    </form>
  );
}
