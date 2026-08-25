import type { ReactNode } from "react";
import Features from "@/features/landing/components/Features";
import Hero from "@/features/landing/components/Hero";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility.constants";

interface Props {
  primaryAction: ReactNode;
}

export default function LandingPageShell({ primaryAction }: Props) {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16"
    >
      <Hero primaryAction={primaryAction} />
      <Features />
    </main>
  );
}
