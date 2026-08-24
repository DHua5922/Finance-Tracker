"use client";

import { useActionState, useId } from "react";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";
import { requestPasswordResetAction } from "../lib/actions/request-password-reset.action";

const initialState: Parameters<typeof requestPasswordResetAction>[0] = {
  isError: false,
  message: "",
  email: "",
};

export default function RequestPasswordResetForm() {
  const emailInputId = useId();
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <p
          role={state.isError ? "alert" : "status"}
          className={state.isError ? "text-red-600" : "text-emerald-700"}
        >
          {state.message}
        </p>
      )}

      <Field label="Email" htmlFor={emailInputId} required>
        <Input
          id={emailInputId}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email || undefined}
        />
      </Field>

      <Button type="submit" isLoading={isPending} loadingText="Sending...">
        Send reset link
      </Button>
    </form>
  );
}
