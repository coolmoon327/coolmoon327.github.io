# Home Endpoint Registry Publisher

This service preserves the existing "home machine discovers its public address and pushes to Git" model while removing live addresses from the public website source. It publishes one encrypted artifact, `endpoint.enc.json`, at the root of a dedicated public registry repository. The owner page downloads that artifact and decrypts it locally with the same owner-access password.

The publisher is intentionally small: it uses Node.js built-ins for HTTP, PBKDF2, AES-GCM, JSON validation, and atomic files. The container adds only Git, OpenSSH, CA certificates, and `tini`; there are no npm runtime dependencies and no inbound ports.

## Security boundary

- Git is an address registry, not a reverse proxy, firewall, or authentication service.
- The public artifact exposes only a versioned KDF/cipher envelope and ciphertext. Service IDs, bilingual labels, descriptions and access notices, access classifications, addresses, ports, paths, publication time, and expiry are encrypted.
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
      "url": "rendered HTTPS URL or restricted legacy private HTTP URL",
      "label": { "en": "English label", "zh": "中文标签" },
      "description": { "en": "English description", "zh": "中文说明" },
      "access": "internet | home-or-tailnet",
      "notice": { "en": "English access note", "zh": "中文访问提示" }
    }
  ]
}
```

`access` and `notice` are optional version 1 fields. A legacy payload without them remains valid and is interpreted by the website as `internet` access with no notice. New publisher output includes the access classification, and includes `notice` only when the private configuration defines one. The website groups services and renders badges and notices only after successful decryption.

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

Unknown fields, duplicate service IDs, unsafe URL schemes, URLs containing credentials, invalid fixed-address ranges, non-public discovery results, invalid bilingual text, excessive lifetimes, and weak KDF parameters are rejected. Plain HTTP is rejected except for the narrowly scoped legacy-private exception below. The default authenticated lifetime is 24 hours and may never exceed 48 hours.

## Private configuration

Create the private directory on the Ubuntu host; it is excluded from both the Git build context and source control:

```bash
install -d -m 700 secrets
install -m 600 config/services.example.json secrets/services.json
cp .env.example .env
chmod 600 .env
```

Edit `secrets/services.json`. Each enabled service carries its private ID, bilingual label and description, plus exactly one URL locator:

- `urlTemplate` is the existing dynamic-public-address form. It contains exactly one `{publicIPv4}` placeholder and defaults to `access: "internet"`.
- `fixedUrl` is for a private-network or Tailnet entry. It must contain no username or password, use a canonical literal IPv4 address in RFC1918 or the CGNAT/Tailscale `100.64.0.0/10` range, and explicitly set `access: "home-or-tailnet"`. HTTPS is the default and strongly preferred. Loopback, hostnames, public addresses, and ambiguous numeric forms are rejected.
- A legacy `http://` `fixedUrl` is accepted only when the bilingual `notice` explicitly says both that access is restricted to the home network or Tailscale and that legacy HTTP is unencrypted or carries interception risk. Both language variants are validated. This exception never applies to `urlTemplate`; dynamic public entries remain HTTPS-only.

The fixed form is schematically:

```json
{
  "id": "private-service",
  "fixedUrl": "https://<private-or-tailnet-ip>/<optional-path>",
  "label": { "en": "Private service", "zh": "私有服务" },
  "description": { "en": "Private entry point.", "zh": "私有入口。" },
  "access": "home-or-tailnet",
  "notice": {
    "en": "Private access instructions stored only inside ciphertext.",
    "zh": "仅保存在密文中的私有访问说明。"
  }
}
```

Replace the angle-bracket placeholders in the private file; the schematic block is not a directly valid service entry. Ports, paths, account-specific access instructions, and any private endpoint details belong only in `secrets/services.json`. `notice` is optional, but when present must contain both English and Chinese text. Metadata is bounded, control-character-free plain text and the owner page inserts every decrypted field with text-only DOM APIs.

A legacy HTTP entry follows the same private-address rules and must carry the explicit warning:

```json
{
  "id": "legacy-private-service",
  "fixedUrl": "http://<private-or-tailnet-ip>/<optional-path>",
  "label": { "en": "Legacy service", "zh": "旧版服务" },
  "description": { "en": "Legacy private entry.", "zh": "旧版私有入口。" },
  "access": "home-or-tailnet",
  "notice": {
    "en": "Use only on the home network or through Tailscale. Legacy HTTP is unencrypted and carries interception risk.",
    "zh": "仅可在家中网络内或通过 Tailscale 访问。旧版 HTTP 未加密，存在被窃听的风险。"
  }
}
```

