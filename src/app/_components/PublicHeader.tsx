import GetStartedButton from "@/features/auth/components/GetStartedButton";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-slate-950">
            F
          </div>

          <span className="text-lg font-semibold tracking-tight">
            FinanceFlow
          </span>
        </div>

        <GetStartedButton className="rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300" />
      </nav>
    </header>
  );
}
