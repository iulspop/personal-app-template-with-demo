import { startRegistration } from "@simplewebauthn/browser"
import {
  IconBrandAppleFilled,
  IconBrandGoogleFilled,
  IconFingerprint,
  IconMail,
} from "@tabler/icons-react"
import { Img } from "openimg/react"
import { useState } from "react"
import { Form, Link } from "react-router"

import { SEND_MAGIC_LINK_INTENT } from "../domain/auth-constants"
import * as pageStyles from "./auth-page.css"
import type { SignInPageActionData } from "./signin-page"
import { Button } from "~/components/ui/button"
import { FieldError } from "~/components/ui/field"
import { Input } from "~/components/ui/input"

export function SignUpPageComponent({
  actionData,
}: {
  actionData?: SignInPageActionData
}) {
  const [passkeySignupState, setPasskeySignupState] = useState<
    "idle" | "email" | "saving" | "error"
  >("idle")
  const [passkeySignupError, setPasskeySignupError] = useState(
    "Passkey signup failed.",
  )
  const [isMagicLinkFormVisible, setIsMagicLinkFormVisible] = useState(
    actionData?.success === false,
  )

  const signupWithPasskey = async (email: string) => {
    setPasskeySignupState("saving")

    try {
      const optionsResponse = await fetch(
        `/auth/passkey/signup?email=${encodeURIComponent(email)}`,
      )
      const optionsJSON = await optionsResponse.json()

      if (!optionsResponse.ok) {
        setPasskeySignupError(optionsJSON.error ?? "Passkey signup failed.")
        setPasskeySignupState("error")
        return
      }

      const credential = await startRegistration({ optionsJSON })
      const result = await fetch("/auth/passkey/signup", {
        body: JSON.stringify({ credential }),
        headers: { "Content-Type": "application/json" },
        method: "post",
      })

      if (!result.ok) {
        setPasskeySignupError("Passkey signup failed.")
        setPasskeySignupState("error")
        return
      }

      window.location.assign("/")
    } catch {
      setPasskeySignupError("Passkey signup failed.")
      setPasskeySignupState("error")
    }
  }

  return (
    <main className={pageStyles.page}>
      <Img
        alt=""
        className={pageStyles.logo}
        height={48}
        src="/images/logo.png"
        width={48}
      />
      <h1 className={pageStyles.heading}>Sign up</h1>
      <p className={pageStyles.subcopy}>Create your account to get started</p>

      <div className={pageStyles.stack}>
        {passkeySignupState === "email" || passkeySignupState === "saving" ? (
          <form
            className={pageStyles.form}
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              void signupWithPasskey(String(form.get("email") ?? ""))
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
              className={pageStyles.fullWidth}
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
            className={pageStyles.fullWidth}
            onClick={() => setPasskeySignupState("email")}
            type="button"
          >
            <IconFingerprint aria-hidden="true" className={pageStyles.icon} />
            Create with Passkey
          </Button>
        )}

        <div className={pageStyles.divider}>
          <div className={pageStyles.dividerLine} />
          <span>OR</span>
          <div className={pageStyles.dividerLine} />
        </div>

        <Button
          className={pageStyles.fullWidth}
          disabled
          type="button"
          variant="outline"
        >
          <IconBrandGoogleFilled aria-hidden="true" />
          Continue with Google
        </Button>
        <Button
          className={pageStyles.fullWidth}
          disabled
          type="button"
          variant="outline"
        >
          <IconBrandAppleFilled aria-hidden="true" />
          Continue with Apple
        </Button>

        {isMagicLinkFormVisible ? (
          <Form className={pageStyles.form} method="post">
            <Input
              aria-label="Email"
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <Button
              className={pageStyles.fullWidth}
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
            className={pageStyles.textAction}
            onClick={() => setIsMagicLinkFormVisible(true)}
            type="button"
            variant="ghost"
          >
            <IconMail aria-hidden="true" className={pageStyles.icon} />
            Sign up with email link
          </Button>
        )}
        {passkeySignupState === "error" && (
          <FieldError>{passkeySignupError}</FieldError>
        )}
      </div>

      <p className={pageStyles.footer}>
        Already have an account?{" "}
        <Link className={pageStyles.footerLink} to="/auth/signin">
          Log in
        </Link>
      </p>
    </main>
  )
}
