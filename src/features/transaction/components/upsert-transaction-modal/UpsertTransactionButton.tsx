"use client";

import { useState } from "react";
import { Button } from "@/shared/components";
import type { TransactionFrequency } from "@/shared/types";
import type { Transaction } from "../../lib/dal/get-trx.dal";
import UpsertTransactionModal from "./UpsertTransactionModal";

interface Props {
  transaction?: Transaction;
  transactionType: "income" | "expense";
  frequencies: TransactionFrequency[];
}

export default function UpsertTransactionButton({
  transaction,
  transactionType,
  frequencies,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {transaction ? (
        <button type="button" onClick={() => setIsOpen(true)}>
          Edit
        </button>
      ) : (
        <Button
          type="button"
          className="rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300"
          onClick={() => setIsOpen(true)}
        >
          Add transaction
        </Button>
      )}

      {isOpen && (
        <UpsertTransactionModal
          transaction={transaction}
          transactionType={transactionType}
          frequencies={frequencies}
          open
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
