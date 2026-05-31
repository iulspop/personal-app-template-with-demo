import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

import { createAnalyticsConfig } from "./utils/analytics"
import { initAnalytics } from "./utils/analytics.client"

initAnalytics(
  createAnalyticsConfig({
    apiHost: window.ENV?.POSTHOG_API_HOST,
    apiKey: window.ENV?.POSTHOG_API_KEY,
    mode: window.ENV?.MODE,
  }),
)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
