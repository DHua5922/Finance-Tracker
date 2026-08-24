import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import DashboardPageView from "@/features/dashboard/components/dashboard-page-view/DashboardPageView";
import { getDashboardStatsDal } from "@/features/dashboard/database/dal";
import TransactionFrequencyChooser from "@/features/transaction-frequency/components/transaction-frequency-chooser/TransactionFrequencyChooser";
import { getTransactionFrequenciesDal } from "@/features/transaction-frequency/database/dal";
import { getSelectedFrequencyId } from "@/features/transaction-frequency/utilities/getSelectedFrequencyId";

interface Props {
  searchParams?: Promise<{ frequencyId?: string }>;
}

interface ResolvedSearchParams {
  frequencyId?: string;
}

export default async function DashboardPage({ searchParams }: Props = {}) {
  const defaultSearchParams = Promise.resolve<ResolvedSearchParams>({});
  const [user, frequenciesResult, resolvedSearchParams] = await Promise.all([
    getAuthenticatedUser(),
    getTransactionFrequenciesDal(),
    searchParams ?? defaultSearchParams,
  ]);
  if (!user) redirect("/api/auth/refresh?returnTo=/dashboard");

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
