"use client";

import { Modal } from "@dhua5922/react-kit";
import { useId } from "react";
import type { TransactionFrequency } from "@/features/transaction-frequency/database/dal";
import type { Transaction } from "../../lib/database/get-trx-dal";
import UpsertTransactionForm from "./UpsertTransactionForm";

interface Props {
  transaction?: Transaction;
  transactionType?: "income" | "expense";
  frequencies?: TransactionFrequency[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpsertTransactionModal({
  transaction,
  transactionType = "income",
  frequencies = [],
  open,
  onOpenChange,
}: Props) {
  const isEditing = Boolean(transaction);
  const titleId = useId();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby={titleId}
      className="w-[min(92vw,32rem)] rounded-2xl border border-foreground/15 bg-background p-0 text-foreground shadow-2xl"
    >
      <Modal.Header className="flex items-start justify-between border-b border-foreground/10 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
            {isEditing ? "Update record" : "New record"}
          </p>
          <Modal.Title id={titleId} className="mt-2 text-2xl font-semibold">
            {isEditing ? "Edit transaction" : "Add transaction"}
          </Modal.Title>
        </div>
        <Modal.CloseButton
          aria-label="Close transaction form"
          className="rounded-md border border-foreground/15 px-2 py-1 text-muted-foreground hover:bg-foreground/10"
        />
      </Modal.Header>

      <Modal.Body className="p-6">
        <UpsertTransactionForm
          transaction={transaction}
          transactionType={transactionType}
          frequencies={frequencies}
          onSuccess={() => onOpenChange(false)}
        />
      </Modal.Body>
    </Modal>
  );
}
