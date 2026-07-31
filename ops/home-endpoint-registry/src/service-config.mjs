import { readFile, lstat } from "node:fs/promises";
import { PublisherError } from "./errors.mjs";
import { validateLocalizedText } from "./localized-text.mjs";
import { assertExactKeys, assertPlainObject } from "./validation.mjs";

const SERVICE_ID_PATTERN = /^[a-z][a-z0-9-]{0,47}$/;
const PUBLIC_IPV4_TOKEN = "{publicIPv4}";
const TEMPLATE_SENTINEL = "203.0.113.7";

function assertPrivateMode(stat, label) {
  if (process.platform !== "win32" && (stat.mode & 0o077) !== 0) {
    throw new PublisherError(
      "INSECURE_SECRET_PERMISSIONS",
      `${label} must not be accessible by group or other users.`,
    );
  }
}

export async function readPrivateFile(filePath, label, maximumBytes = 65536) {
  let stat;
  try {
    stat = await lstat(filePath);
  } catch (error) {
    throw new PublisherError("SECRET_UNAVAILABLE", `${label} is unavailable.`, { cause: error });
  }

  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new PublisherError("INVALID_SECRET_FILE", `${label} must be a regular file.`);
  }
  assertPrivateMode(stat, label);
  if (stat.size < 1 || stat.size > maximumBytes) {
    throw new PublisherError("INVALID_SECRET_FILE", `${label} has an invalid size.`);
  }

  try {
    return await readFile(filePath);
  } catch (error) {
    throw new PublisherError("SECRET_UNAVAILABLE", `${label} cannot be read.`, { cause: error });
  }
}

export async function readPasswordSecret(filePath) {
  const bytes = await readPrivateFile(filePath, "Password secret", 4096);
  let password = bytes.toString("utf8");
  if (password.endsWith("\r\n")) {
    password = password.slice(0, -2);
  } else if (password.endsWith("\n")) {
    password = password.slice(0, -1);
  }

  if (password.includes("\n") || password.includes("\r") || password.includes("\0")) {
    throw new PublisherError("INVALID_PASSWORD_SECRET", "Password secret contains invalid bytes.");
  }
  const length = Buffer.byteLength(password, "utf8");
  if (length < 10 || length > 1024) {
    throw new PublisherError(
      "INVALID_PASSWORD_SECRET",
      "Password secret must contain between 10 and 1024 UTF-8 bytes.",
    );
  }
  return password;
}

function validateTemplate(template, label) {
  if (
    typeof template !== "string" ||
    template.length < 1 ||
    template.length > 2048 ||
    /[\u0000-\u001f\u007f\s]/u.test(template)
  ) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", `${label} has an invalid URL template.`);
  }

  const tokenCount = template.split(PUBLIC_IPV4_TOKEN).length - 1;
  if (tokenCount !== 1 || /[{}]/u.test(template.replace(PUBLIC_IPV4_TOKEN, ""))) {
    throw new PublisherError(
      "INVALID_SERVICE_CONFIG",
      `${label} must contain exactly one supported address placeholder.`,
    );
  }

  let parsed;
  try {
    parsed = new URL(template.replace(PUBLIC_IPV4_TOKEN, TEMPLATE_SENTINEL));
  } catch (error) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", `${label} is not a valid URL template.`, {
      cause: error,
    });
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== TEMPLATE_SENTINEL ||
    parsed.username !== "" ||
    parsed.password !== ""
  ) {
    throw new PublisherError(
      "INVALID_SERVICE_CONFIG",
      `${label} must resolve directly to the discovered address over HTTPS.`,
    );
  }
}

export function validateServiceConfig(value) {
  assertExactKeys(value, ["version", "services"], "Service configuration");
  if (value.version !== 1 || !Array.isArray(value.services)) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", "Service configuration is unsupported.");
  }
  if (value.services.length < 1 || value.services.length > 64) {
    throw new PublisherError(
      "INVALID_SERVICE_CONFIG",
      "Service configuration must contain between 1 and 64 services.",
    );
  }

  const ids = new Set();
  const services = value.services.map((service, index) => {
    assertPlainObject(service, `Service ${index}`);
    const allowedKeys = new Set(["id", "urlTemplate", "label", "description", "enabled"]);
    if (Object.keys(service).some((key) => !allowedKeys.has(key))) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid shape.`);
    }
    if (
      !("id" in service) ||
      !("urlTemplate" in service) ||
      !("label" in service) ||
      !("description" in service)
    ) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} is incomplete.`);
    }
    if (!SERVICE_ID_PATTERN.test(service.id) || ids.has(service.id)) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid identifier.`);
    }
    if ("enabled" in service && typeof service.enabled !== "boolean") {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid state.`);
    }
    validateTemplate(service.urlTemplate, `Service ${index}`);
    const label = validateLocalizedText(service.label, `Service ${index} label`, 80);
    const description = validateLocalizedText(
      service.description,
      `Service ${index} description`,
      280,
    );
    ids.add(service.id);
    return {
      id: service.id,
      urlTemplate: service.urlTemplate,
      label,
      description,
      enabled: service.enabled !== false,
    };
  });

  if (!services.some((service) => service.enabled)) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", "At least one service must be enabled.");
  }
  return { version: 1, services };
}

export async function loadServiceConfig(filePath) {
  const bytes = await readPrivateFile(filePath, "Service configuration", 131072);
  let parsed;
  try {
    parsed = JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", "Service configuration is not valid JSON.", {
      cause: error,
    });
  }
  return validateServiceConfig(parsed);
}

export function renderServices(config, publicIPv4) {
  return config.services
    .filter((service) => service.enabled)
    .map((service) => {
      const rendered = service.urlTemplate.replace(PUBLIC_IPV4_TOKEN, publicIPv4);
      const parsed = new URL(rendered);
      if (
        parsed.protocol !== "https:" ||
        parsed.hostname !== publicIPv4 ||
        parsed.username !== "" ||
        parsed.password !== "" ||
        parsed.href.length > 2048
      ) {
        throw new PublisherError(
          "INVALID_SERVICE_CONFIG",
          `Service ${service.id} produced an unsafe URL.`,
        );
      }
      return {
        id: service.id,
        url: parsed.href,
        label: service.label,
        description: service.description,
      };
    });
}
