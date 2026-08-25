"use client";

import type { TransactionFrequency } from "../database/dal";
import styles from "./TransactionFrequencyChooser.module.css";

interface Props {
  frequencies: TransactionFrequency[];
  selectedFrequencyId: number;
}

export default function FrequencySelect({
  frequencies,
  selectedFrequencyId,
}: Props) {
  return (
    <select
      className={styles.select}
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
    </select>
  );
}
