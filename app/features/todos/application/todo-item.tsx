import { useEffect, useState } from "react";
import { Form, useFetcher } from "react-router";

import type { Todo } from "../../../../generated/prisma/client";
import {
  DELETE_TODO_INTENT,
  TOGGLE_TODO_INTENT,
} from "../domain/todos-constants";
import { TodoItemEditComponent } from "./todo-item-edit";

export function TodoItemDisplayComponent({
  onEdit,
  todo,
}: {
  onEdit: () => void;
  todo: Todo;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <Form method="post">
        <input name="id" type="hidden" value={todo.id} />
        <button
          aria-label={`Toggle ${todo.title}`}
          className={`size-5 rounded border ${
            todo.completed
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-400 dark:border-gray-500"
          } flex items-center justify-center`}
          name="intent"
          type="submit"
          value={TOGGLE_TODO_INTENT}
        >
          {todo.completed && (
            <svg
              aria-hidden="true"
              className="size-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
              />
            </svg>
          )}
        </button>
      </Form>

      <div className="flex-1">
        <span
          className={
            todo.completed
              ? "text-gray-500 line-through dark:text-gray-400"
              : ""
          }
        >
          {todo.title}
        </span>
        {todo.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {todo.description}
          </p>
        )}
      </div>

      <button
        aria-label={`Edit ${todo.title}`}
        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        onClick={onEdit}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      <Form method="post">
        <input name="id" type="hidden" value={todo.id} />
        <button
          aria-label={`Delete ${todo.title}`}
          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          name="intent"
          type="submit"
          value={DELETE_TODO_INTENT}
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </Form>
    </li>
  );
}

export function TodoItemComponent({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setIsEditing(false);
    }
  }, [fetcher.state, fetcher.data]);

  if (isEditing) {
    return (
      <TodoItemEditComponent
        fetcher={fetcher}
        onCancel={() => setIsEditing(false)}
        todo={todo}
      />
    );
  }

  return (
    <TodoItemDisplayComponent onEdit={() => setIsEditing(true)} todo={todo} />
  );
}
