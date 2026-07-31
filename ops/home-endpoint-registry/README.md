# Home Endpoint Registry Publisher

This service preserves the existing "home machine discovers its public address and pushes to Git" model while removing live addresses from the public website source. It publishes one encrypted artifact, `endpoint.enc.json`, at the root of a dedicated public registry repository. The owner page downloads that artifact and decrypts it locally with the same owner-access password.

The publisher is intentionally small: it uses Node.js built-ins for HTTP, PBKDF2, AES-GCM, JSON validation, and atomic files. The container adds only Git, OpenSSH, CA certificates, and `tini`; there are no npm runtime dependencies and no inbound ports.

## Security boundary

- Git is an address registry, not a reverse proxy, firewall, or authentication service.
- The public artifact exposes only a versioned KDF/cipher envelope and ciphertext. Service IDs, bilingual labels and descriptions, addresses, ports, paths, publication time, and expiry are encrypted.
- The browser password is never sent to GitHub or the publisher. The publisher reads it from a mode-`0600`, read-only bind mount.
- AES-256-GCM detects both a wrong password and artifact tampering. A fresh 16-byte salt and 12-byte IV are generated for every publication.
- Public ciphertext permits offline password guessing. Prefer a long, unique password and keep authentication enabled on every home service. Do not reuse an appliance or administrator password.
- The write-enabled deploy key belongs only to the dedicated registry repository. Keep that key out of the homepage checkout and every other container.

## Published contract

The plaintext is validated before encryption:

```json
{
  "version": 1,
  "publishedAt": "ISO-8601 timestamp",
  "expiresAt": "ISO-8601 timestamp",
  "services": [
    {
      "id": "private-service-id",
      "url": "rendered HTTPS URL",
      "label": { "en": "English label", "zh": "中文标签" },
      "description": { "en": "English description", "zh": "中文说明" }
    }
  ]
}
```

The public envelope is:

```json
{
  "version": 1,
  "kdf": {
    "name": "PBKDF2",
    "hash": "SHA-256",
    "iterations": 600000,
    "salt": "base64"
  },
  "cipher": {
    "name": "AES-GCM",
    "iv": "base64",
    "tagLength": 128
  },
  "ciphertext": "base64 ciphertext followed by the 16-byte authentication tag"
}
```

Unknown fields, duplicate service IDs, plain HTTP or other unsafe URL schemes, URLs containing credentials, non-public discovery results, invalid bilingual text, excessive lifetimes, and weak KDF parameters are rejected. The default authenticated lifetime is 24 hours and may never exceed 48 hours.

## Private configuration

Create the private directory on the Ubuntu host; it is excluded from both the Git build context and source control:

```bash
install -d -m 700 secrets
install -m 600 config/services.example.json secrets/services.json
cp .env.example .env
chmod 600 .env
```

Edit `secrets/services.json`. Each enabled service carries its private ID, bilingual label and description, plus an explicit URL template containing exactly one `{publicIPv4}` placeholder. Ports and paths belong only in this private file. A rendered URL must point directly to the discovered address over HTTPS; templates cannot redirect the address into another host, username, or password field. Metadata is bounded, control-character-free plain text and the owner page must insert it with text-only DOM APIs.

The committed example deliberately contains no real endpoint. Disabled entries are validated but not published.

## Deploy key and host verification

Generate a new key used only by this publisher:

```bash
ssh-keygen -t ed25519 -f secrets/registry_deploy_key -C home-endpoint-publisher
chmod 600 secrets/registry_deploy_key
```

Add only the `.pub` file as a write-enabled deploy key on the registry repository. Never reuse an account-level key and never copy the private key into an image.

Create a pinned host-key file for the Git server and verify its fingerprint using the provider's published documentation before trusting it:

```bash
ssh-keyscan -t ed25519 <git-host> > secrets/known_hosts
chmod 600 secrets/known_hosts
```

The committed `.env.example` points to the dedicated registry repository and its `main` branch. The publisher refuses HTTP remotes, interactive credential prompts, unknown SSH hosts, repository contents other than the encrypted artifact, a changed remote URL, or divergent history. If `main` does not yet exist, the first successful push creates it with only `endpoint.enc.json`.

## Initial password and first publication

After the service configuration, deploy key, known-hosts file, and `.env` are ready, initialize or replace the shared owner-access password interactively:

