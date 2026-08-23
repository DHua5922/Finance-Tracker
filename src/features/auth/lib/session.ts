import { cookies } from "next/headers";
import type { z } from "zod";
import type { authSessionSchema } from "../schemas";
import convertTimeToMaxAge from "../utilities/cookie";

type UserSession = z.infer<typeof authSessionSchema>;

export async function setUserSession({
  accessToken,
  refreshToken,
  accessTokenExpireTime,
  refreshTokenExpireTime,
}: UserSession) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: convertTimeToMaxAge(accessTokenExpireTime),
  });

  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: convertTimeToMaxAge(refreshTokenExpireTime),
  });
}
