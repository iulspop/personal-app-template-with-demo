import { createId } from "@paralleldrive/cuid2";
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
import { saveUserToDatabase } from "~/features/users/infrastructure/users-model.server";

const PASSKEY_SIGNUP_CHALLENGE_KEY = "passkeySignupChallenge";
const PASSKEY_SIGNUP_EMAIL_KEY = "passkeySignupEmail";
const createPasskeyOnlyEmail = (id = createId()) => `${id}@passkey.local`;

export async function loader({ request }: Route.LoaderArgs) {
  const email = createPasskeyOnlyEmail();
  const options = await generatePasskeyRegistrationOptions({
    request,
    userEmail: email,
    userId: email,
  });
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  session.set(PASSKEY_SIGNUP_CHALLENGE_KEY, options.challenge);
  session.set(PASSKEY_SIGNUP_EMAIL_KEY, email);

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

  const user = await saveUserToDatabase({ email: expectedEmail });
  const verified = await verifyPasskeyRegistration({
    expectedChallenge,
    request,
    response: credential,
    userId: user.id,
  });

  if (!verified) return data({ error: "INVALID_PASSKEY" }, { status: 401 });

  session.unset(PASSKEY_SIGNUP_CHALLENGE_KEY);
  session.unset(PASSKEY_SIGNUP_EMAIL_KEY);

  const headers = new Headers();
  headers.append("Set-Cookie", await createUserSession(user.id));
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));

  return data({ success: true }, { headers });
}
