# VISP SRT Relay Service

VISP is a self-service SRT/RTMP relay for a small group of trusted Twitch
streamers. It runs as two boxes:

- **Relay:** MediaMTX, Caddy, and Tailscale.
- **App:** PostgreSQL, Elysia/tRPC API, TanStack Start portal, Caddy, and
  Tailscale.

Users sign in with Twitch, create independently revocable publishing devices,
measure relay latency, and download an OBS scene collection. Publish URLs are
encrypted for authenticated re-reveal and retain Argon2id hashes for relay
authentication; account-wide read credentials remain one-time rotation results.
The dashboard also shows one private, minute-updated snapshot for each live
publishing path.

## Development

Requirements: Bun 1.3+, PostgreSQL, and a Twitch application.

```bash
bun install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
bun run db:migrate
bun run dev
```

Configure the Twitch callback URL as:

```text
http://localhost:3000/api/auth/callback/twitch
```

The portal runs at <http://localhost:3001> and the API at
<http://localhost:3000>. A reachable relay `/ping` endpoint is required for the
browser RTT probe; use the values in the example environment files.

## Verification

```bash
bun test
bun run check-types
bun run build
```

PostgreSQL-backed machine-auth, hook, reconciliation, cache-invalidation, and
concurrent path-allocation tests use a disposable Docker database:

```bash
bun run test:integration
```

## Project layout

```text
apps/server       Elysia server, Better Auth, tRPC, and machine endpoints
apps/web          TanStack Start portal
apps/fumadocs     Broadcaster and operator documentation
packages/api      Relay domain logic and tRPC routers
packages/auth     Twitch-only Better Auth configuration
packages/db       Drizzle schema and forward migrations
packages/env      Validated server and browser environments
packages/ui       Shared shadcn/ui primitives
deploy            MediaMTX, Caddy, systemd, and two-box setup templates
```

## Deployment

Follow [deploy/README.md](deploy/README.md). It covers the pinned MediaMTX
binary and checksum, static-auth bootstrap test, final HTTP authentication,
Tailscale/firewall rules, systemd services, rollout order, and acceptance smoke
test.

The intentional v1 outage behavior is that established streams survive an app
outage while new publish/read connections fail authentication.

## Scope

VISP v1 has no transcoding, Twitch stream-key handling, hosted OBS, billing,
quotas, or horizontal scaling. MediaMTX accepts one publisher per path; the
first publisher remains connected and later publishers are rejected.
