# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## AI-Driven Development

This template leverages **AI-Driven Development (AIDD)**, where you steer high-level design and let AI generate the bulk of your implementation via [**SudoLang**](https://github.com/paralleldrive/sudolang-llm-support), a natural-language-style pseudocode that advanced LLMs already understand.

### CLAUDE.md

Project-level coding standards loaded automatically every Claude Code session. Consolidates JavaScript/TypeScript principles (DOT, YAGNI, KISS, DRY, SDA), functional programming constraints, React/React Router V7 patterns, component naming, TypeScript type guidance (including Prisma types), i18n conventions, and facade function naming for `*-model.server.ts` files.

### Claude Code skills

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

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
