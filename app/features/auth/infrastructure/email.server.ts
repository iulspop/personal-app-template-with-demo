import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type MagicLinkEmailParams = {
  code: string;
  email: string;
  magicLinkUrl: string;
};

export const logMagicLinkEmail = ({
  code,
  email,
  magicLinkUrl,
}: MagicLinkEmailParams) => {
  console.log(`[Auth] Magic link for ${email}:`);
  console.log(`  Code: ${code}`);
  console.log(`  Link: ${magicLinkUrl}`);
};

/**
 * Sends a magic-link email with a 6-digit code.
 * Logs the code in development and falls back to console.log when RESEND_API_KEY is not set.
 *
 * @param params - The email recipient, code, and magic link URL.
 */
export async function sendMagicLinkEmail(params: MagicLinkEmailParams) {
  if (process.env.NODE_ENV === "development") logMagicLinkEmail(params);

  if (!resend) {
    if (process.env.NODE_ENV !== "development") logMagicLinkEmail(params);
    return;
  }

  const { code, email, magicLinkUrl } = params;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@example.com",
    html: `<p>Your login code is: <strong>${code}</strong></p><p>Or click this link: <a href="${magicLinkUrl}">${magicLinkUrl}</a></p>`,
    subject: "Your login code",
    to: email,
  });
}
