"use server";

import { z } from "zod";
import { signUpUserFormDataSchema } from "../../schemas";
import { signUpUserApi } from "../api";

interface SignUpActionState {
  isError: boolean;
  errorMessage: string;
  fieldErrors: Partial<
    Record<keyof z.infer<typeof signUpUserFormDataSchema>, string[]>
  >;
}

export async function signUpUserAction(
  _previousState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const result = signUpUserFormDataSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      isError: true,
      errorMessage: "Please correct the errors below",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await signUpUserApi(result.data);
    return {
      isError: false,
      errorMessage: "",
      fieldErrors: {},
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage:
        error instanceof Error ? error.message : "Unable to create account",
      fieldErrors: {},
    };
  }
}
