"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { resetPasswordFormDataSchema } from "../../schemas";
import { resetPasswordApi } from "../api/auth.api";

interface ResetPasswordState {
  isError: boolean;
  message: string;
  fieldErrors: Partial<Record<"password" | "confirmPassword", string[]>>;
}

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = z.string().min(1).safeParse(formData.get("token"));
  if (!token.success) {
    return {
      isError: true,
      message: "This password reset link is invalid.",
      fieldErrors: {},
    };
  }

  const result = resetPasswordFormDataSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!result.success) {
    return {
      isError: true,
      message: "Please correct the errors below.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await resetPasswordApi(token.data, result.data);
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error ? error.message : "Unable to reset password",
      fieldErrors: {},
    };
  }

  redirect("/?login=1");
}
