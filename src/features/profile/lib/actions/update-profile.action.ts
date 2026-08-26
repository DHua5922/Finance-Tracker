"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { accessTokenName, requireAuthenticatedUser } from "@/shared/session";
import { updateUserProfileSchema } from "../../schemas";
import { updateUserApi } from "../api/profile.api";

export interface UpdateProfileActionState {
  status: "idle" | "error" | "success";
  message: string;
  values: { username: string; email: string };
}

export async function updateProfileAction(
  _previousState: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const values = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const result = updateUserProfileSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues[0]?.message ?? "Invalid profile details",
      values,
    };
  }

  const user = await requireAuthenticatedUser("/profile");
  const accessToken = (await cookies()).get(accessTokenName)?.value;

  if (!accessToken) {
    return { status: "error", message: "Your session has expired.", values };
  }

  try {
    await updateUserApi({ userId: user._id, accessToken }, result.data);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to update profile.",
      values,
    };
  }

  revalidatePath("/profile");
  return {
    status: "success",
    message: "Profile updated.",
    values: result.data,
  };
}
