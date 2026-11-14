#!/bin/bash
set -Eeuo pipefail

: "${POSTGRES_URL:?POSTGRES_URL is required}"
: "${APP_AUTH_SECRET:?APP_AUTH_SECRET is required}"
: "${COORDINATOR_INTERNAL_SECRET:?COORDINATOR_INTERNAL_SECRET is required}"
export SITE_URL="${SITE_URL:-${RENDER_EXTERNAL_URL:-}}"
: "${SITE_URL:?SITE_URL or RENDER_EXTERNAL_URL is required}"
export CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-$SITE_URL}"
export TRUSTED_PROXY_CIDRS="127.0.0.0/8,::1/128"
export POSTGRES_MAX_CONNS="${POSTGRES_MAX_CONNS:-8}"
export API_ADDR=127.0.0.1:8080
export API_URL=http://127.0.0.1:8080
export GATEWAY_ADDR=127.0.0.1:8095
export GAMEPLAY_NODE_ADDR=127.0.0.1:8091
export GAMEPLAY_INTERNAL_URL=http://127.0.0.1:8091
export GAMEPLAY_DRAIN_TIMEOUT=20s
export NATS_URL=nats://127.0.0.1:4222
# A new installation has no imported maps. Seed the included small sample only
# when the original backend finds a required map missing; never replace imports.
export DEV_MAP_DATASET="${DEV_MAP_DATASET:-/app/maps/world.sample.json}"

pids=()
shutdown() {
    trap - EXIT INT TERM
    if ((${#pids[@]})); then
        kill -TERM "${pids[@]}" 2>/dev/null || true
        wait "${pids[@]}" 2>/dev/null || true
    fi
}
trap shutdown EXIT
trap 'exit 0' TERM INT

start() {
    "$@" &
    pids+=("$!")
}

ready() {
    local label="$1" url="$2"
    for ((attempt=0; attempt<90; attempt++)); do
        # A failed child aborts startup instead of leaving a half-working site.
        for pid in "${pids[@]}"; do
            if ! kill -0 "$pid" 2>/dev/null; then
                echo "A service exited while starting $label" >&2
                return 1
            fi
        done
        if curl --fail --silent --max-time 2 "$url" >/dev/null; then
            return 0
        fi
        sleep 1
    done
    echo "Timed out waiting for $label" >&2
    return 1
}

echo "Applying database migrations"
/app/bin/migrate
start /app/bin/nats-server -c /app/deploy/nats.conf
ready events http://127.0.0.1:8222/healthz
start /app/bin/gameplay-node
ready gameplay http://127.0.0.1:8091/health/ready
start /app/bin/api
ready api http://127.0.0.1:8080/health/ready
start /app/bin/gateway
ready gateway http://127.0.0.1:8095/health/ready
start env PORT=3000 HOSTNAME=127.0.0.1 node /app/web/server.js
ready web http://127.0.0.1:3000/
start /app/bin/caddy run --config /app/deploy/Caddyfile --adapter caddyfile
echo "AtlasRush services started"

# Restart the complete unit if any required process stops, including exit 0.
set +e
wait -n "${pids[@]}"
status=$?
set -e
echo "A required service exited (status $status); stopping the instance" >&2
exit 1
