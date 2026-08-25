import { NextRequest } from "next/server";
import { expect, test, vi } from "vitest";
import { refreshTokensApi } from "@/features/auth/lib/api/auth.api";
import { getMeApi } from "@/shared/api/user.api";
import { GET } from "./route";

vi.mock("@/features/auth/lib/api/auth.api", () => ({
  refreshTokensApi: vi.fn(),
}));
vi.mock("@/shared/api/user.api", () => ({ getMeApi: vi.fn() }));

const refreshedTokens = {
  accessToken: "new-access-token",
  refreshToken: "new-refresh-token",
  accessTokenExpireTime: "1m",
  refreshTokenExpireTime: "7d",
};

test("should replace both token cookies after a successful refresh", async () => {
  vi.mocked(refreshTokensApi).mockResolvedValue(refreshedTokens);
  vi.mocked(getMeApi).mockResolvedValue({
    _id: "user-1",
    username: "Jane",
    email: "jane@example.com",
  });

  const request = new NextRequest(
    "http://localhost:3000/api/auth/refresh?returnTo=/transaction",
    {
      headers: {
        cookie: "accessToken=old-access-token; refreshToken=old-refresh-token",
      },
    },
  );

  const response = await GET(request);

  expect(refreshTokensApi).toHaveBeenCalledWith("old-refresh-token");
  expect(getMeApi).toHaveBeenCalledWith(refreshedTokens.accessToken);
  expect(response.headers.get("location")).toBe(
    "http://localhost:3000/transaction",
  );
  expect(response.cookies.get("accessToken")).toMatchObject({
    value: refreshedTokens.accessToken,
    httpOnly: true,
    path: "/",
    maxAge: 60,
  });
  expect(response.cookies.get("refreshToken")).toMatchObject({
    value: refreshedTokens.refreshToken,
    httpOnly: true,
    path: "/",
    maxAge: 604_800,
  });
});
