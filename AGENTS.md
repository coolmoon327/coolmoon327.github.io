# Homepage implementation notes

- The canonical cloud-synced checkout is a source-delivery tree, never a build workspace.
- Keep dependencies, caches, `.astro`, `dist`, and browser profiles out of that canonical
  delivery tree. Builds are allowed in an independent disposable clone on local scratch storage,
  including an E-drive scratch clone created from the canonical source.
- English is the default route; every core English page has a `/zh/` counterpart.
- Keep all user-visible copy in `src/config/site.ts`.
- Never add a private IP address, port, hostname, credential, NAS detail, or fake
  client-side password gate.
- Only add profile facts, publications, or affiliations after they are confirmed.
- Preserve `LICENSE` and update `UPSTREAM.md` when the upstream theme or asset provenance
  changes.
- Use Yarn 4 through Corepack and verify `corepack yarn build` before handoff.
