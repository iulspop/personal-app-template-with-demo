import { startAuthentication } from "@simplewebauthn/browser";
import {
  IconBrandAppleFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Img } from "openimg/react";
import { useState } from "react";
import { Form, Link } from "react-router";

import { SEND_MAGIC_LINK_INTENT } from "../domain/auth-constants";
import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { UserValidationError } from "~/features/users/domain/users-domain";
import {
  isUserValidationError,
  userValidationErrorToI18nKey,
} from "~/features/users/domain/users-domain";

export type SignInPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | undefined;

export function SignInPageComponent({
  actionData,
}: {
  actionData?: SignInPageActionData;
}) {
  const [passkeyLoginState, setPasskeyLoginState] = useState<
    "idle" | "checking" | "error"
  >("idle");
  const [isMagicLinkFormVisible, setIsMagicLinkFormVisible] = useState(
    actionData?.success === false,
  );

  const loginWithPasskey = async () => {
    setPasskeyLoginState("checking");

    try {
      const optionsJSON = await fetch("/auth/passkey/login").then((res) =>
        res.json(),
      );
      const credential = await startAuthentication({ optionsJSON });
      const result = await fetch("/auth/passkey/login", {
        body: JSON.stringify(credential),
        headers: { "Content-Type": "application/json" },
        method: "post",
      });

      if (!result.ok) {
        setPasskeyLoginState("error");
        return;
      }

      window.location.assign("/");
    } catch {
      setPasskeyLoginState("error");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Img
        alt=""
        className="mx-auto mb-8 size-12 rounded-lg"
        height={48}
        src="/images/logo.png"
        width={48}
      />
      <h1 className="mb-2 text-center text-4xl font-bold text-foreground">
        Welcome back
      </h1>
      <p className="mb-8 text-center text-muted-foreground">
        Sign in to your workspace
      </p>

      <div className="space-y-4">
        <Button
          className="w-full"
          disabled={passkeyLoginState === "checking"}
          onClick={loginWithPasskey}
          type="button"
        >
          {passkeyLoginState === "checking"
            ? "Checking passkey…"
            : "Sign in with Passkey"}
        </Button>
        {passkeyLoginState === "error" && (
          <FieldError>Passkey sign in failed.</FieldError>
        )}

        <div className="flex items-center gap-3 py-2 text-sm text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button className="w-full" disabled type="button" variant="outline">
          <IconBrandGoogleFilled aria-hidden="true" />
          Continue with Google
        </Button>
        <Button className="w-full" disabled type="button" variant="outline">
          <IconBrandAppleFilled aria-hidden="true" />
          Continue with Apple
        </Button>

        {isMagicLinkFormVisible ? (
          <Form className="space-y-3" method="post">
            <Input
              aria-label="Email"
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <Button
              className="w-full"
              name="intent"
              type="submit"
              value={SEND_MAGIC_LINK_INTENT}
              variant="outline"
            >
              Send magic link
            </Button>
            {actionData?.success === false && (
              <FieldError>
                {isUserValidationError(actionData.error)
                  ? userValidationErrorToI18nKey(
                      actionData.error as UserValidationError,
                    )
                  : actionData.error}
              </FieldError>
            )}
          </Form>
        ) : (
          <Button
            className="w-full"
            onClick={() => setIsMagicLinkFormVisible(true)}
            type="button"
            variant="outline"
          >
            Email me a sign-in link
          </Button>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="font-medium text-primary" to="/auth/signup">
          Sign up
        </Link>
      </p>
    </main>
  );
}
