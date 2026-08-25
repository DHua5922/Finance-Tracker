"use server";

import { redirect } from "next/navigation";
import { setUserSession } from "@/shared/session/session";
import { logInUserFormDataSchema } from "../../schemas";
import { loginUserApi } from "../api/auth.api";

interface GuestLogInActionState {
  isError: boolean;
  errorMessage: string;
}

export async function guestLogInAction(
  _previousState: GuestLogInActionState,
): Promise<GuestLogInActionState> {
  const credentials = logInUserFormDataSchema.safeParse({
    email: process.env.GUEST_USER_EMAIL,
    password: process.env.GUEST_USER_PASSWORD,
  });

  if (!credentials.success) {
    return {
      isError: true,
      errorMessage: "Guest login is not configured",
    };
  }

  try {
    const session = await loginUserApi(credentials.data);
    await setUserSession(session);
  } catch (error) {
    return {
      isError: true,
      errorMessage:
        error instanceof Error ? error.message : "Cannot log in as guest",
    };
  }

  redirect("/dashboard");
}
