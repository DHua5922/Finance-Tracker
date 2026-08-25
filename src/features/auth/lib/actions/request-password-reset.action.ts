"use server";

import { z } from "zod";
import { getAccessTokenByEmailApi } from "../api/auth.api";
import { sendPasswordResetEmail } from "../email";

const passwordResetEmailSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

interface RequestPasswordResetState {
  isError: boolean;
  message: string;
  email: string;
}

export async function requestPasswordResetAction(
  _previousState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const email = String(formData.get("email") ?? "");
  const result = passwordResetEmailSchema.safeParse({ email });

  if (!result.success) {
    return {
      isError: true,
      message: result.error.issues[0]?.message ?? "Enter a valid email",
      email,
    };
  }

  try {
    const { accessToken, accessTokenExpireTime } =
      await getAccessTokenByEmailApi(result.data.email);

    await sendPasswordResetEmail(
      result.data.email,
      accessToken,
      accessTokenExpireTime,
    );

    return {
      isError: false,
      message: "Check your email for a password reset link.",
      email,
    };
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error
          ? error.message
          : "Unable to send password reset email",
      email,
    };
  }
}
