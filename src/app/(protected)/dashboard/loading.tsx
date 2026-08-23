const stats = ["income", "expenses", "savings"];

export default function DashboardLoading() {
  return (
    <output
      className="block animate-pulse space-y-8"
      aria-label="Loading dashboard"
    >
      <div className="space-y-3">
        <div className="h-3 w-32 rounded bg-foreground/10" />
        <div className="h-10 w-72 max-w-full rounded bg-foreground/10" />
        <div className="h-4 w-96 max-w-full rounded bg-foreground/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item}
            className="h-48 rounded-2xl border border-foreground/10 bg-foreground/5"
          />
        ))}
      </div>

      <span className="sr-only">Loading your financial overview</span>
    </output>
  );
}
