"use client";

import { Modal } from "@dhua5922/react-kit";
import { useId } from "react";
import type { Income } from "../../database/dal";
import UpsertIncomeForm from "./UpsertIncomeForm";

interface Props {
  income?: Income;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpsertIncomeModal({
  income,
  open,
  onOpenChange,
}: Props) {
  const isEditing = Boolean(income);
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
            {isEditing ? "Edit income" : "Add income"}
          </Modal.Title>
        </div>
        <Modal.CloseButton
          aria-label="Close income form"
          className="rounded-md border border-foreground/15 px-2 py-1 text-muted-foreground hover:bg-foreground/10"
        />
      </Modal.Header>

      <Modal.Body className="p-6">
        <UpsertIncomeForm
          income={income}
          onSuccess={() => onOpenChange(false)}
        />
      </Modal.Body>
    </Modal>
  );
}
