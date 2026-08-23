import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import DashboardPageView from "@/features/dashboard/components/dashboard-page-view/DashboardPageView";
import { getDashboardStatsDal } from "@/features/dashboard/database/dal";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/api/auth/refresh?returnTo=/dashboard");

  const statsResult = await getDashboardStatsDal(user._id);

  return (
    <DashboardPageView username={user.username} statsResult={statsResult} />
  );
}
