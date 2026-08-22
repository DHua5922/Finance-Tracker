import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utilities/css";
import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export default function Button({
  className,
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={cn(styles.button, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
