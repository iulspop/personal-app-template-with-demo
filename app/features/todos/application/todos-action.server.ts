import { data } from "react-router";
import { match } from "ts-pattern";

import {
  CREATE_TODO_INTENT,
  DELETE_TODO_INTENT,
  TOGGLE_TODO_INTENT,
} from "../domain/todos-constants";
import { validateNewTodo } from "../domain/todos-domain";
import {
  deleteTodoFromDatabaseById,
  retrieveTodoFromDatabaseById,
  saveTodoToDatabase,
  updateTodoInDatabaseById,
} from "../infrastructure/todos-model.server";
import { todoActionSchema } from "./todos-schemas";
import type { Route } from ".react-router/types/app/routes/+types/index";

export const todosAction = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const parsed = todoActionSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success)
    return data(
      { error: "Invalid form data", success: false as const },
      { status: 400 },
    );

  return match(parsed.data)
    .with({ intent: CREATE_TODO_INTENT }, async ({ description, title }) => {
      const result = validateNewTodo({ description, title });
      if (!result.success)
        return data(
          { error: result.error, success: false as const },
          { status: 400 },
        );

      await saveTodoToDatabase(result.data);
      return data({ error: null, success: true as const });
    })
    .with({ intent: TOGGLE_TODO_INTENT }, async ({ id }) => {
      const todo = await retrieveTodoFromDatabaseById(id);
      if (!todo)
        return data(
          { error: "Todo not found", success: false as const },
          { status: 404 },
        );

      await updateTodoInDatabaseById({
        data: { completed: !todo.completed },
        id,
      });

      return data({ error: null, success: true as const });
    })
    .with({ intent: DELETE_TODO_INTENT }, async ({ id }) => {
      await deleteTodoFromDatabaseById(id);
      return data({ error: null, success: true as const });
    })
    .exhaustive();
};
