import { describe, expect, it } from "vitest";
import { parseDatabaseErrorMessage } from "./database";

describe("parseDatabaseErrorMessage", () => {
  it("returns the default fallback for an empty response", () => {
    const defaultMessage = "Database request failed";
    expect(parseDatabaseErrorMessage(undefined, defaultMessage)).toBe(
      defaultMessage,
    );
  });

  it("returns the response body when JSON has no message property", () => {
    const errorMessage = "Could not get data";
    const error = new Error(errorMessage);

    expect(parseDatabaseErrorMessage(error)).toBe(errorMessage);
  });
});
