"use client";

import { useState } from "react";
import { Button } from "@/shared/components";
import type { Transaction } from "../../lib/dal/get-trx.dal";
import DeleteTransactionModal from "./DeleteTransactionModal";

export default function DeleteTransactionButton({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/10"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </Button>

      {isOpen && (
        <DeleteTransactionModal
          transaction={transaction}
          open
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
