"use client";

import { useState } from "react";
import Hero from "@/features/landing/components/Hero";
import Features from "@/features/landing/components/Features";
import AuthModal from "@/features/auth/components/AuthModal";
import PublicHeader from "@/app/components/PublicHeader";

type AuthMode = "login" | "register";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const isLogin = authMode === "login";

  const onClickGetStarted = () => {
    setAuthMode("login");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <PublicHeader onClickGetStarted={onClickGetStarted} />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
        <Hero onClick={onClickGetStarted} />
        <Features />
      </main>

      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        isLogin={isLogin}
        setAuthMode={setAuthMode}
      />
    </div>
  );
}
