import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import AuthModal from "./AuthModal";

it("renders login mode and switches from the top tab", async () => {
  const user = userEvent.setup();
  const { container } = render(<AuthModalSample />);

  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  expect(screen.getByText("Log in to FinanceFlow")).toBeInTheDocument();
  await expectNoA11yViolations(container);

  await user.click(screen.getAllByRole("button", { name: "Sign up" })[0]);

  expect(screen.getByText("Create your account")).toBeInTheDocument();
});

it("switches mode from footer action button", async () => {
  const user = userEvent.setup();

  render(<AuthModalSample />);

  await user.click(screen.getAllByRole("button", { name: "Sign up" })[1]);
  expect(screen.getByText("Create your account")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByText("Log in to FinanceFlow")).toBeInTheDocument();
});

function AuthModalSample() {
  const [isLogin, setAuthMode] = useState<"login" | "register">("login");

  return (
    <AuthModal
      open
      onOpenChange={() => {}}
      isLogin={isLogin === "login"}
      setAuthMode={setAuthMode}
    />
  );
}
