import type { Metadata } from "next";
import type { ReactNode } from "react";
import ProtectedShell from "./_components/ProtectedShell";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProtectedLayout({ children }: Props) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
