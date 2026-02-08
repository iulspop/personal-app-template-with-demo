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

type TodosPageActionData =
  | { error: string; success: false }
  | { error: null; success: true }
  | undefined;

export function TodosPageComponent({
  actionData,
  counts,
  filter,
  todos,
}: {
  actionData?: TodosPageActionData;
  counts: { active: number; completed: number; total: number };
  filter: TodoFilter;
  todos: Todo[];
}) {
  const { t } = useTranslation("todos");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("pageTitle")}
        </h1>
        <Form action="/logout" method="post">
          <button
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            type="submit"
          >
            {t("translation:logout", { defaultValue: "Log out" })}
          </button>
        </Form>
      </div>

      <Form className="mb-8 space-y-4" method="post">
        <div>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            name="title"
            placeholder={t("titlePlaceholder")}
            type="text"
          />
        </div>
        <div>
          <textarea
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            name="description"
            placeholder={t("description")}
            rows={2}
          />
        </div>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          name="intent"
          type="submit"
          value={CREATE_TODO_INTENT}
        >
          {t("addTodo")}
        </button>
        {actionData?.success === false &&
          isTodoValidationError(actionData.error) && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {t(validationErrorToI18nKey(actionData.error))}
            </p>
          )}
      </Form>

      <FilterTabsComponent currentFilter={filter} />

      {counts.total === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t("emptyState")}
        </p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
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

      <footer className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{t("activeCount", { count: counts.active })}</span>
        {counts.completed > 0 && (
          <Form method="post">
            <button
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              name="intent"
              type="submit"
              value={CLEAR_COMPLETED_INTENT}
            >
              {t("clearCompleted")}
            </button>
          </Form>
        )}
        <span>{t("completedCount", { count: counts.completed })}</span>
      </footer>
    </main>
  );
}
