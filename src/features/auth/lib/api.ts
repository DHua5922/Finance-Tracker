import { z } from "zod";
import { createAuthApiFetch } from "./config";
import { parseFetchErrorMessage } from "@/shared/utilities/api";
import { AUTH_API_BACKEND_BASE_URL, AUTH_API_ROUTES } from "./constants";

const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: z
    .object({
      _id: z.string(),
    })
    .optional(),
});

interface LoginArgs {
  email: string;
  password: string;
}

interface CloseAccountArgs {
  userId: string;
  accessToken: string;
}

function createServerAuthApiFetch(baseUrl?: string, accessToken?: string) {
  return createAuthApiFetch({
    baseUrl: baseUrl ?? AUTH_API_BACKEND_BASE_URL,
    defaultHeaders: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

export async function loginUserApi(
  { email, password }: LoginArgs,
  baseUrl?: string,
) {
  const response = await createServerAuthApiFetch(baseUrl)(
    AUTH_API_ROUTES.login,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFetchErrorMessage(response));
  }

  return loginResponseSchema.parse(await response.json());
}

export async function closeAccountApi(
  { userId, accessToken }: CloseAccountArgs,
  baseUrl?: string,
) {
  return createServerAuthApiFetch(baseUrl, accessToken)(
    AUTH_API_ROUTES.closeAccount(userId),
    {
      method: "DELETE",
    },
  );
}
