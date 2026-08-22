"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createFetchInstance,
  parseFetchErrorMessage,
} from "@/shared/utilities/api";
import { signUpUserFormDataSchema } from "../schemas";
import { buildAuthApiUrl } from "./config";
import { AUTH_API_BACKEND_BASE_URL, AUTH_API_ROUTES } from "./constants";

const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});

const logInUserFormDataSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const authBackendFetch = createFetchInstance({
  defaultBaseUrl: AUTH_API_BACKEND_BASE_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});

export async function signUpUserAction(values: unknown) {
  const payload = signUpUserFormDataSchema.parse(values);
  const response = await authBackendFetch(
    buildAuthApiUrl(AUTH_API_ROUTES.register),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFetchErrorMessage(response));
  }

  return userSchema.parse(await response.json());
}

interface LogInActionResult {
  isError?: boolean;
  errorMessage?: string;
}
export async function logInAction(
  _prevState: unknown,
  formData: FormData,
): Promise<LogInActionResult> {
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

  redirect("/dashboard");
}
