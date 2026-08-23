import type { DashboardStats } from "../../database/dal";
import InsightBar from "../insight-bar/InsightBar";
import StatCard from "../stat-card/StatCard";
import styles from "./DashboardContent.module.css";

export function DashboardContent({ stats }: { stats: DashboardStats }) {
  const savingsRate = getPercentage(
    stats.net_savings,
    stats.total_income_amount,
  );
  const spendingRate = getPercentage(
    stats.total_expenses_amount,
    stats.total_income_amount,
  );

  return (
    <>
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Account summary
        </h2>

        <div className={styles.statsGrid}>
          <StatCard
            label="Total income"
            count={stats.income_count}
            amount={stats.total_income_amount}
            href="/income"
            valueAccent="accent"
          />
          <StatCard
            label="Total expenses"
            count={stats.expenses_count}
            amount={stats.total_expenses_amount}
            href="/expense"
            valueAccent="danger"
          />
          <StatCard
            className={styles.savingsCard}
            label="Net savings"
            amount={stats.net_savings}
            valueAccent={stats.net_savings >= 0 ? "accent" : "danger"}
          />
        </div>
      </section>

      <section className={styles.insights} aria-labelledby="insights-heading">
        <div>
          <p className={styles.eyebrow}>At a glance</p>
          <h2 id="insights-heading" className={styles.sectionHeading}>
            Money insights
          </h2>
        </div>

        <InsightBar
          label="Savings rate"
          value={savingsRate}
          description="Percentage of income currently retained"
        />

        <InsightBar
          label="Income spent"
          value={spendingRate}
          description="Percentage of income used for expenses"
        />
      </section>
    </>
  );
}

function getPercentage(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0;
}
