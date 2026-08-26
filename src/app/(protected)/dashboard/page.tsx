import { DashboardPageView, getDashboardStatsDal } from "@/features/dashboard";
import {
  getSelectedFrequencyId,
  getTransactionFrequenciesDal,
  TransactionFrequencyChooser,
} from "@/features/transaction-frequency";
import { requireAuthenticatedUser } from "@/shared/session";

interface Props {
  searchParams?: Promise<{ frequencyId?: string }>;
}

interface ResolvedSearchParams {
  frequencyId?: string;
}

export default async function DashboardPage({ searchParams }: Props) {
  const user = await requireAuthenticatedUser("/dashboard");
  const defaultSearchParams = Promise.resolve<ResolvedSearchParams>({});
  const [frequenciesResult, resolvedSearchParams] = await Promise.all([
    getTransactionFrequenciesDal(),
    searchParams ?? defaultSearchParams,
  ]);

  const frequencies = frequenciesResult.success ? frequenciesResult.data : [];
  const selectedFrequencyId = getSelectedFrequencyId(
    frequencies,
    resolvedSearchParams.frequencyId,
  );
  const selectedFrequencyName =
    frequencies.find(({ id }) => id === selectedFrequencyId)?.name ??
    "Unknown frequency";
  const statsResult = await getDashboardStatsDal(user._id, selectedFrequencyId);

  return (
    <DashboardPageView
      username={user.username}
      statsResult={statsResult}
      selectedFrequencyName={selectedFrequencyName}
      frequencyChooser={
        <TransactionFrequencyChooser
          action="/dashboard"
          selectedFrequencyId={selectedFrequencyId}
          frequenciesResult={frequenciesResult}
        />
      }
    />
  );
}
