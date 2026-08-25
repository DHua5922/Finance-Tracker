"use client";

import { useActionState, useId } from "react";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";
import {
  type UpdateProfileActionState,
  updateProfileAction,
} from "../lib/actions/update-profile.action";

interface Props {
  username: string;
  email: string;
}

export default function ProfileForm({ username, email }: Props) {
  const usernameId = useId();
  const emailId = useId();
  const initialState: UpdateProfileActionState = {
    status: "idle",
    message: "",
    values: { username, email },
  };
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "text-sm text-red-600 dark:text-red-400"
              : "text-sm text-accent-foreground"
          }
        >
          {state.message}
        </p>
      )}

      <Field className="space-y-2" label="Username" htmlFor={usernameId}>
        <Input
          id={usernameId}
          name="username"
          defaultValue={state.values.username}
          autoComplete="username"
          required
        />
      </Field>

      <Field className="space-y-2" label="Email" htmlFor={emailId}>
        <Input
          id={emailId}
          name="email"
          type="email"
          defaultValue={state.values.email}
          autoComplete="email"
          required
        />
      </Field>

      <Button type="submit" isLoading={isPending} loadingText="Saving...">
        Save changes
      </Button>
    </form>
  );
}
