"use server";

import { redirect } from "next/navigation";
import { logInUserFormDataSchema } from "../../schemas";
import { loginUserApi } from "../api";
import { setUserSession } from "../session";

interface LogInActionState {
  isError: boolean;
  errorMessage: string;
  values: {
    email: string;
    password: string;
  };
}

export async function logInAction(
  _previousState: LogInActionState,
  formData: FormData,
): Promise<LogInActionState> {
  const values = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const result = logInUserFormDataSchema.safeParse(values);

  if (!result.success) {
    return {
      isError: true,
      errorMessage: result.error.issues[0]?.message ?? "Invalid login details",
      values,
    };
  }

  try {
    const session = await loginUserApi(result.data);
    await setUserSession(session);
  } catch (error) {
    return {
      isError: true,
      errorMessage: error instanceof Error ? error.message : "Cannot log in",
      values,
    };
  }

  redirect("/dashboard");
}
