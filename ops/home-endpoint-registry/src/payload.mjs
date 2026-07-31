import { PublisherError } from "./errors.mjs";
import { validateLocalizedText } from "./localized-text.mjs";
import { assertExactKeys, assertIsoTimestamp } from "./validation.mjs";

const SERVICE_ID_PATTERN = /^[a-z][a-z0-9-]{0,47}$/;

export const MAXIMUM_PAYLOAD_LIFETIME_MS = 48 * 60 * 60 * 1000;

export function validatePayload(value) {
  assertExactKeys(
    value,
    ["version", "publishedAt", "expiresAt", "services"],
    "Registry payload",
  );
  if (value.version !== 1 || !Array.isArray(value.services)) {
    throw new PublisherError("INVALID_PAYLOAD", "Registry payload is unsupported.");
  }
  assertIsoTimestamp(value.publishedAt, "Registry payload timestamp");
  assertIsoTimestamp(value.expiresAt, "Registry payload expiry");
  const publishedAt = Date.parse(value.publishedAt);
  const expiresAt = Date.parse(value.expiresAt);
  if (expiresAt <= publishedAt || expiresAt - publishedAt > MAXIMUM_PAYLOAD_LIFETIME_MS) {
    throw new PublisherError("INVALID_PAYLOAD", "Registry payload lifetime is invalid.");
  }
  if (value.services.length < 1 || value.services.length > 64) {
    throw new PublisherError("INVALID_PAYLOAD", "Registry payload has an invalid service count.");
  }

  const ids = new Set();
  const services = value.services.map((service, index) => {
    assertExactKeys(
      service,
      ["id", "url", "label", "description"],
      `Registry service ${index}`,
    );
    if (!SERVICE_ID_PATTERN.test(service.id) || ids.has(service.id)) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an invalid identifier.`);
    }
    if (typeof service.url !== "string" || service.url.length < 1 || service.url.length > 2048) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an invalid URL.`);
    }
    let parsed;
    try {
      parsed = new URL(service.url);
    } catch (error) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an invalid URL.`, {
        cause: error,
      });
    }
    if (
      parsed.protocol !== "https:" ||
      parsed.username !== "" ||
      parsed.password !== ""
    ) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an unsafe URL.`);
    }
    const label = validateLocalizedText(service.label, `Registry service ${index} label`, 80);
    const description = validateLocalizedText(
      service.description,
      `Registry service ${index} description`,
      280,
    );
    ids.add(service.id);
    return { id: service.id, url: parsed.href, label, description };
  });
  return {
    version: 1,
    publishedAt: value.publishedAt,
    expiresAt: value.expiresAt,
    services,
  };
}
