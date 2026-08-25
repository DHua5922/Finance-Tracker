"use client";

import Link from "next/link";
import Button from "@/shared/components/Button";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility.constants";
import styles from "./error.module.css";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error: _error, reset }: Props) {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="flex flex-1 items-center justify-center px-6 py-20"
    >
      <div className="max-w-lg text-center" role="alert">
        <p className="font-semibold text-[var(--danger-foreground)] text-sm uppercase tracking-widest">
          Something went wrong
        </p>

        <h1 className="mt-3 font-bold text-4xl tracking-tight sm:text-5xl">
          We could not load this page
        </h1>

        <p className="mt-4 text-muted-foreground">
          Try loading it again. If the problem continues, return to your
          dashboard.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            Try again
          </Button>

          <Link href="/dashboard" className={styles.dashboardLink}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
