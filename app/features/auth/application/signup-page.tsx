import { startRegistration } from "@simplewebauthn/browser";
import {
  IconBrandAppleFilled,
  IconBrandGoogleFilled,
  IconFingerprint,
  IconMail,
} from "@tabler/icons-react";
import { Img } from "openimg/react";
import { useState } from "react";
import { Form, Link } from "react-router";

import { SEND_MAGIC_LINK_INTENT } from "../domain/auth-constants";
import type { SignInPageActionData } from "./signin-page";
import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function SignUpPageComponent({
  actionData,
}: {
  actionData?: SignInPageActionData;
}) {
  const [passkeySignupState, setPasskeySignupState] = useState<
    "idle" | "email" | "saving" | "error"
  >("idle");
  const [passkeySignupError, setPasskeySignupError] = useState(
    "Passkey signup failed.",
  );
  const [isMagicLinkFormVisible, setIsMagicLinkFormVisible] = useState(
    actionData?.success === false,
  );

  const signupWithPasskey = async (email: string) => {
    setPasskeySignupState("saving");

    try {
      const optionsResponse = await fetch(
        `/auth/passkey/signup?email=${encodeURIComponent(email)}`,
      );
      const optionsJSON = await optionsResponse.json();

      if (!optionsResponse.ok) {
        setPasskeySignupError(optionsJSON.error ?? "Passkey signup failed.");
        setPasskeySignupState("error");
        return;
      }

      const credential = await startRegistration({ optionsJSON });
      const result = await fetch("/auth/passkey/signup", {
        body: JSON.stringify({ credential }),
        headers: { "Content-Type": "application/json" },
        method: "post",
      });

      if (!result.ok) {
        setPasskeySignupError("Passkey signup failed.");
        setPasskeySignupState("error");
        return;
      }

      window.location.assign("/");
    } catch {
      setPasskeySignupError("Passkey signup failed.");
      setPasskeySignupState("error");
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
        Sign up
      </h1>
      <p className="mb-8 text-center text-muted-foreground">
        Create your account to get started
      </p>

      <div className="space-y-4">
        {passkeySignupState === "email" || passkeySignupState === "saving" ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void signupWithPasskey(String(form.get("email") ?? ""));
            }}
          >
            <Input
              aria-label="Email"
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
            <Button
              className="w-full"
              disabled={passkeySignupState === "saving"}
              type="submit"
            >
              {passkeySignupState === "saving"
                ? "Creating passkey…"
                : "Continue"}
            </Button>
          </form>
        ) : (
          <Button
            className="w-full"
            onClick={() => setPasskeySignupState("email")}
            type="button"
          >
            <IconFingerprint aria-hidden="true" className="size-5" />
            Create with Passkey
          </Button>
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
              Send signup link
            </Button>
            {actionData?.success === false && (
              <FieldError>{actionData.error}</FieldError>
            )}
          </Form>
        ) : (
          <Button
            className="mx-auto flex w-fit bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={() => setIsMagicLinkFormVisible(true)}
            type="button"
            variant="ghost"
          >
            <IconMail aria-hidden="true" className="size-5" />
            Sign up with email link
          </Button>
        )}
        {passkeySignupState === "error" && (
          <FieldError>{passkeySignupError}</FieldError>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-primary" to="/auth/signin">
          Log in
        </Link>
      </p>
    </main>
  );
}
