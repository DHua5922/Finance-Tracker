import GetStartedButton from "@/features/auth/components/GetStartedButton";
import styles from "./PublicHeader.module.css";

export default function PublicHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className="flex items-center gap-3">
          <div className={styles.brandBadge}>F</div>

          <span className="text-lg font-semibold tracking-tight">
            FinanceFlow
          </span>
        </div>

        <GetStartedButton className="rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300" />
      </nav>
    </header>
  );
}
