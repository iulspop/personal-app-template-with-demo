import { describe, expect, test } from "vitest";

import {
  authValidationErrorToI18nKey,
  buildMagicLinkUrl,
  computeSessionExpiry,
  computeVerificationExpiry,
  isAuthValidationError,
  isSessionExpired,
  validateEmail,
  validateName,
} from "./auth-domain";

describe("validateEmail()", () => {
  test("given: a valid email, should: return trimmed lowercase email", () => {
    const result = validateEmail("  Alice@Example.COM  ");

    expect(result).toEqual({ data: "alice@example.com", success: true });
  });

  test("given: an empty string, should: return EMAIL_EMPTY error", () => {
    const result = validateEmail("   ");

    expect(result).toEqual({ error: "EMAIL_EMPTY", success: false });
  });

  test("given: an invalid email, should: return EMAIL_INVALID error", () => {
    const result = validateEmail("not-an-email");

    expect(result).toEqual({ error: "EMAIL_INVALID", success: false });
  });

  test("given: an email with spaces, should: trim and lowercase", () => {
    const result = validateEmail("  Test@Test.com ");

    expect(result).toEqual({ data: "test@test.com", success: true });
  });
});

describe("validateName()", () => {
  test("given: a valid name, should: return trimmed name", () => {
    const result = validateName("  Alice  ");

    expect(result).toEqual({ data: "Alice", success: true });
  });

  test("given: an empty name, should: return NAME_EMPTY error", () => {
    const result = validateName("   ");

    expect(result).toEqual({ error: "NAME_EMPTY", success: false });
  });

  test("given: a name exceeding 100 characters, should: return NAME_TOO_LONG error", () => {
    const result = validateName("a".repeat(101));

    expect(result).toEqual({ error: "NAME_TOO_LONG", success: false });
  });

  test("given: a name of exactly 100 characters, should: succeed", () => {
    const name = "a".repeat(100);
    const result = validateName(name);

    expect(result).toEqual({ data: name, success: true });
  });
});

describe("isSessionExpired()", () => {
  test("given: an expiration in the past, should: return true", () => {
    const past = new Date("2024-01-01");
    const now = new Date("2024-06-01");

    expect(isSessionExpired(past, now)).toBe(true);
  });

  test("given: an expiration in the future, should: return false", () => {
    const future = new Date("2025-01-01");
    const now = new Date("2024-06-01");

    expect(isSessionExpired(future, now)).toBe(false);
  });

  test("given: an expiration equal to now, should: return true (boundary)", () => {
    const now = new Date("2024-06-01");

    expect(isSessionExpired(now, now)).toBe(true);
  });
});

describe("computeSessionExpiry()", () => {
  test("given: 30 days from now, should: return date 30 days ahead", () => {
    const now = new Date("2024-01-01T00:00:00Z");
    const result = computeSessionExpiry(30, now);

    expect(result).toEqual(new Date("2024-01-31T00:00:00Z"));
  });
});

describe("computeVerificationExpiry()", () => {
  test("given: 10 minutes from now, should: return date 10 minutes ahead", () => {
    const now = new Date("2024-01-01T00:00:00Z");
    const result = computeVerificationExpiry(10, now);

    expect(result).toEqual(new Date("2024-01-01T00:10:00Z"));
  });
});

describe("buildMagicLinkUrl()", () => {
  test("given: valid params, should: build a complete callback URL", () => {
    const result = buildMagicLinkUrl({
      baseUrl: "https://example.com",
      code: "ABC123",
      target: "alice@example.com",
      type: "login",
    });

    expect(result).toBe(
      "https://example.com/auth/callback?type=login&target=alice%40example.com&code=ABC123",
    );
  });
});

describe("authValidationErrorToI18nKey()", () => {
  test("given: EMAIL_EMPTY, should: return validation.emailRequired", () => {
    expect(authValidationErrorToI18nKey("EMAIL_EMPTY")).toBe(
      "validation.emailRequired",
    );
  });

  test("given: EMAIL_INVALID, should: return validation.emailInvalid", () => {
    expect(authValidationErrorToI18nKey("EMAIL_INVALID")).toBe(
      "validation.emailInvalid",
    );
  });

  test("given: NAME_EMPTY, should: return validation.nameRequired", () => {
    expect(authValidationErrorToI18nKey("NAME_EMPTY")).toBe(
      "validation.nameRequired",
    );
  });

  test("given: NAME_TOO_LONG, should: return validation.nameTooLong", () => {
    expect(authValidationErrorToI18nKey("NAME_TOO_LONG")).toBe(
      "validation.nameTooLong",
    );
  });
});

describe("isAuthValidationError()", () => {
  test("given: a valid error code, should: return true", () => {
    expect(isAuthValidationError("EMAIL_EMPTY")).toBe(true);
    expect(isAuthValidationError("NAME_TOO_LONG")).toBe(true);
  });

  test("given: an invalid string, should: return false", () => {
    expect(isAuthValidationError("NOT_AN_ERROR")).toBe(false);
  });
});
