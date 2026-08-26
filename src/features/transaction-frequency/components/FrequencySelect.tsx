"use client";

import { Select } from "@/shared/components";
import type { TransactionFrequency } from "@/shared/types";

interface Props {
  frequencies: TransactionFrequency[];
  selectedFrequencyId: number;
}

export default function FrequencySelect({
  frequencies,
  selectedFrequencyId,
}: Props) {
  return (
    <Select
      id="frequencyId"
      name="frequencyId"
      aria-describedby="frequency-help"
      defaultValue={selectedFrequencyId}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      {frequencies.map((frequency) => (
        <option key={frequency.id} value={frequency.id}>
          {frequency.name}
        </option>
      ))}
    </Select>
  );
}
