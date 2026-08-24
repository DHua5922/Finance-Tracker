import { z } from "zod";
import {
  type logInUserFormDataSchema,
  type signUpUserFormDataSchema,
  tokensSchema,
} from "@/features/auth/schemas";
import { throwIfResponseFailed } from "@/shared/utilities/api";
import { createAuthApiFetch } from "./config";
import { AUTH_API_BACKEND_BASE_URL, AUTH_API_ROUTES } from "./constants";

type LoginInput = z.infer<typeof logInUserFormDataSchema>;
type SignUpUserInput = z.infer<typeof signUpUserFormDataSchema>;

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

export async function validateAccessTokenApi(accessToken: string) {
  const response = await createServerAuthApiFetch(accessToken)(
    AUTH_API_ROUTES.secure,
    { method: "POST" },
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
