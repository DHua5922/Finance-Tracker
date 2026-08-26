import { redirect } from "next/navigation";
import PublicHeader from "@/app/_components/header/PublicHeader";
import GetStartedButton from "@/features/auth/components/GetStartedButton";
import LandingPageShell from "@/features/landing/components/LandingPageShell";
import { getUserSessionStatus } from "@/shared/session";

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
      <PublicHeader showLogin={showLogin} />
      <LandingPageShell primaryAction={<GetStartedButton />} />
    </div>
  );
}
