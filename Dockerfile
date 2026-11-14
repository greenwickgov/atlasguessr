# syntax=docker/dockerfile:1.7
# Single-instance hosting: existing services keep their HTTP/socket contracts.
FROM golang:1.26.11-bookworm AS backend-build
WORKDIR /src
COPY backend/go.mod backend/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY backend/ ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go run github.com/sqlc-dev/sqlc/cmd/sqlc@v1.30.0 generate
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -o /out/api ./services/api && \
    CGO_ENABLED=0 go build -o /out/gameplay-node ./services/gameplay-node && \
    CGO_ENABLED=0 go build -o /out/gateway ./services/gateway && \
    CGO_ENABLED=0 go build -o /out/migrate ./cmd/migrate

FROM node:22.23.3-bookworm-slim AS web-build
WORKDIR /src/web
COPY web/package.json web/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY web/ ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SOURCE_URL=https://github.com/greenwickgov/atlasguessr
ENV NEXT_PUBLIC_APP_VERSION=atlasrush
RUN npm run build

FROM caddy:2.11.7-alpine AS proxy
FROM nats:2.11-alpine AS events
FROM node:22.23.3-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl tini \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend-build /out/ /app/bin/
COPY --from=proxy /usr/bin/caddy /app/bin/caddy
COPY --from=events /usr/local/bin/nats-server /app/bin/nats-server
COPY --from=web-build --chown=node:node /src/web/.next/standalone/ /app/web/
COPY --from=web-build --chown=node:node /src/web/.next/static/ /app/web/.next/static/
COPY --from=web-build --chown=node:node /src/web/public/ /app/web/public/
COPY maps/datasets/a-source-world.sample.json /app/maps/world.sample.json
COPY deploy/ /app/deploy/
RUN chmod +x /app/deploy/start.sh
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
ENV GOMAXPROCS=1 GOMEMLIMIT=64MiB
ENV NODE_OPTIONS=--max-old-space-size=192
ENV PORT=10000
USER node
EXPOSE 10000
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/app/deploy/start.sh"]
