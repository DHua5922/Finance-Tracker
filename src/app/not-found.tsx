import Link from "next/link";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility.constants";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="flex flex-1 items-center justify-center px-6 py-20"
    >
      <div className="max-w-lg text-center">
        <p className="font-semibold text-accent-foreground text-sm uppercase tracking-widest">
          404
        </p>

        <h1 className="mt-3 font-bold text-4xl tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>

        <Link href="/dashboard" className={styles.dashboardLink}>
          Go back to dashboard
        </Link>
      </div>
    </main>
  );
}
