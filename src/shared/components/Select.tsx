import type { SelectHTMLAttributes } from "react";
import { cn } from "../utilities/css.utilities";
import styles from "./Input.module.css";

export default function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(styles.input, className)} {...props} />;
}
