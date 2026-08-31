# Notes for agents

- Static Vite + React + TS portfolio site. No backend, no database, no external credentials
  (`@supabase/supabase-js` is a leftover dependency, unused in `src/`).
- Dev env: `docker compose -f docker-compose.base44.yml up -d` — Vite dev server on host port 3000.
- `vite.config.ts` sets `server.host: true` / `allowedHosts: true` so the proxied preview host works.
- Deps live in a named volume (`node_modules`); after changing package.json run
  `docker compose -f docker-compose.base44.yml restart web` to reinstall.
- Verify: `npm run typecheck`, `npm run lint`, and curl `/` with a foreign Host header.
