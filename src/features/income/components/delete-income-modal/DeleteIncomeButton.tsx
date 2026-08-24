"use client";

import { useState } from "react";
import type { Transaction } from "../../lib/database/get-trx-dal";
import DeleteIncomeModal from "./DeleteIncomeModal";

export default function DeleteIncomeButton({
  income,
}: {
  income: Transaction;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Delete
      </button>

      {isOpen && (
        <DeleteIncomeModal income={income} open onOpenChange={setIsOpen} />
      )}
    </>
  );
}
