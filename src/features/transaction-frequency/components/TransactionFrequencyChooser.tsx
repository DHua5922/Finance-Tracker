import type { TransactionFrequenciesResult } from "../database/dal";
import styles from "./TransactionFrequencyChooser.module.css";

interface Props {
  action: string;
  selectedFrequencyId: number;
  frequenciesResult: TransactionFrequenciesResult;
}

export default function TransactionFrequencyChooser({
  action,
  selectedFrequencyId,
  frequenciesResult,
}: Props) {
  if (!frequenciesResult.success) {
    return (
      <p className="text-sm text-rose-600" role="alert">
        {frequenciesResult.errorMessage}
      </p>
    );
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      action={action}
      method="get"
    >
      <div className="grid min-w-52 gap-2">
        <label className="text-sm font-semibold" htmlFor="frequencyId">
          Transaction frequency
        </label>

        <select
          className={styles.select}
          id="frequencyId"
          name="frequencyId"
          defaultValue={selectedFrequencyId}
        >
          {frequenciesResult.data.map((frequency) => (
            <option key={frequency.id} value={frequency.id}>
              {frequency.name}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.button} type="submit">
        Apply
      </button>
    </form>
  );
}
