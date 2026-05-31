import { data } from "react-router";

import type { Route } from "./+types/auth.passkey.signup";
import {
  createUserSession,
  sessionStorage,
} from "~/features/auth/application/auth-session.server";
import {
  generatePasskeyRegistrationOptions,
  verifyPasskeyRegistration,
} from "~/features/auth/application/passkeys.server";
import {
  VERIFICATION_EXPIRY_MINUTES,
  VERIFICATION_TYPE_EMAIL,
} from "~/features/auth/domain/auth-constants";
import {
  buildMagicLinkUrl,
  computeVerificationExpiry,
} from "~/features/auth/domain/auth-domain";
import { sendVerificationEmail } from "~/features/auth/infrastructure/email.server";
import { generateVerificationTOTP } from "~/features/auth/infrastructure/totp.server";
import { saveVerificationToDatabase } from "~/features/auth/infrastructure/verifications-model.server";
import { validateEmail } from "~/features/users/domain/users-domain";
import {
  retrieveUserFromDatabaseByEmail,
  saveUserToDatabase,
} from "~/features/users/infrastructure/users-model.server";

const PASSKEY_SIGNUP_CHALLENGE_KEY = "passkeySignupChallenge";
const PASSKEY_SIGNUP_EMAIL_KEY = "passkeySignupEmail";
const DUPLICATE_EMAIL_ERROR =
  "An account already exists for this email. Log in instead.";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const email = validateEmail(url.searchParams.get("email") ?? "");

  if (!email.success) return data({ error: email.error }, { status: 400 });

  const existingUser = await retrieveUserFromDatabaseByEmail(email.data);
  if (existingUser)
    return data({ error: DUPLICATE_EMAIL_ERROR }, { status: 409 });

  const options = await generatePasskeyRegistrationOptions({
    request,
    userEmail: email.data,
    userId: email.data,
  });
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  session.set(PASSKEY_SIGNUP_CHALLENGE_KEY, options.challenge);
  session.set(PASSKEY_SIGNUP_EMAIL_KEY, email.data);

  return data(options, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export async function action({ request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const expectedChallenge = session.get(PASSKEY_SIGNUP_CHALLENGE_KEY);
  const expectedEmail = session.get(PASSKEY_SIGNUP_EMAIL_KEY);
  if (
    typeof expectedChallenge !== "string" ||
    typeof expectedEmail !== "string"
  ) {
    return data({ error: "CHALLENGE_MISSING" }, { status: 400 });
  }

  const { credential } = await request.json();

  const user = await saveUserToDatabase({
    email: expectedEmail,
    emailVerifiedAt: null,
  });
  const verified = await verifyPasskeyRegistration({
    expectedChallenge,
    request,
    response: credential,
    userId: user.id,
  });

  if (!verified) return data({ error: "INVALID_PASSKEY" }, { status: 401 });

  const { algorithm, charSet, digits, otp, period, secret } =
    await generateVerificationTOTP();
  await saveVerificationToDatabase({
    algorithm,
    charSet,
    digits,
    expiresAt: computeVerificationExpiry(VERIFICATION_EXPIRY_MINUTES),
    period,
    secret,
    target: expectedEmail,
    type: VERIFICATION_TYPE_EMAIL,
  });

  const verificationUrl = buildMagicLinkUrl({
    baseUrl: new URL(request.url).origin,
    code: otp,
    target: expectedEmail,
    type: VERIFICATION_TYPE_EMAIL,
  });

  await sendVerificationEmail({
    code: otp,
    email: expectedEmail,
    verificationUrl,
  });

  session.unset(PASSKEY_SIGNUP_CHALLENGE_KEY);
  session.unset(PASSKEY_SIGNUP_EMAIL_KEY);

  const headers = new Headers();
  headers.append("Set-Cookie", await createUserSession(user.id));
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));

  return data({ success: true }, { headers });
}
