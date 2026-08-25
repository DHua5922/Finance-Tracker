import type { InputHTMLAttributes } from "react";
import { cn } from "../utilities/css.utilities";
import styles from "./Input.module.css";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.input, className)} {...props} />;
}
