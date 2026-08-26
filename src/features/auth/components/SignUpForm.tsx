"use client";

import { useActionState, useId } from "react";
import { Button, Field, Input } from "@/shared/components";
import { cn } from "@/shared/utilities";
import { signUpUserAction } from "../lib/actions/sign-up.action";

const initialState: Parameters<typeof signUpUserAction>[0] = {
  isError: false,
  errorMessage: "",
  values: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  fieldErrors: {},
};

export default function SignUpForm() {
  const usernameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();
  const [actionState, formAction, isPending] = useActionState(
    signUpUserAction,
    initialState,
  );
  const state = actionState ?? initialState;

  return (
    <form className="space-y-4" action={formAction}>
      {state.isError && (
        <p className="text-sm text-rose-600" role="alert">
          {state.errorMessage}
        </p>
      )}

      <Field
        className="space-y-2"
        htmlFor={usernameInputId}
        label="Username"
        required
        isError={Boolean(state.fieldErrors.username)}
        errorMessage={state.fieldErrors.username?.[0] ?? ""}
      >
        <Input
          id={usernameInputId}
          name="username"
          type="text"
          defaultValue={state.values.username || undefined}
          placeholder="Jane Doe"
          aria-invalid={Boolean(state.fieldErrors.username)}
          className={cn(
            state.fieldErrors.username &&
              "border-rose-400 focus-visible:ring-rose-300",
          )}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={emailInputId}
        label="Email"
        required
        isError={Boolean(state.fieldErrors.email)}
        errorMessage={state.fieldErrors.email?.[0] ?? ""}
      >
        <Input
          id={emailInputId}
          name="email"
          type="email"
          defaultValue={state.values.email || undefined}
          placeholder="name@example.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          className={cn(
            state.fieldErrors.email &&
              "border-rose-400 focus-visible:ring-rose-300",
          )}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={passwordInputId}
        label="Password"
        required
        isError={Boolean(state.fieldErrors.password)}
        errorMessage={state.fieldErrors.password?.[0] ?? ""}
      >
        <Input
          id={passwordInputId}
          name="password"
          type="password"
          defaultValue={state.values.password || undefined}
          placeholder="••••••••"
          aria-invalid={Boolean(state.fieldErrors.password)}
          className={cn(
            state.fieldErrors.password &&
              "border-rose-400 focus-visible:ring-rose-300",
          )}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={confirmPasswordInputId}
        label="Confirm password"
        required
        isError={Boolean(state.fieldErrors.confirmPassword)}
        errorMessage={state.fieldErrors.confirmPassword?.[0] ?? ""}
      >
        <Input
          id={confirmPasswordInputId}
          name="confirmPassword"
          type="password"
          defaultValue={state.values.confirmPassword || undefined}
          placeholder="••••••••"
          aria-invalid={Boolean(state.fieldErrors.confirmPassword)}
          className={cn(
            state.fieldErrors.confirmPassword &&
              "border-rose-400 focus-visible:ring-rose-300",
          )}
        />
      </Field>

      <Button
        type="submit"
        className="w-full rounded-full bg-foreground py-2.5 text-background hover:bg-foreground/80"
        isLoading={isPending}
        loadingText="Creating account..."
      >
        Create account
      </Button>
    </form>
  );
}
