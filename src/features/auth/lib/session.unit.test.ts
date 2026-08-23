import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserSessionStatus } from "./session";

const { cookieValues, validateAccessTokenApi } = vi.hoisted(() => ({
  cookieValues: new Map<string, string>(),
  validateAccessTokenApi: vi.fn(),
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

vi.mock("./api", () => ({
  validateAccessTokenApi,
}));

beforeEach(() => {
  cookieValues.clear();
  validateAccessTokenApi.mockReset();
});

describe("getUserSessionStatus", () => {
  it("should return authenticated when the access token is valid", async () => {
    cookieValues.set("accessToken", "valid-access-token");
    validateAccessTokenApi.mockResolvedValue({ _id: "user-1" });

    await expect(getUserSessionStatus()).resolves.toBe("authenticated");
    expect(validateAccessTokenApi).toHaveBeenCalledWith("valid-access-token");
  });

  it("should require a refresh when access-token validation fails", async () => {
    cookieValues.set("accessToken", "expired-access-token");
    cookieValues.set("refreshToken", "valid-refresh-token");
    validateAccessTokenApi.mockRejectedValue(new Error("Token expired"));

    await expect(getUserSessionStatus()).resolves.toBe("refresh-required");
  });

  it("should require a refresh when only a refresh token exists", async () => {
    cookieValues.set("refreshToken", "valid-refresh-token");

    await expect(getUserSessionStatus()).resolves.toBe("refresh-required");
    expect(validateAccessTokenApi).not.toHaveBeenCalled();
  });

  it("should return unauthenticated when no usable tokens exist", async () => {
    cookieValues.set("accessToken", "invalid-access-token");
    validateAccessTokenApi.mockRejectedValue(new Error("Invalid token"));

    await expect(getUserSessionStatus()).resolves.toBe("unauthenticated");
  });
});
