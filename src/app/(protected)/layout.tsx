import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import ProtectedShell from "./_components/ProtectedShell";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({ children }: Props) {
  const cookieStore = await cookies();
  if (!cookieStore.has("accessToken")) redirect("/");

  return <ProtectedShell>{children}</ProtectedShell>;
}
