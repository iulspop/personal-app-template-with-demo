import { createCookieSessionStorage } from "react-router";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { action, loader } from "./auth.passkey.signup";
import {
  createUserSession,
  sessionStorage,
} from "~/features/auth/application/auth-session.server";
import {
  generatePasskeyRegistrationOptions,
  verifyPasskeyRegistration,
} from "~/features/auth/application/passkeys.server";
import { sendVerificationEmail } from "~/features/auth/infrastructure/email.server";
import { generateVerificationTOTP } from "~/features/auth/infrastructure/totp.server";
import { saveVerificationToDatabase } from "~/features/auth/infrastructure/verifications-model.server";
import {
  retrieveUserFromDatabaseByEmail,
  saveUserToDatabase,
} from "~/features/users/infrastructure/users-model.server";

vi.mock("~/features/auth/application/auth-session.server", () => {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "__session",
      path: "/",
      secrets: ["test-secret"],
    },
  });

  return {
    createUserSession: vi.fn(() => "__session=user-session; Path=/; HttpOnly"),
    sessionStorage,
  };
});

vi.mock("~/features/auth/application/passkeys.server", () => ({
  generatePasskeyRegistrationOptions: vi.fn(() => ({
    challenge: "challenge",
  })),
  verifyPasskeyRegistration: vi.fn(() => true),
}));

vi.mock("~/features/auth/infrastructure/email.server", () => ({
  sendVerificationEmail: vi.fn(),
}));

vi.mock("~/features/auth/infrastructure/totp.server", () => ({
  generateVerificationTOTP: vi.fn(() => ({
    algorithm: "SHA-1",
    charSet: "ABC123",
    digits: 6,
    otp: "123456",
    period: 600,
    secret: "secret",
  })),
}));

vi.mock("~/features/auth/infrastructure/verifications-model.server", () => ({
  saveVerificationToDatabase: vi.fn(),
}));

vi.mock("~/features/users/infrastructure/users-model.server", () => ({
  retrieveUserFromDatabaseByEmail: vi.fn(() => null),
  saveUserToDatabase: vi.fn(() => ({ id: "user-id" })),
}));

const createRouteArgs = (request: Request) => ({
  context: {} as never,
  params: {},
  pattern: "/auth/passkey/signup",
  request,
  url: new URL(request.url),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(new Date("2026-05-31T00:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("auth.passkey.signup loader", () => {
  test("given: an email address, should: generate passkey registration options for that email", async () => {
    const request = new Request(
      "https://example.com/auth/passkey/signup?email=user%40example.com",
    );

    await loader(createRouteArgs(request));

    expect(generatePasskeyRegistrationOptions).toHaveBeenCalledWith({
      request,
      userEmail: "user@example.com",
      userId: "user@example.com",
    });
  });

  test("given: an existing email address, should: return a clear signup error", async () => {
    vi.mocked(retrieveUserFromDatabaseByEmail).mockResolvedValueOnce({
      createdAt: new Date("2026-05-31T00:00:00.000Z"),
      email: "user@example.com",
      emailVerifiedAt: null,
      id: "existing-user-id",
      updatedAt: new Date("2026-05-31T00:00:00.000Z"),
    });
    const request = new Request(
      "https://example.com/auth/passkey/signup?email=user%40example.com",
    );

    const response = await loader(createRouteArgs(request));

    const actual = {
      body: response.data,
      status: response.init?.status,
    };
    const expected = {
      body: {
        error: "An account already exists for this email. Log in instead.",
      },
      status: 409,
    };

    expect(actual).toEqual(expected);
  });
});

describe("auth.passkey.signup action", () => {
  test("given: a valid passkey response, should: create an unverified user for the signup email", async () => {
    const session = await sessionStorage.getSession();
    session.set("passkeySignupChallenge", "challenge");
    session.set("passkeySignupEmail", "user@example.com");
    const cookie = await sessionStorage.commitSession(session);
    const request = new Request("https://example.com/auth/passkey/signup", {
      body: JSON.stringify({ credential: { id: "credential-id" } }),
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      method: "POST",
    });

    await action(createRouteArgs(request));

    expect(saveUserToDatabase).toHaveBeenCalledWith({
      email: "user@example.com",
      emailVerifiedAt: null,
    });
    expect(verifyPasskeyRegistration).toHaveBeenCalledWith({
      expectedChallenge: "challenge",
      request,
      response: { id: "credential-id" },
      userId: "user-id",
    });
    expect(createUserSession).toHaveBeenCalledWith("user-id");
  });

  test("given: a valid passkey signup, should: send an email verification link", async () => {
    const session = await sessionStorage.getSession();
    session.set("passkeySignupChallenge", "challenge");
    session.set("passkeySignupEmail", "user@example.com");
    const cookie = await sessionStorage.commitSession(session);
    const request = new Request("https://example.com/auth/passkey/signup", {
      body: JSON.stringify({ credential: { id: "credential-id" } }),
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      method: "POST",
    });

    await action(createRouteArgs(request));

    expect(generateVerificationTOTP).toHaveBeenCalledWith();
    expect(saveVerificationToDatabase).toHaveBeenCalledWith({
      algorithm: "SHA-1",
      charSet: "ABC123",
      digits: 6,
      expiresAt: new Date("2026-05-31T00:10:00.000Z"),
      period: 600,
      secret: "secret",
      target: "user@example.com",
      type: "email",
    });
    expect(sendVerificationEmail).toHaveBeenCalledWith({
      code: "123456",
      email: "user@example.com",
      verificationUrl:
        "https://example.com/auth/callback?type=email&target=user%40example.com&code=123456",
    });
  });
});
