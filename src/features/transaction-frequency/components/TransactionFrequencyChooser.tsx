import type { TransactionFrequenciesResult } from "../dal/trx-frequency.dal";
import FrequencySelect from "./FrequencySelect";

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

        <FrequencySelect
          frequencies={frequenciesResult.data}
          selectedFrequencyId={selectedFrequencyId}
        />

        <p id="frequency-help" className="text-xs text-muted-foreground">
          Selecting a frequency reloads the dashboard.
        </p>
      </div>
    </form>
  );
}
