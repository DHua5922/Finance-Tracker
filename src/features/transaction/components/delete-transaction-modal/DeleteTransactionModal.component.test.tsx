import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test } from "vitest";
import DeleteTransactionModal from "./DeleteTransactionModal";

test("should close when deletion is cancelled", async () => {
  const user = userEvent.setup();
  render(<DeleteModalSample />);

  await user.click(screen.getByRole("button", { name: "Cancel" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

function DeleteModalSample() {
  const [open, setOpen] = useState(true);

  return open ? (
    <DeleteTransactionModal
      open
      onOpenChange={setOpen}
      transaction={{
        id: 1,
        transactionType: "income",
        name: "Monthly salary",
        description: "Main job",
        unitAmount: 5000,
        transactionDate: new Date(2026, 0, 15),
        transactionFrequencyId: 1,
        transactionFrequencyName: "Monthly",
        monthlyAmount: 5000,
      }}
    />
  ) : null;
}
