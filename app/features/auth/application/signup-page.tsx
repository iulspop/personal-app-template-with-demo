import {
  IconBrandAppleFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react"
import { Img } from "openimg/react"
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
      <p className={pageStyles.subcopy}>
        Verify your email to create your account. You can add a passkey after
        signing in.
      </p>

      <div className={pageStyles.stack}>
        <Form className={pageStyles.form} method="post">
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
            name="intent"
            type="submit"
            value={SEND_MAGIC_LINK_INTENT}
          >
            Continue with email
          </Button>
          {actionData?.success === false && (
            <FieldError>{actionData.error}</FieldError>
          )}
        </Form>

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
