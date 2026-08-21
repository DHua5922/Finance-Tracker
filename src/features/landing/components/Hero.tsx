import GetStartedButton from "@/features/auth/components/GetStartedButton";
import Card from "@/shared/components/Card";

const barHeights = [48, 64, 52, 70, 60, 82, 100];

export default function Hero() {
  return (
    <section className="grid items-center gap-10 pb-20 pt-8 lg:grid-cols-[1.2fr_0.8fr] lg:pt-16">
      <div>
        <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
          smarter money habits
        </span>

        <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Take control of your finances, one smart step at a time.
        </h1>

        <p className="mt-5 max-w-lg text-lg text-slate-300">
          Track spending, plan ahead, and build confidence with a simple
          dashboard designed to help you stay on top of every dollar.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <GetStartedButton className="rounded-full bg-emerald-400 px-6 py-3 text-base text-slate-950 hover:bg-emerald-300" />
        </div>

        <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
          <MetricPill label="faster planning" value="2.4x" />
          <MetricPill label="saved monthly" value="$18k" />
          <MetricPill label="user retention" value="96%" />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-emerald-950/30">
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
      <div className="text-2xl font-bold text-white">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-700">
        overview
      </span>
    </div>
  );
}

function BalanceCard() {
  return (
    <div className="rounded-2xl bg-slate-800 p-4">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Monthly balance</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
          +12.4%
        </span>
      </div>

      <div className="mt-3 text-3xl font-bold text-white">$24,680</div>

      <div className="mt-5 h-24 rounded-xl bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-transparent p-3">
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