This exception hides the endpoint and warning inside authenticated ciphertext, but it does not encrypt traffic between the browser and the legacy service. Keep the service's own authentication enabled and migrate it behind private HTTPS when practical.

The committed example deliberately contains no real endpoint. Disabled entries are validated but not published.

Validate a private service catalog with the exact publisher release before installing it:

```bash
node src/validate-services.mjs /path/to/services.json
```

The command prints only a generic result and the service count; it never prints endpoint details.

After the publisher image has been built, install a revised private catalog with the transactional updater instead of replacing `secrets/services.json` by hand:

```bash
chmod +x scripts/update-services.sh
./scripts/update-services.sh --services-file /path/to/mode-0600-services.json
```

The updater requires GNU `flock` and `timeout`. It holds one non-blocking host lock across candidate validation, catalog replacement, encrypted publication, and container-state restoration; the password-reset workflow uses the same lock, so the two publisher mutations cannot interleave. Docker operations are bounded by a 180-second timeout by default (`HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS`, maximum 3600). Catchable signals received inside the transaction are recorded and returned as exit status 130 only after a consistent catalog, registry, and container state has been reached. Transactional one-shot publications use a fixed administrative container name; after any timeout or failure, the script explicitly removes and rechecks that container before it permits rollback publication or restarts the persistent daemon.

The updater first copies the candidate into the private `secrets/` directory and validates it inside the exact publisher image with no network, a read-only filesystem, dropped capabilities, and bounded resources. The validation process uses the candidate file's actual host UID/GID, so its mode-`0600` permissions remain effective without assuming UID 1000. Only a valid catalog can proceed. It then preserves the current catalog as mode-`0600` `secrets/services.json.previous`, removes any existing publisher container, atomically installs the candidate, and forces a one-shot encrypted publication. A running or restarting daemon is recreated and started; a paused daemon is recreated, started, and paused again; an exited or created daemon is recreated without starting; an absent daemon remains absent. This guarantees that no retained container can later reopen the old bind-mount inode. Ambiguous, dead, removing, or unknown container states fail closed before replacement.

If publication fails, the previous catalog is atomically restored and republished before the prior container state is restored. If both publication attempts fail, a previously running daemon can retry the restored catalog; when the daemon was intentionally stopped or absent, the script explicitly requires an operator one-shot retry instead of claiming automatic recovery. A failure that occurs after the new ciphertext was published but while the prior daemon state is being restored leaves the new catalog and ciphertext intact and reports only the state-restoration failure. Neither validation nor publication logs endpoint details.

`secrets/services.json.previous` supports a deliberate rollback through the same validated path. It remains excluded from Git and the Docker build context; remove it securely after the new directory has been accepted and no rollback is required.

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

The script hides both entries, requires confirmation, and accepts only a password containing 16-1024 Unicode characters that is not numeric-only. It requires the standard `iconv` command so it can validate UTF-8 and count Unicode code points consistently across Linux and Git Bash. It uses the same bounded, signal-aware transaction and fixed one-shot container as the service updater. Every existing publisher container is removed before the password inode changes, then recreated into its prior running, paused, or stopped state only after publication reaches a consistent result. On failure it atomically restores the old secret, confirms that no one-shot container remains, forces a rollback publication, and restores the prior daemon state. A new ciphertext that was published successfully is never rolled back merely because later container-state restoration failed. The password is never passed as an argument or environment variable. A legacy password already mounted by an older deployment remains readable for continuity, but the next reset upgrades the shared Owner Access/private-blog secret to this stronger policy. Password length is measured as Unicode code points rather than UTF-8 bytes, so multibyte characters do not receive extra length credit.

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

It performs the stop, remount, forced publication, rollback protection, and restart as one transaction. It shares the publisher-mutation lock with `update-services.sh`, so a password reset cannot race a service-directory update. The website needs no rebuild: the new password works after the new ciphertext reaches the registry, and the old password stops decrypting it.

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

On a Linux host where the Compose publisher image is already built, opt in to the real container-isolation smoke test:

```bash
HOME_ENDPOINT_REAL_IMAGE_TEST=1 node --test test/update-services.container.test.mjs
```

The smoke test resolves the image from `docker compose config`, validates one synthetic mode-`0600` catalog as the file's actual UID/GID, confirms that an invalid catalog is rejected, and keeps the validator offline and read-only. It never reads deployment secrets or starts, stops, or recreates the publisher service.
