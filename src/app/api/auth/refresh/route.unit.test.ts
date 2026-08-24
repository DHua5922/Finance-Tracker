import { NextRequest } from "next/server";
import { expect, test, vi } from "vitest";
import {
  refreshTokensApi,
  validateAccessTokenApi,
} from "@/features/auth/lib/api";
import { GET } from "./route";

vi.mock("@/features/auth/lib/api", () => ({
  refreshTokensApi: vi.fn(),
  validateAccessTokenApi: vi.fn(),
}));

const createUnexpiredToken = () =>
  `header.${Buffer.from(JSON.stringify({ exp: 4_000_000_000 })).toString(
    "base64url",
  )}.signature`;

const refreshedTokens = {
  accessToken: createUnexpiredToken(),
  refreshToken: createUnexpiredToken(),
};

test("should replace both token cookies after a successful refresh", async () => {
  vi.mocked(refreshTokensApi).mockResolvedValue(refreshedTokens);
  vi.mocked(validateAccessTokenApi).mockResolvedValue({
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
  expect(validateAccessTokenApi).toHaveBeenCalledWith(
    refreshedTokens.accessToken,
  );
  expect(response.headers.get("location")).toBe(
    "http://localhost:3000/transaction",
  );
  expect(response.cookies.get("accessToken")).toMatchObject({
    value: refreshedTokens.accessToken,
    httpOnly: true,
    path: "/",
  });
  expect(response.cookies.get("refreshToken")).toMatchObject({
    value: refreshedTokens.refreshToken,
    httpOnly: true,
    path: "/",
  });
});
