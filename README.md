# Personal App Template (SQLite + Fly.io)

A production-ready template for building full-stack personal applications using React Router, SQLite, and Fly.io.

```bash
npx create-react-router@latest --template iulspop/personal-app-template-with-demo
```

## Tech Stack

- [React Router v8](https://reactrouter.com/) with SSR
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [vanilla-extract](https://vanilla-extract.style/) design tokens with dark mode
- [Base UI](https://base-ui.com/) primitives + [Tabler Icons](https://tabler.io/icons)
- [SQLite](https://www.sqlite.org/) via [Prisma](https://www.prisma.io/) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Infisical](https://infisical.com/) for configuration and secrets
- [Biome](https://biomejs.dev/) for linting and formatting
- [Vitest](https://vitest.dev/) for unit/integration/component tests
- [Playwright](https://playwright.dev/) for E2E tests
- [Lefthook](https://github.com/evilmartians/lefthook) + [Commitlint](https://commitlint.js.org/) for enforced commit conventions

## Features

- Magic link authentication with [TOTP](https://github.com/epicweb-dev/totp) verification codes
- Transactional emails with [Resend](https://resend.com/) (console fallback in dev)
- Todo CRUD as a reference feature implementation
- Content Security Policy with per-request nonces
- Optional product analytics and session replay with [PostHog](https://posthog.com/)
- Healthcheck endpoint (`/healthcheck`)
- Dark mode (OS `prefers-color-scheme`)
- Accessibility testing with [Axe](https://www.npmjs.com/package/@axe-core/playwright)
- CI/CD with GitHub Actions + auto-deploy to [Fly.io](https://fly.io/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 11+
- [Infisical CLI](https://infisical.com/docs/cli/overview)

### Infisical configuration

This template uses Infisical as the only source for app configuration and secrets. Do not create local `.env` files.

Create these secrets/config values in Infisical:

| Environment | Path |
|-------------|------|
| `dev` | `/web` |
| `staging` | `/web` |
| `prod` | `/web` |

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./prisma/dev.db` locally, `file:/data/sqlite.db` on Fly |
| `SESSION_SECRET` | Cookie signing secret | Generate a long random value |
| `RESEND_API_KEY` | [Resend](https://resend.com/) API key for emails | `re_...` |
| `EMAIL_FROM` | Sender address for emails | `noreply@example.com` |
| `APP_URL` | Public application URL for magic links | `http://localhost:5173` or Fly URL |
| `ALLOW_INDEXING` | Allow search engine indexing (`true`/`false`) | `false` for staging |
| `POSTHOG_API_KEY` | Optional PostHog project key | `phc_...` |
| `POSTHOG_API_HOST` | Optional PostHog API host | `https://us.i.posthog.com` |
| `FLY_API_TOKEN` | Fly deploy token for CI deploys | Stored in Infisical `prod` `/web` |

The repo still defensively ignores `.env*` files so secrets are not accidentally committed.

### Installation

```bash
pnpm install
```

### Quick Start

Run secret-dependent commands through Infisical:

```bash
pnpm secrets:dev pnpm prisma migrate dev
pnpm secrets:dev pnpm db:seed
pnpm dev:secrets
```

Your application will be available at `http://localhost:5173`.

### Demo Accounts

After seeding, you can log in with any of these emails (a TOTP code is logged to the console):

- `alice@example.com`
- `bob@example.com`
- `charlie@example.com`

## Architecture

This template follows a **hexagonal feature-slice architecture**. Each feature lives under `app/features/<name>/` with three layers:

```
app/features/<name>/
  domain/          # Pure types, functions, constants -- zero external imports
  infrastructure/  # Database facades, test factories -- Prisma only
  application/     # Actions, schemas, UI -- thin adapters mapping domain to web
```

**Import rules:**
- Domain files have zero imports (pure TypeScript only)
- Infrastructure imports only Prisma
- Application imports domain + infrastructure
- UI imports domain pure helpers but never model/action files

The `app/features/todos/` directory is a complete reference implementation of this pattern.

## Development

### Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev:secrets` | Start dev server with Infisical `dev` `/web` config |
| `pnpm build:secrets` | Production build with Infisical `dev` `/web` config |
| `pnpm start` | Start production server |
| `pnpm check` | Auto-fix lint/format issues (Biome) |
| `pnpm lint` | Check for lint/format errors without fixing (CI) |
| `pnpm typecheck:secrets` | Generate route types + TypeScript type check with Infisical config |
| `pnpm test:secrets` | Run Vitest tests once with Infisical config |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:e2e:secrets` | Run Playwright E2E tests with Infisical config |
| `pnpm test:e2e:ui` | Run Playwright with interactive UI |
| `pnpm secrets:dev <command>` | Run any command with Infisical `dev` `/web` config |
| `pnpm secrets:staging <command>` | Run any command with Infisical `staging` `/web` config |
| `pnpm secrets:prod <command>` | Run any command with Infisical `prod` `/web` config |

CI jobs load Infisical secrets through GitHub OIDC before running the standard `pnpm lint`, `pnpm typecheck`, `pnpm test`, and build commands.

### Database Scripts

| Script | Description |
|--------|-------------|
| `pnpm db:migrate:secrets -- <name>` | Create a new Prisma migration with Infisical config |
| `pnpm db:push:secrets` | Push schema to DB without a migration with Infisical config |
| `pnpm db:reset:secrets` | Wipe DB, re-run migrations, push schema, and re-seed with Infisical config |
| `pnpm db:seed:secrets` | Seed database with demo data with Infisical config |
| `pnpm db:studio:secrets` | Open Prisma Studio GUI with Infisical config |
| `pnpm db:migrate:prod:secrets` | Run production migrations with Infisical `prod` `/web` config |

### Security

**Content Security Policy (CSP):**
- Report-only mode in development and test
- Enforced in production
- All inline scripts require a valid nonce

**ALLOW_INDEXING:**
- Set to `"false"` on staging/preview to prevent search engine indexing
- Adds both `X-Robots-Tag` header and `<meta name="robots">` tag

### Testing

Tests are organized in three tiers:

1. **Unit tests** (`*.test.ts`) -- pure domain functions, colocated in `domain/`
2. **Component tests** (`*.test.tsx`) -- React rendering tests via Testing Library + happy-dom
3. **Integration tests** (`*.spec.ts`) -- database facade tests against real SQLite
4. **E2E tests** (`playwright/e2e/*.e2e.ts`) -- full browser tests with Playwright

Test names follow: `given: <precondition>, should: <expected behavior>`.

Run the full suite locally with Infisical:

```bash
pnpm test:secrets && pnpm test:e2e:secrets
```

### Linting and Formatting

This project uses [Biome](https://biomejs.dev/) (configured in `biome.json`). Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for auto-formatting on save.

```bash
pnpm check   # auto-fix
pnpm lint     # check only (CI)
```

### Git Hooks (Lefthook)

- **Pre-commit:** `biome check --write --staged` + `pnpm typecheck`
- **Commit-msg:** Commitlint (conventional commits with required scope)

## Building for Production

```bash
pnpm build:secrets
```

## Deployment

### Fly.io (Default)

This template is configured for Fly.io with a persistent SQLite volume.

**First deploy:**

```bash
./scripts/deploy.sh
```

The deploy script is idempotent: it creates the app and volume if they don't exist, imports production `/web` secrets from Infisical into Fly, and deploys.

**GitHub Actions deploys** use the official Infisical action with OIDC. Configure these non-secret repository variables:

```bash
gh variable set INFISICAL_IDENTITY_ID --body <identity-id>
gh variable set INFISICAL_PROJECT_SLUG --body <project-slug>
```

Store the Fly deploy token in Infisical `prod` `/web` as `FLY_API_TOKEN`:

```bash
flyctl tokens create deploy --app personal-app-template-sqlite-fly-io
```

### CI/CD

**Pull Request workflow** (`.github/workflows/pr.yml`) runs on all PRs:

1. Commitlint
2. Biome lint
3. TypeScript type check
4. Vitest (unit + integration + component with coverage)
5. Playwright Chrome (E2E)

**CI workflow** (`.github/workflows/ci.yml`) runs on pushes to `main`/`dev`.

**Deploy workflow** (`.github/workflows/deploy.yml`) auto-deploys to Fly.io when CI passes on `main`.

### Docker

To build and run locally:

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

The multi-stage Dockerfile uses Node 22 Alpine with pnpm and can be deployed to any Docker-compatible platform. On Fly.io, run production migrations manually on the app machine after deploy so the mounted `/data` SQLite volume is available:

```bash
flyctl ssh console --app personal-app-template-sqlite-fly-io -C "sh -lc 'cd /app && pnpm db:migrate:prod'"
```

## AI-Driven Development

This template leverages **AI-Driven Development (AIDD)**, where you steer high-level design and let AI generate the bulk of your implementation via [**SudoLang**](https://github.com/paralleldrive/sudolang-llm-support), a natural-language-style pseudocode that advanced LLMs already understand.

### Claude Code Skills

Under `.claude/commands/`, you'll find ready-to-use slash commands:

- **/better-writer** - Improves writing clarity and engagement using Scott Adams' rules.
- **/brainstorm** - Helps ideate solutions with clear trade-offs and recommendations.
- **/commit** - Commits changes using conventional commit format.
- **/debug** - Provides systematic debugging with root cause analysis.
- **/documentation** - Creates clear, example-first documentation.
- **/log** - Logs completed epics to CHANGELOG.md with emoji system.
- **/name** - Suggests clear, descriptive names for functions and variables.
- **/plan** - Breaks down complex requests into manageable, sequential tasks.
- **/svg-to-react** - Converts SVG files into optimized React components.
- **/unit-tests** - Generates thorough, readable unit tests using Vitest.
- **/write** - Produces clear, concise business writing with specific style guidelines.

Learn more about AIDD and SudoLang in [The Art of Effortless Programming](https://leanpub.com/effortless-programming) by [Eric Elliott](https://www.threads.com/@__ericelliott).

## Maintenance

Check for dependency updates:

```bash
npx npm-check-updates -u
```

Static analysis and tests will catch breakages from upgrades.
