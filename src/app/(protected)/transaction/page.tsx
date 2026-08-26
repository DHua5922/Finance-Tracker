import { redirect } from "next/navigation";
import TransactionPageView from "@/features/transaction/components/transaction-page-view/TransactionPageView";
import { getTransactionsDal } from "@/features/transaction/lib/dal/get-trx.dal";
import { getTransactionFrequenciesDal } from "@/features/transaction-frequency/dal/trx-frequency.dal";
import { getAuthenticatedUser } from "@/shared/session";

interface Props {
  searchParams: Promise<{
    q?: string;
    transactionType?: string;
    frequencyId?: string;
  }>;
}

export default async function TransactionPage({ searchParams }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/api/auth/refresh?returnTo=/transaction");

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";
  const transactionType = getTransactionType(
    resolvedSearchParams.transactionType,
  );
  const transactionFrequencyId = getTransactionFrequencyId(
    resolvedSearchParams.frequencyId,
  );

  const [transactionResult, frequenciesResult] = await Promise.all([
    getTransactionsDal({
      userId: user._id,
      name: "",
      description: "",
      transactionFrequencyId,
      transactionType,
    }),
    getTransactionFrequenciesDal(),
  ]);

  return (
    <TransactionPageView
      query={query}
      selectedTransactionType={transactionType}
      selectedFrequencyId={transactionFrequencyId}
      transactionResult={transactionResult}
      frequencies={frequenciesResult.success ? frequenciesResult.data : []}
    />
  );
}

function getTransactionType(value?: string) {
  return value === "income" || value === "expense" ? value : null;
}

function getTransactionFrequencyId(value?: string) {
  const frequencyId = Number(value);
  return Number.isInteger(frequencyId) && frequencyId > 0 ? frequencyId : null;
}
