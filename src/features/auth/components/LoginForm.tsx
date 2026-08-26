"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { guestLogInAction } from "@/features/auth/lib/actions/guest-login.action";
import { logInAction } from "@/features/auth/lib/actions/login.action";
import { Button, Field, Input } from "@/shared/components";

const initialState: Parameters<typeof logInAction>[0] = {
  isError: false,
  errorMessage: "",
  values: { email: "", password: "" },
};

const initialGuestState: Parameters<typeof guestLogInAction>[0] = {
  isError: false,
  errorMessage: "",
};

export default function LoginForm() {
  const emailInputId = useId();
  const passwordInputId = useId();
  const [actionState, formAction, isPending] = useActionState(
    logInAction,
    initialState,
  );
  const [guestActionState, guestFormAction, isGuestPending] = useActionState(
    guestLogInAction,
    initialGuestState,
  );
  const state = actionState ?? initialState;
  const guestState = guestActionState ?? initialGuestState;

  return (
    <div className="space-y-4">
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
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
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

      <p className="text-center text-sm text-muted-foreground">or</p>

      <form action={guestFormAction}>
        {guestState.isError && (
          <p className="mb-4 text-red-500 text-sm" role="alert">
            {guestState.errorMessage}
          </p>
        )}

        <Button
          type="submit"
          className="w-full border border-border bg-surface text-foreground hover:bg-surface-muted"
          isLoading={isGuestPending}
          loadingText="Logging in..."
        >
          Continue as guest
        </Button>
      </form>
    </div>
  );
}
