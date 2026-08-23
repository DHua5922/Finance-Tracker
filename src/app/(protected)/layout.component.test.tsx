import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { expect, type Mock, test, vi } from "vitest";
import { getUserSessionStatus } from "@/features/auth/lib/session";
import ProtectedLayout from "./layout";

vi.mock("@/features/auth/lib/session", () => ({
  getUserSessionStatus: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

test("renders protected content when the user is authenticated", async () => {
  const userSessionStatusMock = getUserSessionStatus as Mock;
  userSessionStatusMock.mockResolvedValue("authenticated");

  render(await ProtectedLayout({ children: <h1>Dashboard</h1> }));

  expect(
    screen.getByRole("heading", { name: "Dashboard" }),
  ).toBeInTheDocument();
  expect(redirect).not.toHaveBeenCalled();
});

test("redirects when the user is unauthenticated", async () => {
  const userSessionStatusMock = getUserSessionStatus as Mock;
  userSessionStatusMock.mockResolvedValue("unauthenticated");

  await ProtectedLayout({ children: <h1>Dashboard</h1> });

  expect(
    screen.queryByRole("heading", { name: "Dashboard" }),
  ).not.toBeInTheDocument();
  expect(redirect).toHaveBeenCalled();
});
