import PublicHeader from "@/app/_components/PublicHeader";
import Hero from "@/features/landing/components/Hero";
import Features from "@/features/landing/components/Features";

export default function LandingPageShell() {
  return (
    <>
      <PublicHeader />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
        <Hero />
        <Features />
      </main>
    </>
  );
}
