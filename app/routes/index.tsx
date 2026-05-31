import type { Route } from "./+types/index";
import { requireUserId } from "~/features/auth/application/auth-session.server";
import { retrievePasskeysFromDatabaseByUserId } from "~/features/auth/infrastructure/passkeys-model.server";
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
  const userId = await requireUserId(request);
  const i18n = getInstance(context);
  const [allTodos, passkeys] = await Promise.all([
    retrieveAllTodosFromDatabase(),
    retrievePasskeysFromDatabaseByUserId(userId),
  ]);
  const filter = parseTodoFilter(
    new URL(request.url).searchParams.get("filter"),
  );

  return {
    counts: countByStatus(allTodos),
    filter,
    hasPasskeys: passkeys.length > 0,
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
      hasPasskeys={loaderData.hasPasskeys}
      todos={loaderData.todos}
    />
  );
}
