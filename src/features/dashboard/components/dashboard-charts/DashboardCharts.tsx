"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./DashboardCharts.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface DashboardChartsProps {
  totalIncome: number;
  totalExpenses: number;
}
export default function DashboardCharts({
  totalIncome,
  totalExpenses,
}: DashboardChartsProps) {
  return (
    <section className="grid gap-6" aria-labelledby="charts-heading">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
          Visual overview
        </p>

        <h2 id="charts-heading" className="mt-1.5 text-2xl font-bold">
          Cash flow chart
        </h2>
      </div>

      <article className={styles.chartCard}>
        <h3 className="text-lg font-bold">Income versus expenses</h3>
        <p className="mt-1 text-muted-foreground">
          Compare your selected financial totals.
        </p>

        {totalIncome + totalExpenses > 0 ? (
          <BarChartCard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
        ) : (
          <p className="grid min-h-80 place-items-center text-center text-muted-foreground">
            Add a transaction to see this chart.
          </p>
        )}
      </article>
    </section>
  );
}

interface BarChartCardProps {
  totalIncome: number;
  totalExpenses: number;
}
function BarChartCard({ totalIncome, totalExpenses }: BarChartCardProps) {
  const chartData = [
    { name: "Income", amount: totalIncome, fill: "#10b981" },
    { name: "Expenses", amount: totalExpenses, fill: "#f43f5e" },
  ];

  return (
    <div
      className={styles.chart}
      role="img"
      aria-label={`Bar chart showing ${currencyFormatter.format(totalIncome)} income and ${currencyFormatter.format(totalExpenses)} expenses`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
          
          <XAxis dataKey="name" stroke="var(--muted-foreground)" />

          <YAxis
            stroke="var(--muted-foreground)"
            tickFormatter={(value) => currencyFormatter.format(value)}
            width={72}
          />

          <Tooltip
            formatter={(value) => currencyFormatter.format(Number(value))}
            contentStyle={getTooltipStyle()}
          />

          <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function getTooltipStyle() {
  return {
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    background: "var(--surface)",
    color: "var(--foreground)",
  };
}
