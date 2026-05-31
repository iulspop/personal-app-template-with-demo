import { useTranslation } from "react-i18next"
import type { FetcherWithComponents } from "react-router"

import type { Todo } from "../../../../generated/prisma/client"
import { EDIT_TODO_INTENT } from "../domain/todos-constants"
import * as s from "./todo-item-edit.css"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

export function TodoItemEditComponent({
  fetcher,
  onCancel,
  todo,
}: {
  fetcher: FetcherWithComponents<unknown>
  onCancel: () => void
  todo: Todo
}) {
  const { t } = useTranslation("todos")

  return (
    <li className={s.item}>
      <fetcher.Form className={s.form} method="post">
        <input name="id" type="hidden" value={todo.id} />
        <input name="intent" type="hidden" value={EDIT_TODO_INTENT} />
        <Input defaultValue={todo.title} name="title" type="text" />
        <Textarea defaultValue={todo.description} name="description" rows={2} />
        <div className={s.actions}>
          <Button size="sm" type="submit">
            {t("save")}
          </Button>
          <Button
            onClick={onCancel}
            size="sm"
            type="button"
            variant="secondary"
          >
            {t("cancel")}
          </Button>
        </div>
      </fetcher.Form>
    </li>
  )
}
