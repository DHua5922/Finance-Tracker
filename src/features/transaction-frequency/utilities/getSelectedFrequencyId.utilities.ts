import type { TransactionFrequency } from "@/shared/types/transaction-frequency.types";

const defaultFrequencyId = 1;

export function getSelectedFrequencyId(
  frequencies: TransactionFrequency[],
  requestedId?: string,
) {
  const requestedFrequency = frequencies.find(
    ({ id }) => id === Number(requestedId),
  );

  return requestedFrequency?.id ?? frequencies[0]?.id ?? defaultFrequencyId;
}
