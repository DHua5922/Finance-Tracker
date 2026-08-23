import { cookies } from "next/headers";
import type { z } from "zod";
import type { tokensSchema } from "../schemas";
import convertTimeToMaxAge from "../utilities/cookie";
import { validateAccessTokenApi } from "./api";

const accessTokenName = "accessToken";
const refreshTokenName = "refreshToken";

type UserSessionStatus =
  | "authenticated"
  | "refresh-required"
  | "unauthenticated";

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

type Tokens = z.infer<typeof tokensSchema>;
export async function setUserSession({
  accessToken,
  refreshToken,
  accessTokenExpireTime,
  refreshTokenExpireTime,
}: Tokens) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: accessTokenName,
    value: accessToken,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: convertTimeToMaxAge(accessTokenExpireTime),
  });

  cookieStore.set({
    name: refreshTokenName,
    value: refreshToken,
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: convertTimeToMaxAge(refreshTokenExpireTime),
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(accessTokenName);
  cookieStore.delete(refreshTokenName);
}
