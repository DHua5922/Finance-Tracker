import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import TransactionPageView from "@/features/transaction/components/transaction-page-view/TransactionPageView";
import { getTransactionsDal } from "@/features/transaction/lib/database/get-trx.dal";
import { getTransactionFrequenciesDal } from "@/features/transaction-frequency/database/dal";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function TransactionPage({ searchParams }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/api/auth/refresh?returnTo=/transaction");

  const query = (await searchParams).q?.trim() ?? "";
  const [transactionResult, frequenciesResult] = await Promise.all([
    getTransactionsDal({
      userId: user._id,
      name: "",
      description: "",
      transactionFrequencyId: null,
      transactionType: null,
    }),
    getTransactionFrequenciesDal(),
  ]);

  return (
    <TransactionPageView
      query={query}
      transactionResult={transactionResult}
      frequencies={frequenciesResult.success ? frequenciesResult.data : []}
    />
  );
}
