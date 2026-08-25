import Link from "next/link";
import type { ReactNode } from "react";
import type { getDashboardStatsDal } from "../../database/dal";
import { DashboardContent } from "../dashboard-content/DashboardContent";
import styles from "./DashboardPageView.module.css";

export default function DashboardPageView({
  username,
  statsResult,
  selectedFrequencyName,
  frequencyChooser,
}: {
  username: string;
  statsResult: Awaited<ReturnType<typeof getDashboardStatsDal>>;
  selectedFrequencyName: string;
  frequencyChooser?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Financial overview</p>
          <h1 className={styles.heading}>Welcome back, {username}</h1>
          <p className={styles.description}>
            Here is a clear view of your income, spending, and savings.
          </p>
        </div>

        <nav className={styles.actions} aria-label="Quick actions">
          <Link href="/transaction" className={styles.primaryAction}>
            Add transaction
          </Link>

          <Link href="/transaction" className={styles.secondaryAction}>
            View transactions
          </Link>
        </nav>
      </header>

      {frequencyChooser}

      <output
        className="text-sm text-muted-foreground"
        aria-label={`Viewing ${selectedFrequencyName} transactions`}
      >
        Viewing{" "}
        <strong className="text-foreground">{selectedFrequencyName}</strong>{" "}
        transactions
      </output>

      {statsResult.success ? (
        <DashboardContent stats={statsResult.data} />
      ) : (
        <section className={styles.errorPanel} role="alert">
          <h2>We could not load your overview</h2>
          <p>{statsResult.errorMessage}</p>
        </section>
      )}
    </div>
  );
}
