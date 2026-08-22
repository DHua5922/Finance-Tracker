"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createFetchInstance,
  parseFetchErrorMessage,
} from "@/shared/utilities/api";
import { signUpUserFormDataSchema } from "../schemas";
import convertTimeToMaxAge from "../utilities/convertTimeToMaxAge";
import { buildAuthApiUrl } from "./config";
import { AUTH_API_BACKEND_BASE_URL, AUTH_API_ROUTES } from "./constants";

const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});

const authBackendFetch = createFetchInstance({
  defaultBaseUrl: AUTH_API_BACKEND_BASE_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});

interface SignUpActionState {
  isError: boolean;
  errorMessage: string;
  fieldErrors: Partial<
    Record<keyof z.infer<typeof signUpUserFormDataSchema>, string[]>
  >;
}
export async function signUpUserAction(
  _prevState: SignUpActionState,
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
      isError: false,
      errorMessage: "",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const response = await authBackendFetch(
    buildAuthApiUrl(AUTH_API_ROUTES.register),
    {
      method: "POST",
      body: JSON.stringify(result.data),
    },
  );

  if (!response.ok) {
    return {
      isError: true,
      errorMessage: await parseFetchErrorMessage(response),
      fieldErrors: {},
    };
  }

  userSchema.parse(await response.json());

  return {
    isError: false,
    errorMessage: "",
    fieldErrors: {},
  };
}

interface LogInActionResult {
  isError?: boolean;
  errorMessage?: string;
}
export async function logInAction(
  _prevState: unknown,
  formData: FormData,
): Promise<LogInActionResult> {
  const logInUserFormDataSchema = z.object({
    email: z.email(),
    password: z.string(),
  });
  const payload = logInUserFormDataSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const response = await authBackendFetch(
    buildAuthApiUrl(AUTH_API_ROUTES.login),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const isError = !response.ok;
  if (isError) {
    return {
      isError,
      errorMessage: await parseFetchErrorMessage(response),
    };
  }

  const logInResponseDataSchema = z.object({
    user: userSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpireTime: z.string(),
    refreshTokenExpireTime: z.string(),
  });
  const userSessionParams = logInResponseDataSchema.parse(
    await response.json(),
  );
  setUserSession(userSessionParams);

  redirect("/dashboard");
}

interface UserSessionParams {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireTime: string;
  refreshTokenExpireTime: string;
}
async function setUserSession({
  accessToken,
  refreshToken,
  accessTokenExpireTime,
  refreshTokenExpireTime,
}: UserSessionParams) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const path = "/";

  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path,
    maxAge: convertTimeToMaxAge(accessTokenExpireTime),
  });

  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure,
    sameSite: "strict",
    path,
    maxAge: convertTimeToMaxAge(refreshTokenExpireTime),
  });
}
