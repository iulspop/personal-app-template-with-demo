FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS development-dependencies-env
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm fetch
COPY package.json ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

FROM base AS production-dependencies-env
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm fetch --prod
COPY package.json ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod --ignore-scripts && pnpm rebuild better-sqlite3

FROM base AS build-env
WORKDIR /app
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY . ./
RUN pnpm build

FROM base
WORKDIR /app
COPY package.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/instrument.server.mjs ./
COPY --from=build-env /app/generated ./generated
COPY public ./public
COPY prisma ./prisma
COPY prisma.config.ts ./
CMD ["sh", "-c", "\
  LAST=$(cat /data/.last-deploy 2>/dev/null || echo ''); \
  if [ \"$FLY_IMAGE_REF\" != \"$LAST\" ]; then \
    node ./node_modules/prisma/build/index.js migrate deploy && \
    echo \"$FLY_IMAGE_REF\" > /data/.last-deploy; \
  fi && \
  NODE_OPTIONS='--import ./instrument.server.mjs' node ./node_modules/@react-router/serve/bin.js ./build/server/index.js"]
