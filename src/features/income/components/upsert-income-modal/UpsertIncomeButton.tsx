"use client";

import { useState } from "react";
import Button from "@/shared/components/Button";
import type { Income } from "../../database/dal";
import UpsertIncomeModal from "./UpsertIncomeModal";

export default function UpsertIncomeButton({ income }: { income?: Income }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {income ? (
        <button type="button" onClick={() => setIsOpen(true)}>
          Edit
        </button>
      ) : (
        <Button
          type="button"
          className="rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300"
          onClick={() => setIsOpen(true)}
        >
          Add income
        </Button>
      )}

      {isOpen && (
        <UpsertIncomeModal income={income} open onOpenChange={setIsOpen} />
      )}
    </>
  );
}
