import { type NextRequest, NextResponse } from "next/server";
import {
  refreshTokensApi,
  validateAccessTokenApi,
} from "@/features/auth/lib/api";
import { clearUserSession, setUserSession } from "@/features/auth/lib/session";

const allowedReturnPaths = new Set(["/dashboard", "/expense", "/income"]);

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
      await setUserSession(refreshedTokens);
      return NextResponse.redirect(new URL(returnPath, request.url));
    } catch {}
  }

  await clearUserSession();
  return NextResponse.redirect(new URL("/?login=1", request.url));
}
