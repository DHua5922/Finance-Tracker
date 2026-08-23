import Link from "next/link";
import type { getDashboardStatsDal } from "../../database/dal";
import { DashboardContent } from "../dashboard-content/DashboardContent";
import styles from "./DashboardPageView.module.css";

export default function DashboardPageView({
  username,
  statsResult,
}: {
  username: string;
  statsResult: Awaited<ReturnType<typeof getDashboardStatsDal>>;
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
          <Link href="/income" className={styles.primaryAction}>
            Add income
          </Link>

          <Link href="/expense" className={styles.secondaryAction}>
            Record expense
          </Link>
        </nav>
      </header>

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