```bash
chmod +x scripts/reset-password.sh
./scripts/reset-password.sh
```

The script hides both entries, requires confirmation, stops a running publisher, saves the previous secret in a private same-directory backup, atomically installs the new mode-`0600` file, and performs a forced one-shot publication. It uses `shred` when available (with removal fallback), recreates the daemon so its file bind mount sees the new inode, and restores the previous running state only after success. On failure it atomically restores the old secret, forces a rollback publication, and restarts the prior daemon; a durable retry flag covers an interrupted rollback. The password is never passed as an argument or environment variable.

For a controlled bootstrap, `--password-file /path/to/mode-0600-input` reads a single-line secret from a private regular file; only the file path appears in the process arguments. Securely remove that input file after the transaction. Interactive use remains the normal reset path.

## Daemon operation

Build and start the service:

```bash
docker compose up -d --build publisher
docker compose ps publisher
docker compose logs --tail 50 publisher
```

`NODE_IMAGE` defaults to the official Docker Library `node:24-alpine` image. If the host cannot reach Docker Hub, set it in the private `.env` to an equivalent trusted mirror reference, preferably pinned by digest; this changes only the build source and is passed as a Docker build argument.

The default poll is ten minutes. Four independent HTTPS providers are queried in parallel with bounded timeouts; at least two must agree on the same globally routable IPv4 address. Provider responses are never logged. Unchanged polls create no commit, but a six-hour authenticated heartbeat deliberately re-encrypts and republishes with a fresh salt, IV, `publishedAt`, and `expiresAt`. `HOME_HEARTBEAT_HOURS` may be shortened; it must remain strictly below `HOME_REGISTRY_TTL_HOURS`, whose default is 24 and hard maximum is 48.

Run an ordinary one-shot cycle:

```bash
docker compose exec -T publisher node src/cli.mjs once
```

Force a fresh salt, IV, ciphertext, commit, and push even when the address is unchanged:

```bash
docker compose exec -T publisher node src/cli.mjs once --force
```

For a stopped service, the equivalent ephemeral command is:

```bash
docker compose run --rm publisher once --force
```

The container exposes no ports, runs as a non-root user, drops all Linux capabilities, uses a read-only root filesystem and `no-new-privileges`, bounds processes/memory/CPU, and rotates logs. Only the named `/state` volume and a small tmpfs are writable. Health becomes unhealthy after a stale heartbeat or three consecutive failures; an isolated provider failure does not immediately restart or overwrite a known-good registry.

## Password reset

Run the same interactive script at any time:

```bash
./scripts/reset-password.sh
```

It performs the stop, remount, forced publication, rollback protection, and restart as one transaction. The website needs no rebuild: the new password works after the new ciphertext reaches the registry, and the old password stops decrypting it.

## Failure and recovery behavior

- Registry writes use `fsync` plus same-directory atomic rename; partially written public JSON is never intentional.
- A private state hash avoids periodic no-op commits. It contains no endpoint data and is updated only after a successful push.
- The last successful publication time is persisted privately. The owner page rejects an expired payload (and timestamps too far in the future), so a failed publisher eventually removes stale dynamic-IP links instead of keeping a recycled address usable.
- A push interrupted after commit is retried on the next cycle. Publisher-created ahead commits require matching pending state; unexpected local commits stop publication.
- Pending state binds the private payload fingerprint to the exact Git blob object. A crash before commit cannot promote an orphan fingerprint, while a committed-but-unpushed blob is verified, pushed, and only then promoted.
- Remote fast-forwards are accepted. Divergence, unexpected files, dirty worktree state, or a changed remote stops publication rather than resetting or force-pushing.
- The publisher never deletes the remote branch and never force-pushes.

During migration, keep the legacy updater available but do not let both systems mutate the same page contract. Verify that the dedicated repository contains valid ciphertext, the website can decrypt it, expiry fails closed, and a forced password rotation plus rollback works before stopping the old updater.

## Local verification

Node.js tests use only operating-system temporary directories and local bare Git repositories:

```bash
node --check src/cli.mjs
node --check src/healthcheck.mjs
node --test
```

No dependency installation is required. `test/fixtures/interop-envelope-v1.json` is a deterministic, synthetic cross-implementation fixture produced by `scripts/generate-interop-fixture.mjs`; its test-only passphrase and invalid example endpoint are unrelated to deployment secrets. Production publications always use fresh cryptographic randomness.
