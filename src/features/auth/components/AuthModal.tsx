import { Modal as DefaultModal } from "@dhua5922/react-kit";
import type { ComponentProps } from "react";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { cn } from "@/shared/utilities/css.utilities";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface Props extends ComponentProps<typeof Modal> {
  isLogin: boolean;
  setAuthMode: (mode: "login" | "register") => void;
}

export default function AuthModal({ isLogin, setAuthMode, ...props }: Props) {
  const loginButtonClassName = cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isLogin
      ? "bg-surface text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

  const signUpButtonClassName = cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    !isLogin
      ? "bg-surface text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

  return (
    <Modal
      {...props}
      headerChildren={<Header isLogin={isLogin} />}
      footerChildren={<Footer isLogin={isLogin} setAuthMode={setAuthMode} />}
    >
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={loginButtonClassName}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setAuthMode("register")}
          className={signUpButtonClassName}
        >
          Sign up
        </button>
      </div>

      {isLogin ? <LoginForm /> : <SignUpForm />}
    </Modal>
  );
}

function Header({ isLogin }: { isLogin: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {isLogin ? "welcome back" : "create account"}
      </p>

      <DefaultModal.Title className="mt-2 text-2xl font-semibold text-foreground">
        {isLogin ? "Log in to FinanceFlow" : "Create your account"}
      </DefaultModal.Title>
    </div>
  );
}

function Footer({
  isLogin,
  setAuthMode,
}: {
  isLogin: boolean;
  setAuthMode: (mode: "login" | "register") => void;
}) {
  const onClick = () => setAuthMode(isLogin ? "register" : "login");

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {isLogin ? "Need an account?" : "Already have an account?"}
      </p>

      <Button
        type="button"
        className="rounded-full bg-foreground px-5 text-background hover:bg-foreground/80"
        onClick={onClick}
      >
        {isLogin ? "Sign up" : "Log in"}
      </Button>
    </>
  );
}
