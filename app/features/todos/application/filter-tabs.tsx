import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import type { TodoFilter } from "../domain/todos-domain"
import * as s from "./filter-tabs.css"
import { cx } from "~/utils/class-name"

const filters: TodoFilter[] = ["all", "active", "completed"]

export function FilterTabsComponent({
  currentFilter,
}: {
  currentFilter: TodoFilter
}) {
  const { t } = useTranslation("todos")

  return (
    <nav aria-label={t("filterLabel")} className={s.nav}>
      {filters.map((filter) => (
        <Link
          aria-current={filter === currentFilter ? "page" : undefined}
          className={cx(s.link, filter === currentFilter && s.activeLink)}
          key={filter}
          to={`/?filter=${filter}`}
        >
          {t(`filter.${filter}`)}
        </Link>
      ))}
    </nav>
  )
}
