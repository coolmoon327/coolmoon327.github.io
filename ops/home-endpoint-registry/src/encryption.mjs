import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "node:crypto";
import { PublisherError } from "./errors.mjs";
import { validatePasswordSecret } from "./password-secret.mjs";
import { validatePayload } from "./payload.mjs";
import { assertExactKeys, decodeBase64Strict, parseBoundedInteger } from "./validation.mjs";

export const DEFAULT_PBKDF2_ITERATIONS = 600000;
export const MINIMUM_PBKDF2_ITERATIONS = 100000;
export const MAXIMUM_PBKDF2_ITERATIONS = 2000000;

export function validateEnvelope(value) {
  assertExactKeys(value, ["version", "kdf", "cipher", "ciphertext"], "Registry envelope");
  if (value.version !== 1) {
    throw new PublisherError("INVALID_ENVELOPE", "Registry envelope version is unsupported.");
  }
  assertExactKeys(value.kdf, ["name", "hash", "iterations", "salt"], "Registry KDF");
  assertExactKeys(value.cipher, ["name", "iv", "tagLength"], "Registry cipher");
  if (value.kdf.name !== "PBKDF2" || value.kdf.hash !== "SHA-256") {
    throw new PublisherError("INVALID_ENVELOPE", "Registry KDF is unsupported.");
  }
  const iterations = parseBoundedInteger(
    value.kdf.iterations,
    "PBKDF2 iterations",
    MINIMUM_PBKDF2_ITERATIONS,
    MAXIMUM_PBKDF2_ITERATIONS,
  );
  if (value.cipher.name !== "AES-GCM" || value.cipher.tagLength !== 128) {
    throw new PublisherError("INVALID_ENVELOPE", "Registry cipher is unsupported.");
  }
  const salt = decodeBase64Strict(value.kdf.salt, "Registry salt", {
    minimum: 16,
    maximum: 16,
  });
  const iv = decodeBase64Strict(value.cipher.iv, "Registry IV", {
    minimum: 12,
    maximum: 12,
  });
  const ciphertext = decodeBase64Strict(value.ciphertext, "Registry ciphertext", {
    minimum: 17,
    maximum: 262144,
  });
  return { iterations, salt, iv, ciphertext };
}

export function encryptPayload(
  payload,
  password,
  { iterations = DEFAULT_PBKDF2_ITERATIONS, randomBytesFunction = randomBytes } = {},
) {
  const validatedPayload = validatePayload(payload);
  validatePasswordSecret(password);
  const validatedIterations = parseBoundedInteger(
    iterations,
    "PBKDF2 iterations",
    MINIMUM_PBKDF2_ITERATIONS,
    MAXIMUM_PBKDF2_ITERATIONS,
  );
  const salt = randomBytesFunction(16);
  const iv = randomBytesFunction(12);
  if (!Buffer.isBuffer(salt) || salt.length !== 16 || !Buffer.isBuffer(iv) || iv.length !== 12) {
    throw new PublisherError("RANDOM_SOURCE_FAILURE", "Cryptographic random source failed.");
  }

  const key = pbkdf2Sync(password, salt, validatedIterations, 32, "sha256");
  try {
    const cipher = createCipheriv("aes-256-gcm", key, iv, { authTagLength: 16 });
    const plaintext = Buffer.from(JSON.stringify(validatedPayload), "utf8");
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const ciphertext = Buffer.concat([encrypted, cipher.getAuthTag()]);
    return {
      version: 1,
      kdf: {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: validatedIterations,
        salt: salt.toString("base64"),
      },
      cipher: {
        name: "AES-GCM",
        iv: iv.toString("base64"),
        tagLength: 128,
      },
      ciphertext: ciphertext.toString("base64"),
    };
  } finally {
    key.fill(0);
  }
}

export function decryptEnvelope(envelope, password) {
  validatePasswordSecret(password);
  const { iterations, salt, iv, ciphertext } = validateEnvelope(envelope);
  const encrypted = ciphertext.subarray(0, -16);
  const authenticationTag = ciphertext.subarray(-16);
  const key = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, iv, { authTagLength: 16 });
    decipher.setAuthTag(authenticationTag);
    const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    let parsed;
    try {
      parsed = JSON.parse(plaintext.toString("utf8"));
    } catch (error) {
      throw new PublisherError("DECRYPTION_FAILED", "Registry decryption failed.", { cause: error });
    }
    return validatePayload(parsed);
  } catch (error) {
    if (error instanceof PublisherError) {
      throw error;
    }
    throw new PublisherError("DECRYPTION_FAILED", "Registry decryption failed.", { cause: error });
  } finally {
    key.fill(0);
  }
}
