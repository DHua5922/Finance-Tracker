"use client";

import { Modal } from "@dhua5922/react-kit";
import { useId } from "react";
import type { Transaction } from "../../lib/database/get-trx-dal";
import DeleteIncomeForm from "./DeleteIncomeForm";

interface Props {
  income: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteIncomeModal({
  income,
  open,
  onOpenChange,
}: Props) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="w-[min(92vw,28rem)] rounded-2xl border border-foreground/15 bg-background p-0 text-foreground shadow-2xl"
    >
      <Modal.Header className="flex items-start justify-between border-b border-foreground/10 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600">
            Confirm deletion
          </p>
          <Modal.Title id={titleId} className="mt-2 text-2xl font-semibold">
            Delete income
          </Modal.Title>
        </div>

        <Modal.CloseButton
          aria-label="Close delete confirmation"
          className="rounded-md border border-foreground/15 px-2 py-1 text-muted-foreground hover:bg-foreground/10"
        />
      </Modal.Header>

      <Modal.Body className="p-6">
        <p id={descriptionId} className="text-muted-foreground">
          Are you sure you want to delete <strong>{income.name}</strong>? This
          cannot be undone.
        </p>

        <DeleteIncomeForm
          incomeId={income.id}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </Modal.Body>
    </Modal>
  );
}
