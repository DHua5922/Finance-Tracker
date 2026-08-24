"use client";

import { useState } from "react";
import type { Income } from "../../database/dal";
import DeleteIncomeModal from "./DeleteIncomeModal";

export default function DeleteIncomeButton({ income }: { income: Income }) {
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
