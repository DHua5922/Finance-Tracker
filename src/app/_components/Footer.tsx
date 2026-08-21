import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span>© 2026 FinanceFlow</span>

        <button type="button" className={styles.contactButton}>
          Contact
        </button>
      </div>
    </footer>
  );
}
