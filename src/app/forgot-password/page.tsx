import Link from "next/link";
import PublicHeader from "@/app/_components/header/PublicHeader";
import RequestPasswordResetForm from "@/features/auth/components/RequestPasswordResetForm";
import { MAIN_CONTENT_ID } from "@/shared/constants";

export default function ForgotPasswordPage() {
  return (
    <>
      <PublicHeader />

      <main
        id={MAIN_CONTENT_ID}
        className="mx-auto w-full max-w-md flex-1 px-6 py-16"
      >
        <h1 className="text-3xl font-bold text-foreground">Forgot password</h1>

        <p className="mt-3 text-muted-foreground">
          Enter your email and we will send you a password reset link.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-300 bg-white p-6 text-slate-950 shadow-sm">
          <RequestPasswordResetForm />
        </div>

        <Link
          href="/?login=1"
          className="mt-6 inline-block text-sm text-accent-foreground underline"
        >
          Back to login
        </Link>
      </main>
    </>
  );
}
