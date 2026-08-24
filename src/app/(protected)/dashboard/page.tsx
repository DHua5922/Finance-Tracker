import { requireAuthenticatedUser } from "@/features/auth/lib/session";
import DashboardPageView from "@/features/dashboard/components/dashboard-page-view/DashboardPageView";
import { getDashboardStatsDal } from "@/features/dashboard/database/dal";
import TransactionFrequencyChooser from "@/features/transaction-frequency/components/TransactionFrequencyChooser";
import { getTransactionFrequenciesDal } from "@/features/transaction-frequency/database/dal";
import { getSelectedFrequencyId } from "@/features/transaction-frequency/utilities/getSelectedFrequencyId";

interface Props {
  searchParams?: Promise<{ frequencyId?: string }>;
}

interface ResolvedSearchParams {
  frequencyId?: string;
}

export default async function DashboardPage({ searchParams }: Props = {}) {
  const user = await requireAuthenticatedUser("/dashboard");
  const defaultSearchParams = Promise.resolve<ResolvedSearchParams>({});
  const [frequenciesResult, resolvedSearchParams] = await Promise.all([
    getTransactionFrequenciesDal(),
    searchParams ?? defaultSearchParams,
  ]);

  const selectedFrequencyId = getSelectedFrequencyId(
    frequenciesResult.success ? frequenciesResult.data : [],
    resolvedSearchParams.frequencyId,
  );
  const statsResult = await getDashboardStatsDal(user._id, selectedFrequencyId);

  return (
    <DashboardPageView
      username={user.username}
      statsResult={statsResult}
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
