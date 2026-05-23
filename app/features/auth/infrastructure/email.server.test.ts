import { afterEach, describe, expect, test, vi } from "vitest";

import { logMagicLinkEmail } from "./email.server";

describe("logMagicLinkEmail()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("given: a magic link email, should: log the code and link", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logMagicLinkEmail({
      code: "123456",
      email: "user@example.com",
      magicLinkUrl:
        "http://localhost:5173/auth/callback?type=login&target=user%40example.com&code=123456",
    });

    const actual = log.mock.calls;
    const expected = [
      ["[Auth] Magic link for user@example.com:"],
      ["  Code: 123456"],
      [
        "  Link: http://localhost:5173/auth/callback?type=login&target=user%40example.com&code=123456",
      ],
    ];

    expect(actual).toEqual(expected);
  });
});
