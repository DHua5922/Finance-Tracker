"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpUserAction } from "@/features/auth/lib/actions";
import { signUpUserFormDataSchema } from "@/features/auth/schemas";
import Button from "@/shared/components/Button";
import Field from "@/shared/components/Field";
import Input from "@/shared/components/Input";
import { cn } from "@/shared/utilities/css";

const INPUT_IDS = {
  username: "username",
  email: "email",
  password: "password",
  confirmPassword: "confirmPassword",
} as const;

function useSignUpForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpUserFormDataSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await signUpUserAction(values);
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to register user",
      );
    }
  });

  return {
    register,
    errors,
    isSubmitting,
    onSubmit,
    submitError,
  };
}

export default function SignUpForm() {
  const { register, errors, isSubmitting, onSubmit, submitError } =
    useSignUpForm();

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

      <Field
        className="space-y-2"
        htmlFor={INPUT_IDS.username}
        label="Username"
        required
        isError={Boolean(errors.username)}
        errorMessage={errors.username?.message ?? ""}
      >
        <Input
          id={INPUT_IDS.username}
          type="text"
          placeholder="Jane Doe"
          aria-invalid={Boolean(errors.username)}
          className={cn(
            errors.username && "border-rose-400 focus-visible:ring-rose-300",
          )}
          {...register("username")}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={INPUT_IDS.email}
        label="Email"
        required
        isError={Boolean(errors.email)}
        errorMessage={errors.email?.message ?? ""}
      >
        <Input
          id={INPUT_IDS.email}
          type="email"
          placeholder="name@example.com"
          aria-invalid={Boolean(errors.email)}
          className={cn(
            errors.email && "border-rose-400 focus-visible:ring-rose-300",
          )}
          {...register("email")}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={INPUT_IDS.password}
        label="Password"
        required
        isError={Boolean(errors.password)}
        errorMessage={errors.password?.message ?? ""}
      >
        <Input
          id={INPUT_IDS.password}
          type="password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          className={cn(
            errors.password && "border-rose-400 focus-visible:ring-rose-300",
          )}
          {...register("password")}
        />
      </Field>

      <Field
        className="space-y-2"
        htmlFor={INPUT_IDS.confirmPassword}
        label="Confirm password"
        required
        isError={Boolean(errors.confirmPassword)}
        errorMessage={errors.confirmPassword?.message ?? ""}
      >
        <Input
          id={INPUT_IDS.confirmPassword}
          type="password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.confirmPassword)}
          className={cn(
            errors.confirmPassword &&
              "border-rose-400 focus-visible:ring-rose-300",
          )}
          {...register("confirmPassword")}
        />
      </Field>

      <Button
        type="submit"
        className="w-full rounded-full bg-slate-900 py-2.5 text-white hover:bg-slate-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
