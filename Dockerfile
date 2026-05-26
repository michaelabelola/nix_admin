FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY apps/admin/package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL=https://api.suiteonix.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY --from=deps /apps/node_modules ./node_modules
COPY apps/admin .

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

COPY apps/admin/package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /apps/dist ./dist
COPY --from=builder /apps/server.mjs ./server.mjs

EXPOSE 80

CMD ["bun", "server.mjs"]
