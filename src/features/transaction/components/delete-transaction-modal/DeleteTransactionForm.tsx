"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/shared/components";
import {
  type DeleteTransactionActionState,
  deleteTransactionAction,
} from "../../lib/actions/delete-trx.action";

interface Props {
  transactionId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialState: DeleteTransactionActionState = {
  isError: false,
  isSuccess: false,
  errorMessage: "",
};

export default function DeleteTransactionForm({
  transactionId,
  onCancel,
  onSuccess,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    deleteTransactionAction,
    initialState,
  );

  useEffect(() => {
    if (state.isSuccess) onSuccess();
  }, [state.isSuccess, onSuccess]);

  return (
    <form className="mt-6" action={formAction}>
      <input type="hidden" name="id" value={transactionId} />

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
          loadingText="Deleting transaction..."
        >
          Delete transaction
        </Button>
      </div>
    </form>
  );
}
