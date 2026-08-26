import Link from "next/link";
import PublicHeader from "@/app/_components/header/PublicHeader";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import { MAIN_CONTENT_ID } from "@/shared/constants";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const token = (await searchParams).token ?? "";

  return (
    <>
      <PublicHeader />

      <main
        id={MAIN_CONTENT_ID}
        className="mx-auto w-full max-w-md flex-1 px-6 py-16"
      >
        <h1 className="text-3xl font-bold text-foreground">Reset password</h1>

        <p className="mt-3 text-muted-foreground">
          Choose a new password for your account.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-300 bg-white p-6 text-slate-950 shadow-sm">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p role="alert">This password reset link is invalid.</p>
          )}
        </div>

        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm text-accent-foreground underline"
        >
          Request another link
        </Link>
      </main>
    </>
  );
}
