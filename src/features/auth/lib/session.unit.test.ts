import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMeApi } from "./api/auth.api";
import { getUserSessionStatus, requireAuthenticatedUser } from "./session";

const { cookieValues } = vi.hoisted(() => ({
  cookieValues: new Map<string, string>(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieValues.get(name);
      return value ? { name, value } : undefined;
    },
    has: (name: string) => cookieValues.has(name),
  }),
}));

vi.mock("./api/auth.api");

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

beforeEach(() => {
  cookieValues.clear();
});

describe("getUserSessionStatus", () => {
  it("should return authenticated when the access token is valid", async () => {
    cookieValues.set("accessToken", "valid-access-token");
    vi.mocked(getMeApi).mockResolvedValue({
      _id: "user-1",
      username: "Jane",
      email: "jane@example.com",
    });

    await expect(getUserSessionStatus()).resolves.toBe("authenticated");
    expect(getMeApi).toHaveBeenCalledWith("valid-access-token");
  });

  it("should require a refresh when access-token validation fails", async () => {
    cookieValues.set("accessToken", "expired-access-token");
    cookieValues.set("refreshToken", "valid-refresh-token");
    vi.mocked(getMeApi).mockRejectedValue(new Error("Token expired"));

    await expect(getUserSessionStatus()).resolves.toBe("refresh-required");
  });

  it("should require a refresh when only a refresh token exists", async () => {
    cookieValues.set("refreshToken", "valid-refresh-token");

    await expect(getUserSessionStatus()).resolves.toBe("refresh-required");
    expect(getMeApi).not.toHaveBeenCalled();
  });

  it("should return unauthenticated when no usable tokens exist", async () => {
    cookieValues.set("accessToken", "invalid-access-token");
    vi.mocked(getMeApi).mockRejectedValue(new Error("Invalid token"));

    await expect(getUserSessionStatus()).resolves.toBe("unauthenticated");
  });
});

describe("requireAuthenticatedUser", () => {
  it("should return the authenticated user", async () => {
    const user = {
      _id: "user-1",
      username: "Jane",
      email: "jane@example.com",
    };
    cookieValues.set("accessToken", "valid-access-token");
    vi.mocked(getMeApi).mockResolvedValue(user);

    await expect(requireAuthenticatedUser("/dashboard")).resolves.toBe(user);
  });

  it("should start refresh and preserve the requested page", async () => {
    await requireAuthenticatedUser("/transaction");

    expect(redirect).toHaveBeenCalledWith(
      "/api/auth/refresh?returnTo=%2Ftransaction",
    );
  });
});
