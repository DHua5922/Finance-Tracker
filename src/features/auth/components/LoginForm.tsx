"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { logInAction } from "@/features/auth/lib/actions/login.action";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";

const initialState: Parameters<typeof logInAction>[0] = {
  isError: false,
  errorMessage: "",
  values: { email: "", password: "" },
};

export default function LoginForm() {
  const emailInputId = useId();
  const passwordInputId = useId();
  const [actionState, formAction, isPending] = useActionState(
    logInAction,
    initialState,
  );
  const state = actionState ?? initialState;

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
          defaultValue={state.values.email || undefined}
          placeholder="name@example.com"
        />
      </Field>

      <Field className="space-y-2" label="Password" htmlFor={passwordInputId}>
        <Input
          id={passwordInputId}
          name="password"
          type="password"
          defaultValue={state.values.password || undefined}
          placeholder="••••••••"
        />
      </Field>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-950"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isPending}
        loadingText="Logging in..."
      >
        Log in
      </Button>
    </form>
  );
}
