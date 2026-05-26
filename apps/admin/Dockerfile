FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/customer/package.json apps/customer/package.json
COPY packages/components/package.json packages/components/package.json
COPY packages/data/package.json packages/data/package.json
COPY packages/lib/package.json packages/lib/package.json
COPY packages/models/package.json packages/models/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN bun install --frozen-lockfile

FROM deps AS builder

ARG VITE_API_BASE_URL=https://api.suiteonix.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .

RUN bun --filter @suiteonix/admin build

FROM oven/bun:1-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

WORKDIR /app/apps/admin

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/bun.lock /app/
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/admin/package.json ./package.json
COPY --from=builder /app/apps/admin/server.mjs ./server.mjs
COPY --from=builder /app/apps/admin/dist ./dist

EXPOSE 80

CMD ["bun", "server.mjs"]
