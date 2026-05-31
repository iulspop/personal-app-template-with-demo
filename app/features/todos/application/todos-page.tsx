import { startRegistration } from "@simplewebauthn/browser";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";

import type { Todo } from "../../../../generated/prisma/client";
import {
  CLEAR_COMPLETED_INTENT,
  CREATE_TODO_INTENT,
} from "../domain/todos-constants";
import type { TodoFilter } from "../domain/todos-domain";
import {
  isTodoValidationError,
  validationErrorToI18nKey,
} from "../domain/todos-domain";
import { FilterTabsComponent } from "./filter-tabs";
import { TodoItemComponent } from "./todo-item";
import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { RESEND_EMAIL_VERIFICATION_INTENT } from "~/features/auth/domain/auth-constants";

type TodosPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | {
      cooldownSeconds: number;
      error: string | null;
      intent: typeof RESEND_EMAIL_VERIFICATION_INTENT;
      success: boolean;
    }
  | undefined;

export function TodosPageComponent({
  actionData,
  counts,
  filter,
  hasPasskeys = true,
  isEmailVerified = true,
  resendEmailVerificationCooldownSeconds = 0,
  todos,
}: {
  actionData?: TodosPageActionData;
  counts: { active: number; completed: number; total: number };
  filter: TodoFilter;
  hasPasskeys?: boolean;
  isEmailVerified?: boolean;
  resendEmailVerificationCooldownSeconds?: number;
  todos: Todo[];
}) {
  const { t } = useTranslation("todos");
  const [passkeySetupState, setPasskeySetupState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(
    resendEmailVerificationCooldownSeconds,
  );
  const isResendAction =
    actionData &&
    "intent" in actionData &&
    actionData.intent === RESEND_EMAIL_VERIFICATION_INTENT;
  const formattedResendCooldown = `${Math.floor(resendCooldownSeconds / 60)}:${String(
    resendCooldownSeconds % 60,
  ).padStart(2, "0")}`;

  useEffect(() => {
    setResendCooldownSeconds(resendEmailVerificationCooldownSeconds);
  }, [resendEmailVerificationCooldownSeconds]);

  useEffect(() => {
    if (!isResendAction) return;

    setResendCooldownSeconds(actionData.cooldownSeconds);
  }, [actionData, isResendAction]);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) return;

    const timeout = window.setTimeout(
      () => setResendCooldownSeconds((seconds) => seconds - 1),
      1000,
    );

    return () => window.clearTimeout(timeout);
  }, [resendCooldownSeconds]);

  const setupPasskey = async () => {
    setPasskeySetupState("saving");

    try {
      const optionsJSON = await fetch("/auth/passkey/register").then((res) =>
        res.json(),
      );
      const credential = await startRegistration({ optionsJSON });
      const result = await fetch("/auth/passkey/register", {
        body: JSON.stringify(credential),
        headers: { "Content-Type": "application/json" },
        method: "post",
      }).then((res) => res.json());

      setPasskeySetupState(result.verified ? "saved" : "error");
    } catch {
      setPasskeySetupState("error");
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("pageTitle")}</h1>
        <Form action="/logout" method="post">
          <Button size="sm" type="submit" variant="outline">
            {t("translation:logout", { defaultValue: "Log out" })}
          </Button>
        </Form>
      </div>

      {!isEmailVerified && (
        <section className="mb-8 rounded-lg border border-border bg-card p-4 text-card-foreground">
          <h2 className="font-semibold">Verify your email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm your email address to finish setting up your account.
          </p>
          {isResendAction && actionData.success && (
            <p className="mt-2 text-sm text-muted-foreground">
              Verification email sent.
            </p>
          )}
          {isResendAction && !actionData.success && actionData.error && (
            <FieldError className="mt-2">{actionData.error}</FieldError>
          )}
          <Form className="mt-3" method="post">
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

      {!hasPasskeys && passkeySetupState !== "saved" && (
        <section className="mb-8 rounded-lg border border-border bg-card p-4 text-card-foreground">
          <h2 className="font-semibold">Add a passkey</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your device unlock for faster future logins.
          </p>
          <Button
            className="mt-3"
            disabled={passkeySetupState === "saving"}
            onClick={setupPasskey}
            type="button"
            variant="outline"
          >
            {passkeySetupState === "saving" ? "Setting up…" : "Set up passkey"}
          </Button>
          {passkeySetupState === "error" && (
            <FieldError className="mt-2">Passkey setup failed.</FieldError>
          )}
        </section>
      )}

      <Form className="mb-8 space-y-4" method="post">
        <div>
          <Input name="title" placeholder={t("titlePlaceholder")} type="text" />
        </div>
        <div>
          <Textarea
            name="description"
            placeholder={t("description")}
            rows={2}
          />
        </div>
        <Button name="intent" type="submit" value={CREATE_TODO_INTENT}>
          {t("addTodo")}
        </Button>
        {actionData?.success === false &&
          actionData.error &&
          isTodoValidationError(actionData.error) && (
            <FieldError>
              {t(validationErrorToI18nKey(actionData.error))}
            </FieldError>
          )}
      </Form>

      <FilterTabsComponent currentFilter={filter} />

      {counts.total === 0 ? (
        <p className="text-center text-muted-foreground">{t("emptyState")}</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-muted-foreground">
          {t(
            `emptyFiltered.${filter}` as
              | "emptyFiltered.active"
              | "emptyFiltered.completed",
          )}
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItemComponent key={todo.id} todo={todo} />
          ))}
        </ul>
      )}

      <footer className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>{t("activeCount", { count: counts.active })}</span>
        {counts.completed > 0 && (
          <Form method="post">
            <Button
              className="text-destructive"
              name="intent"
              type="submit"
              value={CLEAR_COMPLETED_INTENT}
              variant="link"
            >
              {t("clearCompleted")}
            </Button>
          </Form>
        )}
        <span>{t("completedCount", { count: counts.completed })}</span>
      </footer>
    </main>
  );
}
