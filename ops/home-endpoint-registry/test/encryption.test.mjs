import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { decryptEnvelope, encryptPayload, validateEnvelope } from "../src/encryption.mjs";

const TEST_PASSWORD = "test-only-passphrase";
const TEST_ITERATIONS = 100000;
const TEST_PAYLOAD = Object.freeze({
  version: 1,
  publishedAt: "2026-01-02T03:04:05.000Z",
  expiresAt: "2026-01-03T03:04:05.000Z",
  services: [
    {
      id: "dashboard",
      url: "https://example.invalid/owner",
      label: { en: "Owner dashboard", zh: "个人控制台" },
      description: { en: "Private test entry.", zh: "私有测试入口。" },
    },
  ],
});

function bytesFromBase64(value) {
  return Uint8Array.from(Buffer.from(value, "base64"));
}

test("encrypts a strict envelope and decrypts it with the Node implementation", () => {
  const envelope = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, {
    iterations: TEST_ITERATIONS,
  });
  assert.deepEqual(decryptEnvelope(envelope, TEST_PASSWORD), TEST_PAYLOAD);
  assert.equal(envelope.version, 1);
  assert.equal(envelope.kdf.name, "PBKDF2");
  assert.equal(envelope.cipher.name, "AES-GCM");
  assert.equal(envelope.cipher.tagLength, 128);
});

test("counts publisher password bounds as Unicode characters", () => {
  const minimumPassword = "密".repeat(10);
  const maximumPassword = "🔐".repeat(1024);
  const minimumEnvelope = encryptPayload(TEST_PAYLOAD, minimumPassword, {
    iterations: TEST_ITERATIONS,
  });
  const maximumEnvelope = encryptPayload(TEST_PAYLOAD, maximumPassword, {
    iterations: TEST_ITERATIONS,
  });

  assert.deepEqual(decryptEnvelope(minimumEnvelope, minimumPassword), TEST_PAYLOAD);
  assert.deepEqual(decryptEnvelope(maximumEnvelope, maximumPassword), TEST_PAYLOAD);
  assert.throws(
    () => encryptPayload(TEST_PAYLOAD, "密".repeat(9), { iterations: TEST_ITERATIONS }),
    { code: "INVALID_PASSWORD_SECRET" },
  );
  assert.throws(
    () => encryptPayload(TEST_PAYLOAD, "密".repeat(1025), { iterations: TEST_ITERATIONS }),
    { code: "INVALID_PASSWORD_SECRET" },
  );
});

test("envelope is compatible with the browser Web Crypto contract", async () => {
  const envelope = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, {
    iterations: TEST_ITERATIONS,
  });
  const passwordKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TEST_PASSWORD),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: envelope.kdf.iterations,
      salt: bytesFromBase64(envelope.kdf.salt),
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plaintext = await webcrypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesFromBase64(envelope.cipher.iv),
      tagLength: envelope.cipher.tagLength,
    },
    key,
    bytesFromBase64(envelope.ciphertext),
  );
  assert.deepEqual(JSON.parse(new TextDecoder().decode(plaintext)), TEST_PAYLOAD);
});

test("static publisher fixture remains interoperable across implementations", async () => {
  const envelope = JSON.parse(
    await readFile(new URL("./fixtures/interop-envelope-v1.json", import.meta.url), "utf8"),
  );
  const payload = decryptEnvelope(envelope, "interop-only-passphrase");
  assert.equal(payload.version, 1);
  assert.equal(payload.expiresAt, "2026-02-04T04:05:06.000Z");
  assert.deepEqual(payload.services[0].label, { en: "Interop service", zh: "互操作服务" });
});

test("fresh encryptions use independent salt and IV", () => {
  const first = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, { iterations: TEST_ITERATIONS });
  const second = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, { iterations: TEST_ITERATIONS });
  assert.notEqual(first.kdf.salt, second.kdf.salt);
  assert.notEqual(first.cipher.iv, second.cipher.iv);
  assert.notEqual(first.ciphertext, second.ciphertext);
});

test("wrong password and modified ciphertext fail closed", () => {
  const envelope = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, { iterations: TEST_ITERATIONS });
  assert.throws(() => decryptEnvelope(envelope, "different-test-password"), {
    code: "DECRYPTION_FAILED",
  });

  const modifiedBytes = Buffer.from(envelope.ciphertext, "base64");
  modifiedBytes[0] ^= 1;
  const modified = { ...envelope, ciphertext: modifiedBytes.toString("base64") };
  assert.throws(() => decryptEnvelope(modified, TEST_PASSWORD), { code: "DECRYPTION_FAILED" });
});

test("rejects unsupported or non-canonical envelopes", () => {
  const envelope = encryptPayload(TEST_PAYLOAD, TEST_PASSWORD, { iterations: TEST_ITERATIONS });
  assert.throws(() => validateEnvelope({ ...envelope, extra: true }), { code: "INVALID_SCHEMA" });
  assert.throws(() => validateEnvelope({ ...envelope, kdf: { ...envelope.kdf, iterations: 1 } }), {
    code: "INVALID_CONFIGURATION",
  });
  assert.throws(() => validateEnvelope({ ...envelope, ciphertext: `${envelope.ciphertext}\n` }), {
    code: "INVALID_SCHEMA",
  });
});

test("rejects invalid or excessive authenticated lifetimes", () => {
  assert.throws(
    () =>
      encryptPayload({ ...TEST_PAYLOAD, expiresAt: TEST_PAYLOAD.publishedAt }, TEST_PASSWORD, {
        iterations: TEST_ITERATIONS,
      }),
    { code: "INVALID_PAYLOAD" },
  );
  assert.throws(
    () =>
      encryptPayload({ ...TEST_PAYLOAD, expiresAt: "2026-01-05T03:04:05.000Z" }, TEST_PASSWORD, {
        iterations: TEST_ITERATIONS,
      }),
    { code: "INVALID_PAYLOAD" },
  );
});
