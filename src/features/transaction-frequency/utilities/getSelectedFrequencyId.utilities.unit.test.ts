import { describe, expect, test } from "vitest";
import type { TransactionFrequency } from "../dal/trx-frequency.dal";
import { getSelectedFrequencyId } from "./getSelectedFrequencyId.utilities";

const frequencies: TransactionFrequency[] = [
  {
    id: 2,
    name: "Weekly",
    description: "One week",
    toMonthlyMultiplier: 4.33,
  },
  {
    id: 3,
    name: "Monthly",
    description: "One month",
    toMonthlyMultiplier: 1,
  },
];

describe("getSelectedFrequencyId", () => {
  test("should return the requested frequency when it exists", () => {
    expect(getSelectedFrequencyId(frequencies, "3")).toBe(3);
  });

  test("should return the first frequency when no ID is requested", () => {
    expect(getSelectedFrequencyId(frequencies)).toBe(2);
  });

  test("should return the first frequency when the requested ID does not exist", () => {
    expect(getSelectedFrequencyId(frequencies, "99")).toBe(2);
  });

  test("should return the default ID when no frequencies are available", () => {
    expect(getSelectedFrequencyId([], "3")).toBe(1);
  });
});
