# Yuhang Shen — Academic Homepage

Source for [coolmoon327.github.io](https://coolmoon327.github.io/), a bilingual academic homepage built with Astro. English is the default language; the main profile, research, publications, projects, games, blog, and owner pages all have Chinese counterparts.

## Site map

- `/` and `/zh/` — academic profile and current highlights
- `/research/` and `/zh/research/` — doctoral programme, advisors, research themes, and academic background
- `/research/openraas-thesis/` and `/zh/research/openraas-thesis/` — the OpenRaaS and FogCom research lineage, including the master's thesis record
- `/publications/` and `/zh/publications/` — published and accepted work, with careful status labels
- `/projects/` and `/zh/projects/` — selected research software and systems work
- `/playground/` and `/zh/playground/` — eight small, bilingual, dependency-free browser games (`/games/` aliases are retained)
- `/blog/` and `/zh/blog/` — the in-site writing area
- `/owner/` and `/zh/owner/` — a private-link directory backed by a separately published encrypted registry

## Repository layout

```text
.
├── .github/workflows/          # CI and GitHub Pages deployment
├── ops/home-endpoint-registry/ # independent encrypted endpoint publisher
├── public/                     # static assets and pocket games
├── scripts/                    # route and game integrity checks
├── src/
│   ├── components/             # Astro and React UI components
│   ├── config/site.ts          # bilingual public profile content
│   ├── content/                # future long-form content collections
│   ├── pages/                  # English and Chinese routes
│   ├── styles/                 # shared design system
│   └── utils/                  # parsing, routing, and owner-access utilities
└── astro.config.mjs
```

The old generated HTML homepage and its Git-pushing IP updater are intentionally not part of the production tree. Home endpoint publication is isolated under `ops/home-endpoint-registry/` so it cannot mutate the website source or deployment branch.

## Local development

Requirements:

- Node.js 24 or newer
- Corepack with Yarn 4

```bash
corepack enable
yarn install --immutable
yarn dev --host 127.0.0.1 --port 4321
```

When the checkout lives in OneDrive, iCloud Drive, or another synchronised folder, use a disposable local copy for dependency installation and builds. Keep `node_modules`, `.astro`, `dist`, test output, and package caches outside the synchronised source tree.

## Quality gates

Run the complete source validation before committing:

```bash
yarn validate
yarn build
```

`yarn validate` performs Astro and TypeScript checks, linting, static game checks, and unit tests. To validate generated routes, start the production preview and run the route probe in another terminal:

```bash
yarn preview --host 127.0.0.1 --port 4321
yarn check:routes http://127.0.0.1:4321
```

The endpoint publisher has no npm runtime dependencies and has its own tests:

```bash
cd ops/home-endpoint-registry
node --check src/cli.mjs
node --check src/healthcheck.mjs
node --test
```

## Deployment

GitHub Actions validates and deploys every push to `master` through the GitHub Pages artifact workflow. The user-page defaults are already configured in `astro.config.mjs`; optional repository variables can override them:

- `ASTRO_SITE` — canonical site origin
- `ASTRO_BASE` — base path for a project-page deployment; empty for this user page

The build workflow has read-only repository access. It never commits generated files back to `master`.

## Owner access boundary

GitHub Pages remains a static public site. The owner page downloads an encrypted, expiring registry artifact and decrypts it locally in the browser; neither the password nor plaintext service directory is stored in this repository. This mechanism is an address directory, not a reverse proxy or a substitute for authentication on the destination services.

Deployment and password-rotation instructions for the publisher are documented in [`ops/home-endpoint-registry/README.md`](ops/home-endpoint-registry/README.md). Never commit real endpoints, passwords, deploy keys, private hostnames, or private network details.

## Attribution and licence

The visual foundation is derived from the MIT-licensed [as-folio](https://github.com/dadangnh/as-folio) theme. Exact upstream and asset provenance is recorded in [UPSTREAM.md](UPSTREAM.md); the preserved licence is in [LICENSE](LICENSE).
