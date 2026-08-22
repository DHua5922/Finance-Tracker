import { describe, expect, test } from "vitest";
import convertTimeToMaxAge from "./convertTimeToMaxAge";

describe("convertTimeToMaxAge", () => {
  test("should convert minutes to seconds", () => {
    expect(convertTimeToMaxAge("5m")).toBe(300);
  });

  test("should convert hours to seconds", () => {
    expect(convertTimeToMaxAge("2h")).toBe(7200);
  });

  test("should convert days to seconds", () => {
    expect(convertTimeToMaxAge("3d")).toBe(259200);
  });

  test("should return undefined for invalid format", () => {
    expect(convertTimeToMaxAge("invalid")).toBeUndefined();
    expect(convertTimeToMaxAge("5x")).toBeUndefined();
    expect(convertTimeToMaxAge("5")).toBeUndefined();
  });
});
