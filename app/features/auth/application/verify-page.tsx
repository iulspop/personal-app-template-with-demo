import { useTranslation } from "react-i18next";
import { Form } from "react-router";

import { VERIFY_CODE_INTENT } from "../domain/auth-constants";

type VerifyPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | undefined;

export function VerifyPageComponent({
  actionData,
  target,
  type,
}: {
  actionData?: VerifyPageActionData;
  target: string;
  type: string;
}) {
  const { t } = useTranslation("auth", { keyPrefix: "verify" });
  const { t: tValidation } = useTranslation("auth");

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("title")}
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        {t("description", { email: target })}
      </p>

      <Form className="space-y-4" method="post">
        <input name="type" type="hidden" value={type} />
        <input name="target" type="hidden" value={target} />
        <div>
          <input
            autoComplete="one-time-code"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-2xl tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            maxLength={6}
            name="code"
            placeholder="XXXXXX"
            type="text"
          />
        </div>
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          name="intent"
          type="submit"
          value={VERIFY_CODE_INTENT}
        >
          {t("submit")}
        </button>
        {actionData?.success === false && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {tValidation(`validation.${actionData.error}` as never)}
          </p>
        )}
      </Form>
    </main>
  );
}
