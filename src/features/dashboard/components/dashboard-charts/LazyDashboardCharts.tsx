"use client";

import dynamic from "next/dynamic";
import type { DashboardChartsProps } from "./DashboardCharts";

const DashboardCharts = dynamic(
  () => import(/* webpackChunkName: "dashboard-charts" */ "./DashboardCharts"),
  {
    ssr: false,
    loading: () => (
      <output className="text-muted-foreground">Loading charts...</output>
    ),
  },
);

export default function LazyDashboardCharts(props: DashboardChartsProps) {
  return <DashboardCharts {...props} />;
}
