import { useEffect, useState } from "react"
import { Form, Link } from "react-router"

import type { Todo } from "../../../../generated/prisma/client"
import {
  CLEAR_COMPLETED_INTENT,
  CREATE_TODO_INTENT,
} from "../domain/todos-constants"
import type { TodoFilter } from "../domain/todos-domain"
import {
  isTodoValidationError,
  validationErrorToMessage,
} from "../domain/todos-domain"
import { FilterTabsComponent } from "./filter-tabs"
import { TodoItemComponent } from "./todo-item"
import * as s from "./todos-page.css"
import { Button } from "~/components/ui/button"
import { FieldError } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { RESEND_EMAIL_VERIFICATION_INTENT } from "~/features/auth/domain/auth-constants"

type TodosPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | {
      cooldownSeconds: number
      error: string | null
      intent: typeof RESEND_EMAIL_VERIFICATION_INTENT
      success: boolean
    }
  | undefined

export function TodosPageComponent({
  actionData,
  counts,
  filter,
  hasPasskeys = true,
  isEmailVerified = true,
  resendEmailVerificationCooldownSeconds = 0,
  todos,
}: {
  actionData?: TodosPageActionData
  counts: { active: number; completed: number; total: number }
  filter: TodoFilter
  hasPasskeys?: boolean
  isEmailVerified?: boolean
  resendEmailVerificationCooldownSeconds?: number
  todos: Todo[]
}) {
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(
    resendEmailVerificationCooldownSeconds,
  )
  const isResendAction =
    actionData &&
    "intent" in actionData &&
    actionData.intent === RESEND_EMAIL_VERIFICATION_INTENT
  const formattedResendCooldown = `${Math.floor(resendCooldownSeconds / 60)}:${String(
    resendCooldownSeconds % 60,
  ).padStart(2, "0")}`

  useEffect(() => {
    setResendCooldownSeconds(resendEmailVerificationCooldownSeconds)
  }, [resendEmailVerificationCooldownSeconds])

  useEffect(() => {
    if (!isResendAction) return

    setResendCooldownSeconds(actionData.cooldownSeconds)
  }, [actionData, isResendAction])

  useEffect(() => {
    if (resendCooldownSeconds <= 0) return

    const timeout = window.setTimeout(
      () => setResendCooldownSeconds((seconds) => seconds - 1),
      1000,
    )

    return () => window.clearTimeout(timeout)
  }, [resendCooldownSeconds])

  return (
    <main className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Todos</h1>
        <div className={s.headerActions}>
          <Link className={s.settingsLink} to="/settings">
            Settings
          </Link>
          <Form action="/logout" method="post">
            <Button size="sm" type="submit" variant="outline">
              Log out
            </Button>
          </Form>
        </div>
      </div>

      {!isEmailVerified && (
        <section className={s.notice}>
          <h2 className={s.noticeTitle}>Verify your email</h2>
          <p className={s.noticeBody}>
            Confirm your email address to finish setting up your account.
          </p>
          {isResendAction && actionData.success && (
            <p className={s.noticeBody}>Verification email sent.</p>
          )}
          {isResendAction && !actionData.success && actionData.error && (
            <FieldError className={s.noticeBody}>{actionData.error}</FieldError>
          )}
          <Form className={s.noticeAction} method="post">
            <Button
              disabled={resendCooldownSeconds > 0}
              name="intent"
              type="submit"
              value={RESEND_EMAIL_VERIFICATION_INTENT}
              variant="outline"
            >
              {resendCooldownSeconds > 0
                ? `Resend again in ${formattedResendCooldown}`
                : "Resend verification email"}
            </Button>
          </Form>
        </section>
      )}

      {!hasPasskeys && (
        <section className={s.notice}>
          <h2 className={s.noticeTitle}>Add a passkey</h2>
          <p className={s.noticeBody}>
            Use your device unlock for faster future logins.
          </p>
          <Link className={s.noticeLink} to="/settings">
            Manage sign-in settings
          </Link>
        </section>
      )}

      <Form className={s.form} method="post">
        <div>
          <Input
            name="title"
            placeholder="What needs to be done?"
            type="text"
          />
        </div>
        <div>
          <Textarea
            name="description"
            placeholder="Description (optional)"
            rows={2}
          />
        </div>
        <Button name="intent" type="submit" value={CREATE_TODO_INTENT}>
          Add todo
        </Button>
        {actionData?.success === false &&
          actionData.error &&
          isTodoValidationError(actionData.error) && (
            <FieldError>
              {validationErrorToMessage(actionData.error)}
            </FieldError>
          )}
      </Form>

      <FilterTabsComponent currentFilter={filter} />

      {counts.total === 0 ? (
        <p className={s.emptyState}>No todos yet. Add one above!</p>
      ) : todos.length === 0 ? (
        <p className={s.emptyState}>
          {filter === "active" ? "No active todos" : "No completed todos"}
        </p>
      ) : (
        <ul className={s.list}>
          {todos.map((todo) => (
            <TodoItemComponent key={todo.id} todo={todo} />
          ))}
        </ul>
      )}

      <footer className={s.footer}>
        <span>{counts.active} active</span>
        {counts.completed > 0 && (
          <Form method="post">
            <Button
              className={s.dangerAction}
              name="intent"
              type="submit"
              value={CLEAR_COMPLETED_INTENT}
              variant="link"
            >
              Clear completed
            </Button>
          </Form>
        )}
        <span>{counts.completed} completed</span>
      </footer>
    </main>
  )
}
