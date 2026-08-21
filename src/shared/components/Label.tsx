import type { LabelHTMLAttributes } from "react";
import { cn } from "../utilities/css";

export default function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: reusable label wrapper is paired with controls at call sites
    <label
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    />
  );
}
