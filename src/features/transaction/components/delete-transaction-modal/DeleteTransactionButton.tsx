"use client";

import { useState } from "react";
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
      <button type="button" onClick={() => setIsOpen(true)}>
        Delete
      </button>

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
