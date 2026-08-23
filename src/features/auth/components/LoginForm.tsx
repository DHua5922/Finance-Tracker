"use client";

import { useActionState, useId } from "react";
import { logInAction } from "@/features/auth/lib/actions/login";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";

export default function LoginForm() {
  const emailInputId = useId();
  const passwordInputId = useId();
  const [state, formAction, isPending] = useActionState(logInAction, {
    isError: false,
    errorMessage: "",
  });

  return (
    <form className="space-y-4" action={formAction}>
      {state?.isError && (
        <p className="text-red-500 text-sm" role="alert">
          {state?.errorMessage}
        </p>
      )}

      <Field className="space-y-2" label="Email" htmlFor={emailInputId}>
        <Input
          id={emailInputId}
          name="email"
          type="email"
          placeholder="name@example.com"
        />
      </Field>

      <Field className="space-y-2" label="Password" htmlFor={passwordInputId}>
        <Input
          id={passwordInputId}
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </Field>

      <Button type="submit" isLoading={isPending} loadingText="Logging in...">
        Log in
      </Button>
    </form>
  );
}
