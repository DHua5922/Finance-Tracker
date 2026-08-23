import { describe, expect, it } from "vitest";
import { parseFetchErrorMessage, throwIfResponseFailed } from "./api";

describe("parseFetchErrorMessage", () => {
  it("returns the message from a JSON response", async () => {
    const errorMessage = "Email already exists";
    const response = Response.json({ message: errorMessage });

    await expect(parseFetchErrorMessage(response)).resolves.toBe(errorMessage);
  });

  it("returns a plain-text response", async () => {
    const errorMessage = "Invalid credentials";
    const response = new Response(errorMessage);

    await expect(parseFetchErrorMessage(response)).resolves.toBe(errorMessage);
  });

  it("returns the default fallback for an empty response", async () => {
    const response = new Response("");

    await expect(parseFetchErrorMessage(response)).resolves.toBe(
      "Request failed",
    );
  });

  it("returns the response body when JSON has no message property", async () => {
    const response = Response.json({ error: "Bad request" });

    await expect(parseFetchErrorMessage(response)).resolves.toBe(
      '{"error":"Bad request"}',
    );
  });

  it("returns a custom fallback for an empty response", async () => {
    const errorMessage = "Unable to complete request";
    const response = new Response("");

    await expect(parseFetchErrorMessage(response, errorMessage)).resolves.toBe(
      errorMessage,
    );
  });
});

describe("throwIfResponseFailed", () => {
  it("resolves without throwing for a successful response", async () => {
    const response = Response.json({ data: "ok" }, { status: 200 });

    await expect(throwIfResponseFailed(response)).resolves.toBeUndefined();
  });

  it("throws the JSON error message for an unsuccessful response", async () => {
    const response = Response.json(
      { message: "Email already exists" },
      { status: 400 },
    );

    await expect(throwIfResponseFailed(response)).rejects.toThrow(
      "Email already exists",
    );
  });

  it("throws the response text for an unsuccessful response", async () => {
    const response = new Response("Invalid credentials", { status: 401 });

    await expect(throwIfResponseFailed(response)).rejects.toThrow(
      "Invalid credentials",
    );
  });
});
