import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { writeFileAtomic } from "./atomic-file.mjs";
import { encryptPayload } from "./encryption.mjs";
import { errorCode, PublisherError } from "./errors.mjs";
import { commitEncryptedEnvelope, prepareGitWorktree } from "./git-publisher.mjs";
import { acquirePublishLock } from "./lock.mjs";
import { discoverPublicIPv4 } from "./public-ip.mjs";
import { loadServiceConfig, readPasswordSecret, renderServices } from "./service-config.mjs";

const HEALTH_FILE = "health.json";

function payloadFingerprint(services, pbkdf2Iterations, ttlHours) {
  return createHash("sha256")
    .update(JSON.stringify({ version: 1, pbkdf2Iterations, ttlHours, services }), "utf8")
    .digest("hex");
}

export function heartbeatIsDue(lastPublishedAt, heartbeatHours, nowMilliseconds = Date.now()) {
  if (typeof lastPublishedAt !== "string") return true;
  const previous = Date.parse(lastPublishedAt);
  if (!Number.isFinite(previous)) return true;
  const elapsed = nowMilliseconds - previous;
  if (elapsed < -10 * 60 * 1000) return true;
  return elapsed >= heartbeatHours * 60 * 60 * 1000;
}

async function readHealth(stateDirectory) {
  try {
    const parsed = JSON.parse(await readFile(join(stateDirectory, HEALTH_FILE), "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeHealth(stateDirectory, value) {
  await writeFileAtomic(join(stateDirectory, HEALTH_FILE), `${JSON.stringify(value)}\n`, {
    mode: 0o600,
  });
}

async function recordSuccess(config, result) {
  const previous = await readHealth(config.stateDirectory);
  const now = new Date().toISOString();
  await writeHealth(config.stateDirectory, {
    version: 1,
    status: "ok",
    lastAttemptAt: now,
    lastSuccessAt: now,
    lastPublishedAt: result.published
      ? result.publishedAt
      : (previous.lastPublishedAt ?? null),
    consecutiveFailures: 0,
    forceNextPublish: false,
  });
}

async function recordFailure(config, error, { force = false } = {}) {
  const previous = await readHealth(config.stateDirectory);
  await writeHealth(config.stateDirectory, {
    version: 1,
    status: "degraded",
    lastAttemptAt: new Date().toISOString(),
    lastSuccessAt: previous.lastSuccessAt ?? null,
    lastPublishedAt: previous.lastPublishedAt ?? null,
    consecutiveFailures:
      Number.isSafeInteger(previous.consecutiveFailures) && previous.consecutiveFailures >= 0
        ? previous.consecutiveFailures + 1
        : 1,
    errorCode: errorCode(error),
    forceNextPublish: force || previous.forceNextPublish === true,
  });
}

export async function runPublishCycle(config, { force = false, dependencies = {} } = {}) {
  await mkdir(config.stateDirectory, { recursive: true, mode: 0o700 });
  const releaseLock = await acquirePublishLock(config.stateDirectory);
  try {
    const serviceConfig = await (dependencies.loadServiceConfig ?? loadServiceConfig)(config.servicesFile);
    const password = await (dependencies.readPasswordSecret ?? readPasswordSecret)(config.passwordFile);
    const gitContext = await (dependencies.prepareGitWorktree ?? prepareGitWorktree)(config);
    const publicIPv4 = await (dependencies.discoverPublicIPv4 ?? discoverPublicIPv4)({
      providers: config.providers,
      minimumAgreement: config.minimumAgreement,
      timeoutMs: config.discoveryTimeoutMs,
    });
    const services = renderServices(serviceConfig, publicIPv4);
    const fingerprint = payloadFingerprint(
      services,
      config.pbkdf2Iterations,
      config.ttlHours,
    );
    const nowMilliseconds = (dependencies.now ?? Date.now)();
    const previousHealth = await readHealth(config.stateDirectory);
    const heartbeatDue = heartbeatIsDue(
      previousHealth.lastPublishedAt,
      config.heartbeatHours,
      nowMilliseconds,
    );
    const forcePending = previousHealth.forceNextPublish === true;

    if (!force && !forcePending && !heartbeatDue && gitContext.lastPayloadHash === fingerprint) {
      return { published: false, skipped: true };
    }

    const publishedAt = new Date(nowMilliseconds).toISOString();
    const payload = {
      version: 1,
      publishedAt,
      expiresAt: new Date(nowMilliseconds + config.ttlHours * 60 * 60 * 1000).toISOString(),
      services,
    };
    const envelope = encryptPayload(payload, password, {
      iterations: config.pbkdf2Iterations,
    });
    const result = await (dependencies.commitEncryptedEnvelope ?? commitEncryptedEnvelope)(
      config,
      gitContext,
      envelope,
      fingerprint,
    );
    return {
      published: result.published,
      skipped: !result.published,
      publishedAt: result.published ? publishedAt : undefined,
    };
  } finally {
    await releaseLock();
  }
}

function emitLog(event, fields = {}) {
  process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), event, ...fields })}\n`);
}

export async function runOnce(config, { force = false } = {}) {
  try {
    const result = await runPublishCycle(config, { force });
    await recordSuccess(config, result);
    emitLog(result.published ? "registry_published" : "registry_unchanged");
    return result;
  } catch (error) {
    if (!(error instanceof PublisherError && error.code === "PUBLISH_LOCK_BUSY")) {
      await recordFailure(config, error, { force }).catch(() => {});
    }
    emitLog("publish_failed", { errorCode: errorCode(error) });
    throw error;
  }
}

function waitForNextCycle(milliseconds, signal) {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    let timeout;
    const finish = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
      resolve();
    };
    timeout = setTimeout(finish, milliseconds);
    const onAbort = () => {
      finish();
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export async function runDaemon(config) {
  const stopController = new AbortController();
  const stop = () => stopController.abort();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  emitLog("daemon_started");

  while (!stopController.signal.aborted) {
    try {
      await runOnce(config);
    } catch (error) {
      if (error instanceof PublisherError && error.code === "PUBLISH_LOCK_BUSY") {
        emitLog("publish_deferred", { errorCode: error.code });
      }
    }
    await waitForNextCycle(config.publishIntervalSeconds * 1000, stopController.signal);
  }
  emitLog("daemon_stopped");
}
