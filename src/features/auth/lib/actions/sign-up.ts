"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { signUpUserFormDataSchema } from "../../schemas";
import { signUpUserApi } from "../api";
import { setUserSession } from "../session";

interface SignUpActionState {
  isError: boolean;
  errorMessage: string;
  values: SignUpFormValues;
  fieldErrors: Partial<
    Record<keyof z.infer<typeof signUpUserFormDataSchema>, string[]>
  >;
}

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signUpUserAction(
  _previousState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const values = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
  const result = signUpUserFormDataSchema.safeParse(values);

  if (!result.success) {
    return {
      isError: true,
      errorMessage: "Please correct the errors below",
      values,
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const session = await signUpUserApi(result.data);
    await setUserSession(session);
  } catch (error) {
    return {
      isError: true,
      errorMessage:
        error instanceof Error ? error.message : "Unable to create account",
      values,
      fieldErrors: {},
    };
  }

  redirect("/dashboard");
}
