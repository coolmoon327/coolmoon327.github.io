#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

async function main() {
  const stateDirectory = resolve(process.env.STATE_DIRECTORY || "/state");
  const interval = Number(process.env.PUBLISH_INTERVAL_SECONDS || 600);
  if (!Number.isSafeInteger(interval) || interval < 60 || interval > 86400) {
    throw new Error("Invalid interval.");
  }
  const health = JSON.parse(await readFile(join(stateDirectory, "health.json"), "utf8"));
  if (health.version !== 1 || typeof health.lastAttemptAt !== "string") {
    throw new Error("Invalid health state.");
  }
  const lastAttempt = Date.parse(health.lastAttemptAt);
  const maximumAgeMs = Math.max(interval * 3 * 1000, 300000);
  if (!Number.isFinite(lastAttempt) || Date.now() - lastAttempt > maximumAgeMs) {
    throw new Error("Publisher heartbeat is stale.");
  }
  if (!Number.isSafeInteger(health.consecutiveFailures) || health.consecutiveFailures >= 3) {
    throw new Error("Publisher has repeated failures.");
  }
}

main().catch(() => {
  process.exitCode = 1;
});
