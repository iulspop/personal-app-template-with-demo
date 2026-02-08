import { useTranslation } from "react-i18next";
import type { FetcherWithComponents } from "react-router";

import type { Todo } from "../../../../generated/prisma/client";
import { EDIT_TODO_INTENT } from "../domain/todos-constants";

export function TodoItemEditComponent({
  fetcher,
  onCancel,
  todo,
}: {
  fetcher: FetcherWithComponents<unknown>;
  onCancel: () => void;
  todo: Todo;
}) {
  const { t } = useTranslation("todos");

  return (
    <li className="rounded-lg border border-blue-300 p-4 dark:border-blue-600">
      <fetcher.Form className="space-y-3" method="post">
        <input name="id" type="hidden" value={todo.id} />
        <input name="intent" type="hidden" value={EDIT_TODO_INTENT} />
        <input
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          defaultValue={todo.title}
          name="title"
          type="text"
        />
        <textarea
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          defaultValue={todo.description}
          name="description"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            type="submit"
          >
            {t("save")}
          </button>
          <button
            className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={onCancel}
            type="button"
          >
            {t("cancel")}
          </button>
        </div>
      </fetcher.Form>
    </li>
  );
}
