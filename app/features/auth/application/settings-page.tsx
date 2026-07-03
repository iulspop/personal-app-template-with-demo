import { startRegistration } from "@simplewebauthn/browser"
import { useState } from "react"
import { Form, Link } from "react-router"

import * as s from "./settings-page.css"
import { Button } from "~/components/ui/button"
import { FieldError } from "~/components/ui/field"
import { cx } from "~/utils/class-name"

type SettingsActionData =
  | { error: null; success: true }
  | { error: string; success: false }
  | undefined

type PasskeySummary = {
  createdAt: string
  id: string
}

export function SettingsPageComponent({
  actionData,
  passkeys,
  userEmail,
}: {
  actionData?: SettingsActionData
  passkeys: PasskeySummary[]
  userEmail: string
}) {
  const [passkeySetupState, setPasskeySetupState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle")
  const hasActivePasskey = passkeys.length > 0 || passkeySetupState === "saved"

  const setupPasskey = async () => {
    setPasskeySetupState("saving")

    try {
      const optionsResponse = await fetch("/auth/passkey/register")
      const optionsJSON = await optionsResponse.json()

      if (!optionsResponse.ok) {
        setPasskeySetupState("error")
        return
      }

      const credential = await startRegistration({ optionsJSON })
      const result = await fetch("/auth/passkey/register", {
        body: JSON.stringify(credential),
        headers: { "Content-Type": "application/json" },
        method: "post",
      }).then((res) => res.json())

      setPasskeySetupState(result.verified ? "saved" : "error")
    } catch {
      setPasskeySetupState("error")
    }
  }

  return (
    <main className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Settings</h1>
        <Link className={s.backLink} to="/">
          Back to todos
        </Link>
      </div>

      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Passkeys</h2>
          <p className={s.cardBody}>
            Add a passkey to {userEmail} so you can sign in with your device
            unlock instead of an email link.
          </p>
        </div>

        <p className={s.cardBody}>
          Status: {hasActivePasskey ? "Passkey enabled" : "Email sign-in only"}
        </p>

        {passkeys.length > 0 && (
          <ul className={s.passkeyList}>
            {passkeys.map((passkey) => (
              <li className={s.passkeyItem} key={passkey.id}>
                <span>
                  Passkey added{" "}
                  {new Date(passkey.createdAt).toLocaleDateString()}
                </span>
                <Form method="post">
                  <input name="passkeyId" type="hidden" value={passkey.id} />
                  <Button
                    name="intent"
                    size="sm"
                    type="submit"
                    value="deletePasskey"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </Form>
              </li>
            ))}
          </ul>
        )}

        <Button
          className={s.action}
          disabled={passkeySetupState === "saving"}
          onClick={setupPasskey}
          type="button"
          variant={hasActivePasskey ? "outline" : "default"}
        >
          {passkeySetupState === "saving" ? "Adding passkey…" : "Add passkey"}
        </Button>

        {passkeySetupState === "saved" && (
          <p className={cx(s.status, s.success)}>Passkey added.</p>
        )}
        {passkeySetupState === "error" && (
          <FieldError className={s.status}>Passkey setup failed.</FieldError>
        )}
        {actionData?.success === false && (
          <FieldError className={s.status}>{actionData.error}</FieldError>
        )}
      </section>
    </main>
  )
}
