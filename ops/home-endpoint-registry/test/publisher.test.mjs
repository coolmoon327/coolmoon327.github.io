import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { decryptEnvelope } from "../src/encryption.mjs";
import { heartbeatIsDue, runPublishCycle } from "../src/publisher.mjs";
import { validateServiceConfig } from "../src/service-config.mjs";

const TEST_PASSWORD = "publisher-test-passphrase";
const START_TIME = Date.parse("2026-02-03T04:05:06.000Z");

test("ordinary polls skip unchanged data until the heartbeat is due", async (context) => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "endpoint-publisher-"));
  context.after(() => rm(stateDirectory, { recursive: true, force: true }));
  const serviceConfig = validateServiceConfig({
    version: 1,
    services: [
      {
        id: "dashboard",
        urlTemplate: "https://{publicIPv4}/owner",
        label: { en: "Owner dashboard", zh: "个人控制台" },
        description: { en: "Private test entry.", zh: "私有测试入口。" },
      },
    ],
  });
  const config = {
    stateDirectory,
    servicesFile: "unused-services",
    passwordFile: "unused-password",
    providers: ["https://one.example.invalid/", "https://two.example.invalid/"],
    minimumAgreement: 2,
    discoveryTimeoutMs: 1000,
    pbkdf2Iterations: 100000,
    heartbeatHours: 6,
    ttlHours: 24,
  };
  let currentTime = START_TIME;
  let lastPayloadHash = null;
  const payloads = [];
  const dependencies = {
    loadServiceConfig: async () => serviceConfig,
    readPasswordSecret: async () => TEST_PASSWORD,
    prepareGitWorktree: async () => ({ lastPayloadHash }),
    discoverPublicIPv4: async () => "8.8.4.4",
    now: () => currentTime,
    commitEncryptedEnvelope: async (_config, _context, envelope, payloadHash) => {
      lastPayloadHash = payloadHash;
      payloads.push(decryptEnvelope(envelope, TEST_PASSWORD));
      return { published: true };
    },
  };

  const first = await runPublishCycle(config, { dependencies });
  assert.equal(first.published, true);
  assert.equal(payloads[0].expiresAt, "2026-02-04T04:05:06.000Z");
  await writeFile(
    join(stateDirectory, "health.json"),
    `${JSON.stringify({ lastPublishedAt: first.publishedAt })}\n`,
    "utf8",
  );

  currentTime = START_TIME + 60 * 60 * 1000;
  const ordinaryPoll = await runPublishCycle(config, { dependencies });
  assert.deepEqual(ordinaryPoll, { published: false, skipped: true });
  assert.equal(payloads.length, 1);

  currentTime = START_TIME + 6 * 60 * 60 * 1000;
  const heartbeat = await runPublishCycle(config, { dependencies });
  assert.equal(heartbeat.published, true);
  assert.equal(payloads.length, 2);
});

test("heartbeat freshness treats missing, stale, and far-future state as due", () => {
  assert.equal(heartbeatIsDue(null, 6, START_TIME), true);
  assert.equal(heartbeatIsDue(new Date(START_TIME - 60 * 60 * 1000).toISOString(), 6, START_TIME), false);
  assert.equal(heartbeatIsDue(new Date(START_TIME - 6 * 60 * 60 * 1000).toISOString(), 6, START_TIME), true);
  assert.equal(heartbeatIsDue(new Date(START_TIME + 11 * 60 * 1000).toISOString(), 6, START_TIME), true);
});
