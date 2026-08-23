import GetStartedButton from "@/features/auth/components/GetStartedButton";
import styles from "./PublicHeader.module.css";

interface Props {
  showLogin?: boolean;
}

export default function PublicHeader({ showLogin = false }: Props) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className="flex items-center gap-3">
          <div className={styles.brandBadge}>F</div>

          <span className="text-lg font-semibold tracking-tight">
            FinanceFlow
          </span>
        </div>

        <GetStartedButton
          initiallyOpen={showLogin}
          className="rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300"
        />
      </nav>
    </header>
  );
}
