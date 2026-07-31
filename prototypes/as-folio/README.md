# Yuhang Shen · as-folio redesign

This is the selected local **as-folio** redesign for Yuhang Shen's bilingual academic
homepage. It is intentionally not connected to the production GitHub Pages site.

## Routes

- `/` and `/zh/` — English and Chinese profile pages
- `/research/` and `/zh/research/` — doctoral program, advisors, research directions,
  and education
- `/research/openraas-thesis/` and `/zh/research/openraas-thesis/` — bilingual
  master's-thesis story with OpenRaaS, FogCom, and CNKI links
- `/publications/` and `/zh/publications/`
- `/projects/` and `/zh/projects/`
- `/blog/` and `/zh/blog/` — in-site blog skeletons
- `/owner/` and `/zh/owner/` — security-only placeholders

English is the default language. Each core page has a route-level counterpart and a
language switch that preserves the current section.

## Local development

The source tree is cloud-synced, so do **not** install dependencies or build inside this
directory. Keep `node_modules`, `.astro`, `dist`, and package caches in an approved local
scratch workspace. The current task uses:

```text
E:\Codex\workspaces\local-windows\homepage\content-refresh\20260728\asfolio
```

From that runtime copy:

```bash
corepack yarn install --immutable
corepack yarn dev --host 127.0.0.1 --port 4321
corepack yarn test:types
corepack yarn lint:ci
corepack yarn test
corepack yarn build
corepack yarn check:routes
```

## Content boundary

Only confirmed public profile details, publications, and repositories are shown. The owner
page deliberately stores no IP address, port, hostname, credential, or private network
detail. It does not pretend that a client-side password can protect GitHub Pages.

## Attribution

See [UPSTREAM.md](UPSTREAM.md) and [LICENSE](LICENSE).
