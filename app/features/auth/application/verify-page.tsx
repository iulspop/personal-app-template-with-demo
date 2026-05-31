import { useTranslation } from "react-i18next"
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

export function VerifyPageComponent({
  actionData,
  target,
  type,
}: {
  actionData?: VerifyPageActionData
  target: string
  type: string
}) {
  const { t } = useTranslation("auth", { keyPrefix: "verify" })
  const { t: tValidation } = useTranslation("auth")

  return (
    <main className={s.page}>
      <h1 className={s.title}>{t("title")}</h1>
      <p className={s.description}>{t("description", { email: target })}</p>

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
          {t("submit")}
        </Button>
        {actionData?.success === false && (
          <FieldError>
            {tValidation(`validation.${actionData.error}` as never)}
          </FieldError>
        )}
      </Form>
    </main>
  )
}
