import type { ReactNode } from "react";
import { Card } from "@/shared/components";
import styles from "./Hero.module.css";

const barHeights = [48, 64, 52, 70, 60, 82, 100];

interface Props {
  primaryAction: ReactNode;
}

export default function Hero({ primaryAction }: Props) {
  return (
    <section className={styles.heroSection}>
      <div>
        <span className={styles.badge}>smarter money habits</span>

        <h1 className={styles.heading}>
          Take control of your finances, one smart step at a time.
        </h1>

        <p className={styles.description}>
          Track spending, plan ahead, and build confidence with a simple
          dashboard designed to help you stay on top of every dollar.
        </p>

        <div className={styles.ctaContainer}>{primaryAction}</div>

        <div className={styles.metricsRow}>
          <MetricPill label="faster planning" value="2.4x" />
          <MetricPill label="saved monthly" value="$18k" />
          <MetricPill label="user retention" value="96%" />
        </div>
      </div>

      <div className={styles.previewPanel}>
        <Card className="overflow-hidden border-slate-800 bg-slate-900 p-0">
          <DashboardHeader />

          <div className="space-y-5 p-5">
            <BalanceCard />

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Income" amount="$8,430" />
              <StatCard label="Expenses" amount="$3,210" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className={styles.dashboardHeader}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
        overview
      </span>
    </div>
  );
}

function BalanceCard() {
  return (
    <div className="rounded-2xl bg-slate-800 p-4">
      <div className={styles.balanceHeader}>
        <span>Monthly balance</span>
        <span className={styles.balanceChangeBadge}>+12.4%</span>
      </div>

      <div className="mt-3 text-3xl font-bold text-white">$24,680</div>

      <div className={styles.chartWrapper}>
        <div className="flex h-full items-end gap-2">
          {barHeights.map((height) => (
            <span
              key={height}
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-400 to-sky-400"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ amount, label }: { amount: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-800 p-4">
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{amount}</div>
    </div>
  );
}
