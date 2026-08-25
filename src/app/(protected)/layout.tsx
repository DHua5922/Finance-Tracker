import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAuthenticatedUser } from "@/features/auth/lib/session";
import ProtectedShell from "./_components/ProtectedShell";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({ children }: Props) {
  const user = await getAuthenticatedUser();

  return (
    <ProtectedShell
      accountUser={
        user ? { username: user.username, email: user.email } : undefined
      }
    >
      {children}
    </ProtectedShell>
  );
}
