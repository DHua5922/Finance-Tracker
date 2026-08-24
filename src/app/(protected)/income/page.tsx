import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import IncomePageView from "@/features/income/components/income-page-view/IncomePageView";
import { getTransactionsDal } from "@/features/income/lib/database/get-trx-dal";
import { getTransactionFrequenciesDal } from "@/features/transaction-frequency/database/dal";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function IncomePage({ searchParams }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/api/auth/refresh?returnTo=/income");

  const query = (await searchParams).q?.trim() ?? "";
  const [incomeResult, frequenciesResult] = await Promise.all([
    getTransactionsDal({
      userId: user._id,
      name: query,
      description: query,
      transactionFrequencyId: null,
      transactionType: "income",
    }),
    getTransactionFrequenciesDal(),
  ]);

  return (
    <IncomePageView
      query={query}
      incomeResult={incomeResult}
      frequencies={frequenciesResult.success ? frequenciesResult.data : []}
    />
  );
}
