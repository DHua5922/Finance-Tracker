import PublicHeader from "@/app/_components/header/PublicHeader";
import Features from "@/features/landing/components/Features";
import Hero from "@/features/landing/components/Hero";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility";

interface Props {
  showLogin?: boolean;
}

export default function LandingPageShell({ showLogin = false }: Props) {
  return (
    <>
      <PublicHeader showLogin={showLogin} />

      <main
        id={MAIN_CONTENT_ID}
        className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16"
      >
        <Hero />
        <Features />
      </main>
    </>
  );
}
