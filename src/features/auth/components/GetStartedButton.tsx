"use client";

import { useState } from "react";
import AuthModal from "@/features/auth/components/AuthModal";
import { Button } from "@/shared/components";
import { cn } from "@/shared/utilities";

interface Props {
  className?: string;
  initiallyOpen?: boolean;
  label?: string;
  variant?: "primary" | "secondary";
}

export default function GetStartedButton({
  className,
  initiallyOpen = false,
  label = "Get started",
  variant = "primary",
}: Props) {
  const [modalOpen, setModalOpen] = useState(initiallyOpen);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const buttonClassName = cn(
    variant === "primary"
      ? "rounded-full bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300"
      : "rounded-full border border-white/15 bg-white/5 px-5 text-white hover:bg-white/10",
    className,
  );

  const onClick = () => {
    setAuthMode("login");
    setModalOpen(true);
  };

  return (
    <>
      <Button type="button" className={buttonClassName} onClick={onClick}>
        {label}
      </Button>

      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        isLogin={authMode === "login"}
        setAuthMode={setAuthMode}
      />
    </>
  );
}
