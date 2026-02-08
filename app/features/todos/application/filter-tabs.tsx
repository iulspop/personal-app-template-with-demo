import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import type { TodoFilter } from "../domain/todos-domain";

const filters: TodoFilter[] = ["all", "active", "completed"];

export function FilterTabsComponent({
  currentFilter,
}: {
  currentFilter: TodoFilter;
}) {
  const { t } = useTranslation("todos");

  return (
    <nav aria-label={t("filterLabel")} className="mb-6 flex gap-2">
      {filters.map((filter) => (
        <Link
          aria-current={filter === currentFilter ? "page" : undefined}
          className={`rounded-lg px-3 py-1 text-sm ${
            filter === currentFilter
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          key={filter}
          to={`/?filter=${filter}`}
        >
          {t(`filter.${filter}`)}
        </Link>
      ))}
    </nav>
  );
}
