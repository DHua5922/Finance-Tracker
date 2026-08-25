import Link from "next/link";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utilities/css.utilities";
import styles from "./StatCard.module.css";

interface Props extends HTMLAttributes<HTMLElement> {
  label: string;
  amount: number;
  count?: number;
  href?: string;
  valueAccent?: "accent" | "danger" | "neutral";
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function StatCard({
  label,
  count,
  amount,
  href,
  className,
  valueAccent = "neutral",
  ...props
}: Props) {
  return (
    <article className={cn(styles.card, className)} {...props}>
      <div>
        <h2 className={styles.label}>{label}</h2>

        {count !== undefined && (
          <p className={styles.count}>
            {count} {count === 1 ? "transaction" : "transactions"}
          </p>
        )}
      </div>

      <p className={cn(styles.amount, styles[valueAccent])}>
        {currencyFormatter.format(amount)}
      </p>

      {href && (
        <Link href={href} className={styles.detailsLink}>
          View {label.toLowerCase()} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}
