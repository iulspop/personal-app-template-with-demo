import * as Sentry from "@sentry/react-router"
import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

Sentry.init({
  dsn: window.ENV?.SENTRY_DSN,
  integrations: [Sentry.reactRouterTracingIntegration()],
  tracesSampleRate: 1.0,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
