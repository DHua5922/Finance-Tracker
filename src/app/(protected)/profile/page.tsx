import type { Metadata } from "next";
import CloseAccount from "@/features/profile/components/CloseAccount";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { requireAuthenticatedUser } from "@/shared/session";

export const metadata: Metadata = {
  title: "Profile | FinanceFlow",
};

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser("/profile");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          View and update the details associated with your account.
        </p>
      </header>

      <section
        aria-labelledby="account-details-heading"
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 id="account-details-heading" className="text-xl font-semibold">
          Account details
        </h2>
        <ProfileForm username={user.username} email={user.email} />
      </section>

      <section
        aria-labelledby="close-account-heading"
        className="rounded-2xl border border-red-500/40 bg-surface p-6"
      >
        <h2 id="close-account-heading" className="text-xl font-semibold">
          Close account
        </h2>
        <p className="my-3 text-muted-foreground">
          Closing your account permanently removes it. This action cannot be
          undone.
        </p>
        <CloseAccount />
      </section>
    </div>
  );
}
