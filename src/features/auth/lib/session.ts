import { cookies } from "next/headers";
import type { z } from "zod";
import type { tokensSchema } from "../schemas";
import convertTimeToMaxAge from "../utilities/cookie";
import { validateAccessTokenApi } from "./api";

export const accessTokenName = "accessToken";
export const refreshTokenName = "refreshToken";

type UserSessionStatus =
  | "authenticated"
  | "refresh-required"
  | "unauthenticated";

type Tokens = z.infer<typeof tokensSchema>;

export async function getAuthenticatedUser() {
  const accessToken = (await cookies()).get(accessTokenName)?.value;
  if (!accessToken) return null;

  try {
    return await validateAccessTokenApi(accessToken);
  } catch {
    return null;
  }
}

export async function getUserSessionStatus(): Promise<UserSessionStatus> {
  const cookieStore = await cookies();
  if (await getAuthenticatedUser()) return "authenticated";

  return cookieStore.has(refreshTokenName)
    ? "refresh-required"
    : "unauthenticated";
}

export async function setUserSession(tokens: Tokens) {
  const cookieStore = await cookies();

  for (const sessionCookie of createUserSessionCookies(tokens))
    cookieStore.set(sessionCookie);
}

export function createUserSessionCookies({
  accessToken,
  refreshToken,
  accessTokenExpireTime,
  refreshTokenExpireTime,
}: Tokens) {
  const secure = process.env.NODE_ENV === "production";

  return [
    {
      name: accessTokenName,
      value: accessToken,
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: convertTimeToMaxAge(accessTokenExpireTime),
    },
    {
      name: refreshTokenName,
      value: refreshToken,
      httpOnly: true,
      secure,
      sameSite: "strict" as const,
      path: "/",
      maxAge: convertTimeToMaxAge(refreshTokenExpireTime),
    },
  ];
}
