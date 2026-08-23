import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PrivateHeader.module.css";

interface Props {
  mobileNavigation: ReactNode;
  logoutButton: ReactNode;
}

export default function PrivateHeader({
  mobileNavigation,
  logoutButton,
}: Props) {
  return (
    <header className={styles.header}>
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        {mobileNavigation}

        <Link href="/dashboard" className={styles.brandLink}>
          <span className={styles.brandBadge}>F</span>
          <span className="text-lg font-semibold tracking-tight">
            FinanceFlow
          </span>
        </Link>

        {logoutButton}
      </div>
    </header>
  );
}
