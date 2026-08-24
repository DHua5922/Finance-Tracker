import { type NextRequest, NextResponse } from "next/server";
import {
  refreshTokensApi,
  validateAccessTokenApi,
} from "@/features/auth/lib/api";
import {
  accessTokenName,
  createUserSessionCookies,
  refreshTokenName,
} from "@/features/auth/lib/session";

const allowedReturnPaths = new Set(["/dashboard", "/transaction"]);

export async function GET(request: NextRequest) {
  const requestedReturnPath = request.nextUrl.searchParams.get("returnTo");
  const returnPath =
    requestedReturnPath && allowedReturnPaths.has(requestedReturnPath)
      ? requestedReturnPath
      : "/dashboard";
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      const refreshedTokens = await refreshTokensApi(refreshToken);
      await validateAccessTokenApi(refreshedTokens.accessToken);
      const response = NextResponse.redirect(new URL(returnPath, request.url));

      for (const sessionCookie of createUserSessionCookies(refreshedTokens)) {
        response.cookies.set(sessionCookie);
      }

      return response;
    } catch {}
  }

  const response = NextResponse.redirect(new URL("/?login=1", request.url));
  response.cookies.delete(accessTokenName);
  response.cookies.delete(refreshTokenName);
  return response;
}
