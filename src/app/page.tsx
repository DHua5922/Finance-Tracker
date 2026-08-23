import { redirect } from "next/navigation";
import { getUserSessionStatus } from "@/features/auth/lib/session";
import LandingPageShell from "@/features/landing/components/LandingPageShell";

interface Props {
  searchParams: Promise<{ login?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const sessionStatus = await getUserSessionStatus();
  if (sessionStatus === "authenticated") redirect("/dashboard");
  if (sessionStatus === "refresh-required") {
    redirect("/api/auth/refresh?returnTo=/dashboard");
  }

  const showLogin = (await searchParams).login === "1";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingPageShell showLogin={showLogin} />
    </div>
  );
}
