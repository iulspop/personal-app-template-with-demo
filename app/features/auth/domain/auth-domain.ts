// ─── Types ───────────────────────────────────────────────────────────────────

export type Result<T, E> =
  | { error: E; success: false }
  | { data: T; success: true };

export type AuthValidationError =
  | "EMAIL_EMPTY"
  | "EMAIL_INVALID"
  | "NAME_EMPTY"
  | "NAME_TOO_LONG";

// ─── Constants ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Validates and normalises an email address.
 */
export const validateEmail = (
  email: string,
): Result<string, AuthValidationError> => {
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length === 0) return { error: "EMAIL_EMPTY", success: false };
  if (!EMAIL_REGEX.test(trimmed))
    return { error: "EMAIL_INVALID", success: false };
  return { data: trimmed, success: true };
};

/**
 * Validates and trims a display name.
 */
export const validateName = (
  name: string,
): Result<string, AuthValidationError> => {
  const trimmed = name.trim();
  if (trimmed.length === 0) return { error: "NAME_EMPTY", success: false };
  if (trimmed.length > MAX_NAME_LENGTH)
    return { error: "NAME_TOO_LONG", success: false };
  return { data: trimmed, success: true };
};

/**
 * Checks whether a session has expired.
 */
export const isSessionExpired = (
  expirationDate: Date,
  now = new Date(),
): boolean => expirationDate.getTime() <= now.getTime();

/**
 * Computes a session expiration date.
 */
export const computeSessionExpiry = (
  daysFromNow: number,
  now = new Date(),
): Date => new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);

/**
 * Computes a verification expiration date.
 */
export const computeVerificationExpiry = (
  minutesFromNow: number,
  now = new Date(),
): Date => new Date(now.getTime() + minutesFromNow * 60 * 1000);

/**
 * Builds a magic-link callback URL.
 */
export const buildMagicLinkUrl = ({
  baseUrl,
  code,
  target,
  type,
}: {
  baseUrl: string;
  code: string;
  target: string;
  type: string;
}): string => {
  const url = new URL("/auth/callback", baseUrl);
  url.searchParams.set("type", type);
  url.searchParams.set("target", target);
  url.searchParams.set("code", code);
  return url.toString();
};

/**
 * Maps auth validation errors to i18n keys.
 */
const authValidationErrorI18nKeys = {
  EMAIL_EMPTY: "validation.emailRequired",
  EMAIL_INVALID: "validation.emailInvalid",
  NAME_EMPTY: "validation.nameRequired",
  NAME_TOO_LONG: "validation.nameTooLong",
} as const;

export const authValidationErrorToI18nKey = (
  error: AuthValidationError,
): (typeof authValidationErrorI18nKeys)[AuthValidationError] =>
  authValidationErrorI18nKeys[error];

/**
 * Type guard for AuthValidationError.
 */
export const isAuthValidationError = (
  value: string,
): value is AuthValidationError => value in authValidationErrorI18nKeys;
