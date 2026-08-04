import { PublisherError } from "./errors.mjs";
import { validateLocalizedText } from "./localized-text.mjs";
import {
  isCanonicalPrivateOrTailnetUrl,
  legacyHttpNoticeIsExplicit,
} from "./private-endpoint.mjs";
import { assertExactKeys, assertIsoTimestamp, assertPlainObject } from "./validation.mjs";

const SERVICE_ID_PATTERN = /^[a-z][a-z0-9-]{0,47}$/;
const SERVICE_ACCESS = new Set(["internet", "home-or-tailnet"]);

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
  if (value.services.length < 1 || value.services.length > 32) {
    throw new PublisherError("INVALID_PAYLOAD", "Registry payload has an invalid service count.");
  }

  const ids = new Set();
  const services = value.services.map((service, index) => {
    assertPlainObject(service, `Registry service ${index}`);
    const allowedKeys = new Set(["id", "url", "label", "description", "access", "notice"]);
    if (
      Object.keys(service).some((key) => !allowedKeys.has(key)) ||
      !["id", "url", "label", "description"].every((key) => key in service)
    ) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an invalid shape.`);
    }
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
    const label = validateLocalizedText(service.label, `Registry service ${index} label`, 80);
    const description = validateLocalizedText(
      service.description,
      `Registry service ${index} description`,
      280,
    );
    const access = service.access ?? "internet";
    if (!SERVICE_ACCESS.has(access)) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has invalid access.`);
    }
    const notice =
      "notice" in service
        ? validateLocalizedText(service.notice, `Registry service ${index} notice`, 480)
        : null;
    const safeLegacyHttp =
      parsed.protocol === "http:" &&
      access === "home-or-tailnet" &&
      isCanonicalPrivateOrTailnetUrl(service.url, parsed) &&
      legacyHttpNoticeIsExplicit(notice);
    if (
      (parsed.protocol !== "https:" && !safeLegacyHttp) ||
      parsed.username !== "" ||
      parsed.password !== ""
    ) {
      throw new PublisherError("INVALID_PAYLOAD", `Registry service ${index} has an unsafe URL.`);
    }
    ids.add(service.id);
    return {
      id: service.id,
      url: parsed.href,
      label,
      description,
      ...(service.access === undefined ? {} : { access: service.access }),
      ...(notice === null ? {} : { notice }),
    };
  });
  return {
    version: 1,
    publishedAt: value.publishedAt,
    expiresAt: value.expiresAt,
    services,
  };
}
