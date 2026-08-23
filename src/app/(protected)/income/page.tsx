import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import IncomePageView from "@/features/income/components/income-page-view/IncomePageView";
import { getIncomeDal } from "@/features/income/database/dal";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function IncomePage({ searchParams }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/api/auth/refresh?returnTo=/income");

  const query = (await searchParams).q?.trim() ?? "";
  const incomeResult = await getIncomeDal(user._id);

  return <IncomePageView query={query} incomeResult={incomeResult} />;
}
