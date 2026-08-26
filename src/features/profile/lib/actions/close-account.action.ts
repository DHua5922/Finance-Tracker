"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accessTokenName,
  clearUserSession,
  requireAuthenticatedUser,
} from "@/shared/session";
import { deleteUserApi } from "../api/profile.api";

export interface CloseAccountActionState {
  errorMessage: string;
}

export async function closeAccountAction(
  _previousState: CloseAccountActionState,
): Promise<CloseAccountActionState> {
  const user = await requireAuthenticatedUser("/profile");
  const accessToken = (await cookies()).get(accessTokenName)?.value;

  if (!accessToken) return { errorMessage: "Your session has expired." };

  try {
    await deleteUserApi({ userId: user._id, accessToken });
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unable to close your account.",
    };
  }

  await clearUserSession();
  redirect("/");
}
