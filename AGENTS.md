# Homepage implementation notes

- This directory is a cloud-synced source deliverable, never a build workspace.
- Keep dependencies, caches, `.astro`, `dist`, and browser profiles in a disposable local
  workspace outside cloud-synchronised source trees.
- English is the default route; every core English page has a `/zh/` counterpart.
- Keep all user-visible copy in `src/config/site.ts`.
- Never add a private IP address, port, hostname, credential, NAS detail, or fake
  client-side password gate.
- Only add profile facts, publications, or affiliations after they are confirmed.
- Preserve `LICENSE` and update `UPSTREAM.md` when the upstream theme or asset provenance
  changes.
- Use Yarn 4 through Corepack and verify `corepack yarn build` before handoff.
