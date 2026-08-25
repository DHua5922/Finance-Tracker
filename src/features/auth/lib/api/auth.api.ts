import { z } from "zod";
import {
  type logInUserFormDataSchema,
  type resetPasswordFormDataSchema,
  type signUpUserFormDataSchema,
  tokensSchema,
} from "@/features/auth/schemas";
import { throwIfResponseFailed } from "@/shared/utilities/api.utilities";
import { AUTH_API_BACKEND_BASE_URL, AUTH_API_ROUTES } from "../constants";
import { createAuthApiFetch } from "./config.api";

type LoginInput = z.infer<typeof logInUserFormDataSchema>;
type SignUpUserInput = z.infer<typeof signUpUserFormDataSchema>;
type ResetPasswordInput = z.infer<typeof resetPasswordFormDataSchema>;

const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.email(),
});

const authSessionSchema = tokensSchema.extend({
  user: userSchema,
});

export async function loginUserApi(input: LoginInput) {
  const response = await createServerAuthApiFetch()(AUTH_API_ROUTES.login, {
    method: "POST",
    body: JSON.stringify(input),
  });

  await throwIfResponseFailed(response);

  return authSessionSchema.parse(await response.json());
}

export async function signUpUserApi(input: SignUpUserInput) {
  const response = await createServerAuthApiFetch()(AUTH_API_ROUTES.register, {
    method: "POST",
    body: JSON.stringify(input),
  });

  await throwIfResponseFailed(response);
  return authSessionSchema.parse(await response.json());
}

export async function getMeApi(accessToken: string) {
  const response = await createServerAuthApiFetch(accessToken)(
    AUTH_API_ROUTES.me,
    { method: "GET" },
  );

  await throwIfResponseFailed(response);
  return userSchema.parse(await response.json());
}

export async function getAccessTokenByEmailApi(email: string) {
  const response = await createServerAuthApiFetch()(
    AUTH_API_ROUTES.accessTokenByEmail,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );

  await throwIfResponseFailed(response);
  return z
    .object({
      accessToken: z.string(),
      accessTokenExpireTime: z.string().regex(/^\d+[mhd]$/),
    })
    .parse(await response.json());
}

export async function resetPasswordApi(
  accessToken: string,
  input: ResetPasswordInput,
) {
  const response = await createServerAuthApiFetch(accessToken)(
    AUTH_API_ROUTES.resetPassword,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  await throwIfResponseFailed(response);
  return userSchema.parse(await response.json());
}

export async function refreshTokensApi(refreshToken: string) {
  const response = await createServerAuthApiFetch()(
    AUTH_API_ROUTES.refreshTokens,
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    },
  );

  await throwIfResponseFailed(response);
  return tokensSchema.parse(await response.json());
}

interface CloseAccountArgs {
  userId: string;
  accessToken: string;
}
export async function closeAccountApi({
  userId,
  accessToken,
}: CloseAccountArgs) {
  return createServerAuthApiFetch(accessToken)(
    AUTH_API_ROUTES.closeAccount(userId),
    { method: "DELETE" },
  );
}

function createServerAuthApiFetch(accessToken?: string) {
  return createAuthApiFetch({
    baseUrl: AUTH_API_BACKEND_BASE_URL,
    defaultHeaders: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}
