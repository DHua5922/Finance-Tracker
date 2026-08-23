import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getUserSessionStatus } from "@/features/auth/lib/session";
import ProtectedShell from "./_components/ProtectedShell";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({ children }: Props) {
  const sessionStatus = await getUserSessionStatus();
  if (sessionStatus !== "authenticated")
    redirect("/api/auth/refresh?returnTo=/dashboard");

  return <ProtectedShell>{children}</ProtectedShell>;
}
