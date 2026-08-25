import { Resend } from "resend";
import { z } from "zod";

const passwordResetEmailEnvironmentSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  APP_BASE_URL: z.url(),
});

export async function sendPasswordResetEmail(
  email: string,
  accessToken: string,
  accessTokenExpireTime: string,
) {
  const environment = passwordResetEmailEnvironmentSchema.parse(process.env);
  const resetUrl = new URL("/reset-password", environment.APP_BASE_URL);
  resetUrl.searchParams.set("token", accessToken);

  const { error } = await new Resend(environment.RESEND_API_KEY).emails.send({
    from: "FinanceFlow <onboarding@resend.dev>",
    to: email,
    subject: "Reset your FinanceFlow password",
    html: `<p>Use the link below to reset your FinanceFlow password.</p><p><a href="${resetUrl.toString()}">Reset password</a></p><p>This link will expire in ${formatExpirationTime(accessTokenExpireTime)}.</p><p>If you did not request this, you can ignore this email.</p>`,
  });

  if (error) throw new Error(error.message);
}

function formatExpirationTime(expirationTime: string) {
  const value = Number.parseInt(expirationTime, 10);
  const unit = expirationTime.at(-1);
  const unitName = unit === "m" ? "minute" : unit === "h" ? "hour" : "day";

  return `${value} ${unitName}${value === 1 ? "" : "s"}`;
}
