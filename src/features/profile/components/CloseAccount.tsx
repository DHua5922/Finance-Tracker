"use client";

import { Modal } from "@dhua5922/react-kit";
import { useActionState, useId, useState } from "react";
import { Button } from "@/shared/components";
import { closeAccountAction } from "../lib/actions/close-account.action";

const initialState = { errorMessage: "" };

export default function CloseAccount() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    closeAccountAction,
    initialState,
  );
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      <Button
        type="button"
        className="bg-red-700 text-white hover:bg-red-800"
        onClick={() => setOpen(true)}
      >
        Close account
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-[min(92vw,28rem)] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl"
      >
        <Modal.Header className="flex items-start justify-between border-b border-border p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
              Confirm account closure
            </p>
            <Modal.Title id={titleId} className="mt-2 text-2xl font-semibold">
              Close your account?
            </Modal.Title>
          </div>

          <Modal.CloseButton
            aria-label="Close account confirmation"
            className="rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          />
        </Modal.Header>

        <Modal.Body className="p-6">
          <p id={descriptionId} className="text-muted-foreground">
            This permanently deletes your account and cannot be undone.
          </p>

          {state.errorMessage && (
            <p
              role="alert"
              className="mt-4 text-sm text-red-600 dark:text-red-400"
            >
              {state.errorMessage}
            </p>
          )}

          <form action={formAction} className="mt-6 flex justify-end gap-3">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              loadingText="Closing account..."
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Permanently close account
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
