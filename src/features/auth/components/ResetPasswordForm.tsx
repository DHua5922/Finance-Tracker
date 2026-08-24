"use client";

import { useActionState, useId } from "react";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";
import { resetPasswordAction } from "../lib/actions/reset-password.action";

interface Props {
  token: string;
}

const initialState: Parameters<typeof resetPasswordAction>[0] = {
  isError: false,
  message: "",
  fieldErrors: {},
};

export default function ResetPasswordForm({ token }: Props) {
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state.message && (
        <p role="alert" className="text-red-600">
          {state.message}
        </p>
      )}

      <Field
        label="New password"
        htmlFor={passwordInputId}
        required
        isError={Boolean(state.fieldErrors.password)}
        errorMessage={state.fieldErrors.password?.[0] ?? ""}
      >
        <Input
          id={passwordInputId}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors.password)}
        />
      </Field>

      <Field
        label="Confirm password"
        htmlFor={confirmPasswordInputId}
        required
        isError={Boolean(state.fieldErrors.confirmPassword)}
        errorMessage={state.fieldErrors.confirmPassword?.[0] ?? ""}
      >
        <Input
          id={confirmPasswordInputId}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors.confirmPassword)}
        />
      </Field>

      <Button type="submit" isLoading={isPending} loadingText="Resetting...">
        Reset password
      </Button>
    </form>
  );
}
