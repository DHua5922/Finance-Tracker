import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { expect, it, vi } from "vitest";
import LogoutButton from "@/app/_components/LogoutButton";

const { deleteCookie } = vi.hoisted(() => ({ deleteCookie: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ delete: deleteCookie }),
}));

it("should clear the session and redirect home", async () => {
  const user = userEvent.setup();

  render(<LogoutButton placement="desktop-header" />);

  await user.click(screen.getByRole("button", { name: "Log out" }));

  await waitFor(() => {
    expect(redirect).toHaveBeenCalledWith("/");
  });
  expect(deleteCookie).toHaveBeenCalledWith("accessToken");
  expect(deleteCookie).toHaveBeenCalledWith("refreshToken");
});
