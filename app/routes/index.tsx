import type { Route } from "./+types/index";
import { getInstance } from "~/features/localization/i18next-middleware.server";
import { todosAction } from "~/features/todos/application/todos-action.server";
import { TodosPageComponent } from "~/features/todos/application/todos-page";
import {
  countByStatus,
  filterTodos,
  parseTodoFilter,
} from "~/features/todos/domain/todos-domain";
import { retrieveAllTodosFromDatabase } from "~/features/todos/infrastructure/todos-model.server";

export async function loader({ context, request }: Route.LoaderArgs) {
  const i18n = getInstance(context);
  const allTodos = await retrieveAllTodosFromDatabase();
  const filter = parseTodoFilter(
    new URL(request.url).searchParams.get("filter"),
  );

  return {
    counts: countByStatus(allTodos),
    filter,
    pageTitle: i18n.t("todos:pageTitle"),
    todos: filterTodos(allTodos, filter),
  };
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.pageTitle },
];

export async function action(args: Route.ActionArgs) {
  return await todosAction(args);
}

export default function TodosRoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <TodosPageComponent
      actionData={actionData}
      counts={loaderData.counts}
      filter={loaderData.filter}
      todos={loaderData.todos}
    />
  );
}
