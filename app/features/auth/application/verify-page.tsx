import { Form } from "react-router"

import { VERIFY_CODE_INTENT } from "../domain/auth-constants"
import * as s from "./verify-page.css"
import { Button } from "~/components/ui/button"
import { FieldError } from "~/components/ui/field"
import { Input } from "~/components/ui/input"

type VerifyPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | undefined

const validationMessages: Record<string, string> = {
  codeExpired: "Code expired. Please request a new one.",
  codeRequired: "Please enter your verification code.",
  emailInvalid: "Please enter a valid email address.",
  emailRequired: "Email is required.",
  invalidCode: "Invalid code. Please try again.",
}

export function VerifyPageComponent({
  actionData,
  target,
  type,
}: {
  actionData?: VerifyPageActionData
  target: string
  type: string
}) {
  return (
    <main className={s.page}>
      <h1 className={s.title}>Check your email</h1>
      <p className={s.description}>
        We sent a 6-digit code to {target}. Enter it below.
      </p>

      <Form className={s.form} method="post">
        <input name="type" type="hidden" value={type} />
        <input name="target" type="hidden" value={target} />
        <div>
          <Input
            autoComplete="one-time-code"
            className={s.codeInput}
            maxLength={6}
            name="code"
            placeholder="XXXXXX"
            type="text"
          />
        </div>
        <Button
          className={s.fullWidth}
          name="intent"
          type="submit"
          value={VERIFY_CODE_INTENT}
        >
          Verify
        </Button>
        {actionData?.success === false && (
          <FieldError>
            {validationMessages[actionData.error] ?? actionData.error}
          </FieldError>
        )}
      </Form>
    </main>
  )
}
