import type { ReactNode } from "react";
import { MAIN_CONTENT_ID } from "@/shared/constants";
import Features from "./Features";
import Hero from "./Hero";

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
