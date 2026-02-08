import { data } from "react-router";

import type { Route } from "./+types/api.locales.$lng.$ns";
import resources from "~/features/localization/locales";

export async function loader({ params }: Route.LoaderArgs) {
  const { lng, ns } = params;

  if (!(lng in resources)) {
    return data({ error: "Invalid language" }, { status: 400 });
  }

  const namespaces = resources[lng as keyof typeof resources];

  if (!(ns in namespaces)) {
    return data({ error: "Invalid namespace" }, { status: 400 });
  }

  const headers = new Headers();

  if (process.env.NODE_ENV === "production") {
    headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800",
    );
  }

  return data(namespaces[ns as keyof typeof namespaces], { headers });
}
