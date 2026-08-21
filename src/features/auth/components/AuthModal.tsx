import { Modal as DefaultModal } from "@dhua5922/react-kit";
import type { ComponentProps } from "react";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { cn } from "@/shared/utilities/css";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface Props extends ComponentProps<typeof Modal> {
  isLogin: boolean;
  setAuthMode: (mode: "login" | "register") => void;
}

export default function AuthModal({ isLogin, setAuthMode, ...props }: Props) {
  return (
    <Modal
      className="w-[min(92vw,28rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
      {...props}
      headerChildren={<Header isLogin={isLogin} />}
      footerChildren={<Footer isLogin={isLogin} setAuthMode={setAuthMode} />}
    >
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition",
            isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-600",
          )}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setAuthMode("register")}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition",
            !isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-600",
          )}
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
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {isLogin ? "welcome back" : "create account"}
      </p>

      <DefaultModal.Title className="mt-2 text-2xl font-semibold text-slate-900">
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
  return (
    <>
      <p className="text-sm text-slate-500">
        {isLogin ? "Need an account?" : "Already have an account?"}
      </p>
      <Button
        type="button"
        className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-700"
        onClick={() => setAuthMode(isLogin ? "register" : "login")}
      >
        {isLogin ? "Sign up" : "Log in"}
      </Button>
    </>
  );
}
