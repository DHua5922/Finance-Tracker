import type { HTMLAttributes } from "react";
import Label from "./Label";

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: string;
  required?: boolean;
  isError?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
  htmlFor: string;
}

export default function Field({
  children,
  isError,
  errorMessage,
  required,
  label,
  htmlFor,
  ...props
}: Props) {
  return (
    <div {...props}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-rose-600">*</span>}
      </Label>

      {children}

      {isError && <p className="text-xs text-rose-600">{errorMessage}</p>}
    </div>
  );
}
