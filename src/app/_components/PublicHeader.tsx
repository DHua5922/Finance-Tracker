import GetStartedButton from "@/features/auth/components/GetStartedButton";
import styles from "./PublicHeader.module.css";

export default function PublicHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brandRow}>
          <div className={styles.brandBadge}>F</div>

          <span className={styles.brandText}>FinanceFlow</span>
        </div>

        <GetStartedButton className={styles.ctaButton} />
      </nav>
    </header>
  );
}
