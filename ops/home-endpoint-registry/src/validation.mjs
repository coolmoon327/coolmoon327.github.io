import { PublisherError } from "./errors.mjs";

export function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new PublisherError("INVALID_SCHEMA", `${label} must be an object.`);
  }
}

export function assertExactKeys(value, expectedKeys, label) {
  assertPlainObject(value, label);
  const expected = new Set(expectedKeys);
  const actual = Object.keys(value);
  const unexpected = actual.filter((key) => !expected.has(key));
  const missing = expectedKeys.filter((key) => !(key in value));

  if (unexpected.length > 0 || missing.length > 0) {
    throw new PublisherError("INVALID_SCHEMA", `${label} has an invalid shape.`);
  }
}

export function parseBoundedInteger(value, label, minimum, maximum) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      `${label} must be an integer between ${minimum} and ${maximum}.`,
    );
  }
  return parsed;
}

export function assertIsoTimestamp(value, label) {
  if (
    typeof value !== "string" ||
    value.length > 40 ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new PublisherError("INVALID_SCHEMA", `${label} must be an ISO timestamp.`);
  }
}

export function decodeBase64Strict(value, label, { minimum = 1, maximum = 65536 } = {}) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > Math.ceil((maximum * 4) / 3) + 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
  ) {
    throw new PublisherError("INVALID_SCHEMA", `${label} is not canonical base64.`);
  }

  const decoded = Buffer.from(value, "base64");
  if (
    decoded.length < minimum ||
    decoded.length > maximum ||
    decoded.toString("base64") !== value
  ) {
    throw new PublisherError("INVALID_SCHEMA", `${label} has an invalid size or encoding.`);
  }
  return decoded;
}
