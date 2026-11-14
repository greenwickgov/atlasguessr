# AtlasRush — GeoDuels UI fork

The actual GeoDuels source with an AtlasRush visual redesign inspired by the supplied purple geography-game references. This replaces the earlier independent AtlasRush prototype.

**Upstream:** https://github.com/sourcelocation/geoduels at `a3dde5b451bb0334bf18db6bcc4e1ff85086a05f`. **Licence:** AGPL-3.0-only. See [UPSTREAM.md](UPSTREAM.md), [LICENSE](LICENSE) and [the preserved original README](README.upstream.md).

## What changed

- Purple panels and starry backdrop across the original application.
- New AtlasRush wordmark, alpine hero and redesigned game-mode cards.
- Bold italic display type, rounded navigation, pill buttons and a purple timer accent.
- Bundled Sensa reaction illustrations in game chat and direct messages, retaining the original server emote IDs.
- Always-visible upstream/source credits and a `/source` page.

The original accounts, matchmaking, parties, community maps, rankings, scores and live game systems remain. Existing avatar/profile features remain; a new 3D character editor is not part of this UI-only fork.

## Run your source

Install Docker Desktop or Docker Engine with Compose. Extract this folder, then run from its root:

```sh
cp .env.example .env
# Edit .env as described below.
COMPOSE_PROFILES=app docker compose up -d --build
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
$env:COMPOSE_PROFILES='app'
docker compose up -d --build
```

Open **http://localhost:24000**. Leave `GEODUELS_VERSION` empty and use `--build` so Compose builds YOUR redesigned source rather than pulling an upstream release. The backend Dockerfiles generate required sqlc code and the migration service prepares the database. Postgres data persists in Docker volumes.

Set these `.env` values:

- `APP_AUTH_SECRET` and `COORDINATOR_INTERNAL_SECRET`: separate random values of at least 32 characters.
- `POSTGRES_PASSWORD`: your own database password.
- `GOOGLE_EMBED_KEY`: **leave blank**. Street View now uses Google Maps' public Share → Embed player, without a Google API key, Cloud project or billing setup. This is not the documented Maps Embed developer API.
- Google or Discord OAuth credentials for real registered accounts. See the provider callbacks/configuration in the original backend and documentation. Guest sessions use the original guest flow.
- `NEXT_PUBLIC_SITE_URL`: your actual origin.
- `NEXT_PUBLIC_SOURCE_URL`: the public repository containing this complete modified source.

Street View and the guess/results maps need **no Google API key or Google billing setup**. Accounts and live games still require the backend: **GitHub Pages alone cannot run this repository.** No credentials or existing users from geoduels.io are included.

For development (Go 1.26, Node 22, Overmind), see [README.upstream.md](README.upstream.md) and [docs/development.md](docs/development.md). The optional browser extension needs its own origin/build configuration when used with a different deployment. Upstream donation defaults are blank; the UI identifies upstream support links as belonging to the original project. Review and replace upstream operator-specific privacy/terms/contact details before public operation.

## GitHub

Upload this folder's contents as your repository source, including `.github`, `.env.example`, LICENSE and UPSTREAM.md. Do not commit your real `.env`. CI runs on `main` and `master`. Upstream release/deployment automation is guarded so a fork does not attempt to deploy into sourcelocation's operations repository.

## Validation

Completed: 129 frontend tests; strict frontend architecture check; TypeScript check; production Next.js build. The production frontend was visually reviewed with public data unavailable. Full Docker-backed matches were not exercised because Docker was not available. The public share iframe was separately tested live in a browser and displayed a navigable panorama without a key. No fake players or map activity were added.

```sh
npm --prefix web ci
npm --prefix web run lint:architecture:strict
npm --prefix web test
cd web
npx tsc --noEmit
npm run build
```

## Source rights

The original licence and source notices remain. Publish corresponding modified source when offering this modified app over a network, and set the source link for users. The full source ZIP includes the backend, frontend, map samples, extension, licence, original docs, and the AtlasRush UI edits. It excludes installed dependencies, build caches, local data and secrets.

## No Google API setup

The game now builds Google Maps **public share iframe** URLs from the existing panorama IDs. It does not call Google Maps JavaScript API, Google Maps Embed v1, Street View metadata APIs or panorama-discovery APIs. The live payload remains panorama-only: answer coordinates are not added or exposed for embedding. Guest play does not need OAuth credentials; registered Google/Discord sign-in still needs its own provider setup. The application's own HTTP API remains necessary for accounts and games.

Tested on 14 November 2026: a bundled Malaysian panorama rendered and provided Street View navigation in an iframe with no API key or billing account. The share URL format is not a stable documented developer contract; Google may change it, restrict it or remove individual panoramas. This does not guarantee all sample panoramas work. Maps must include valid, current panorama IDs.

The guess/results maps now use Leaflet with OpenStreetMap public tiles and visible attribution. This is suitable for development and modest use under the OSM tile policy, not an unlimited hosting guarantee: https://operations.osmfoundation.org/policies/tiles/. No tile scraping, bulk downloads, Google keys or billing workarounds are used. Google attribution remains inside the original iframe.
