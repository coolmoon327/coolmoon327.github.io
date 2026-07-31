import assert from "node:assert/strict";
import test from "node:test";
import { loadRuntimeConfig } from "../src/runtime-config.mjs";

function environment(overrides = {}) {
  return {
    REGISTRY_REMOTE_URL: "git@example.invalid:owner/registry.git",
    ...overrides,
  };
}

test("uses a six-hour heartbeat and 24-hour authenticated lifetime", () => {
  const config = loadRuntimeConfig(environment());
  assert.equal(config.publishIntervalSeconds, 600);
  assert.equal(config.heartbeatHours, 6);
  assert.equal(config.ttlHours, 24);
});

test("rejects an excessive lifetime or a heartbeat that cannot refresh before expiry", () => {
  assert.throws(
    () => loadRuntimeConfig(environment({ HOME_REGISTRY_TTL_HOURS: "49" })),
    { code: "INVALID_CONFIGURATION" },
  );
  assert.throws(
    () =>
      loadRuntimeConfig(
        environment({ HOME_HEARTBEAT_HOURS: "24", HOME_REGISTRY_TTL_HOURS: "24" }),
      ),
    { code: "INVALID_CONFIGURATION" },
  );
  assert.throws(
    () =>
      loadRuntimeConfig(
        environment({ HOME_HEARTBEAT_HOURS: "1", PUBLISH_INTERVAL_SECONDS: "3600" }),
      ),
    { code: "INVALID_CONFIGURATION" },
  );
});
