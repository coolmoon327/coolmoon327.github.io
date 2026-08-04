import { readFile, lstat } from "node:fs/promises";
import { PublisherError } from "./errors.mjs";
import { validateLocalizedText } from "./localized-text.mjs";
import { validatePasswordSecret } from "./password-secret.mjs";
import {
  isCanonicalPrivateOrTailnetUrl,
  legacyHttpNoticeIsExplicit,
} from "./private-endpoint.mjs";
import { assertExactKeys, assertPlainObject } from "./validation.mjs";

const SERVICE_ID_PATTERN = /^[a-z][a-z0-9-]{0,47}$/;
const PUBLIC_IPV4_TOKEN = "{publicIPv4}";
const TEMPLATE_SENTINEL = "203.0.113.7";
const SERVICE_ACCESS = new Set(["internet", "home-or-tailnet"]);

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

  return validatePasswordSecret(password);
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

function validateFixedUrl(value, label) {
  if (
    typeof value !== "string" ||
    value.length < 1 ||
    value.length > 2048 ||
    (!value.startsWith("https://") && !value.startsWith("http://")) ||
    /[\u0000-\u001f\u007f\s]/u.test(value)
  ) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", `${label} has an invalid fixed URL.`);
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", `${label} is not a valid fixed URL.`, {
      cause: error,
    });
  }

  if (
    (parsed.protocol !== "https:" && parsed.protocol !== "http:") ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    !isCanonicalPrivateOrTailnetUrl(value, parsed)
  ) {
    throw new PublisherError(
      "INVALID_SERVICE_CONFIG",
      `${label} must point directly to a canonical private or Tailnet IPv4 address.`,
    );
  }

  return { href: parsed.href, protocol: parsed.protocol };
}

export function validateServiceConfig(value) {
  assertExactKeys(value, ["version", "services"], "Service configuration");
  if (value.version !== 1 || !Array.isArray(value.services)) {
    throw new PublisherError("INVALID_SERVICE_CONFIG", "Service configuration is unsupported.");
  }
  if (value.services.length < 1 || value.services.length > 32) {
    throw new PublisherError(
      "INVALID_SERVICE_CONFIG",
      "Service configuration must contain between 1 and 32 services.",
    );
  }

  const ids = new Set();
  const services = value.services.map((service, index) => {
    assertPlainObject(service, `Service ${index}`);
    const allowedKeys = new Set([
      "id",
      "urlTemplate",
      "fixedUrl",
      "label",
      "description",
      "enabled",
      "access",
      "notice",
    ]);
    if (Object.keys(service).some((key) => !allowedKeys.has(key))) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid shape.`);
    }
    if (
      !("id" in service) ||
      !("label" in service) ||
      !("description" in service) ||
      (("urlTemplate" in service) === ("fixedUrl" in service))
    ) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} is incomplete.`);
    }
    if (!SERVICE_ID_PATTERN.test(service.id) || ids.has(service.id)) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid identifier.`);
    }
    if ("enabled" in service && typeof service.enabled !== "boolean") {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has an invalid state.`);
    }
    const access = service.access ?? "internet";
    if (!SERVICE_ACCESS.has(access)) {
      throw new PublisherError("INVALID_SERVICE_CONFIG", `Service ${index} has invalid access.`);
    }
    if ("fixedUrl" in service && access !== "home-or-tailnet") {
      throw new PublisherError(
        "INVALID_SERVICE_CONFIG",
        `Service ${index} fixed URLs require home-or-tailnet access.`,
      );
    }
    let locator;
    let fixedProtocol = null;
    if ("urlTemplate" in service) {
      validateTemplate(service.urlTemplate, `Service ${index}`);
      locator = { urlTemplate: service.urlTemplate };
    } else {
      const fixedUrl = validateFixedUrl(service.fixedUrl, `Service ${index}`);
      locator = { fixedUrl: fixedUrl.href };
      fixedProtocol = fixedUrl.protocol;
    }
    const label = validateLocalizedText(service.label, `Service ${index} label`, 80);
    const description = validateLocalizedText(
      service.description,
      `Service ${index} description`,
      280,
    );
    const notice =
      "notice" in service
        ? validateLocalizedText(service.notice, `Service ${index} notice`, 480)
        : null;
    if (fixedProtocol === "http:" && !legacyHttpNoticeIsExplicit(notice)) {
      throw new PublisherError(
        "INVALID_SERVICE_CONFIG",
        `Service ${index} legacy HTTP requires an explicit bilingual private-network risk notice.`,
      );
    }
    ids.add(service.id);
    return {
      id: service.id,
      ...locator,
      label,
      description,
      access,
      notice,
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
      const rendered = service.urlTemplate
        ? service.urlTemplate.replace(PUBLIC_IPV4_TOKEN, publicIPv4)
        : service.fixedUrl;
      const parsed = new URL(rendered);
      const isDynamic = "urlTemplate" in service;
      const safeDynamicHost = !isDynamic || parsed.hostname === publicIPv4;
      const safeFixedHost = isDynamic || isCanonicalPrivateOrTailnetUrl(rendered, parsed);
      const safeFixedAccess = isDynamic || service.access === "home-or-tailnet";
      const safeLegacyHttp =
        !isDynamic &&
        parsed.protocol === "http:" &&
        service.access === "home-or-tailnet" &&
        legacyHttpNoticeIsExplicit(service.notice);
      if (
        (parsed.protocol !== "https:" && !safeLegacyHttp) ||
        !safeDynamicHost ||
        !safeFixedHost ||
        !safeFixedAccess ||
        parsed.username !== "" ||
        parsed.password !== "" ||
        parsed.href.length > 2048
      ) {
        throw new PublisherError(
          "INVALID_SERVICE_CONFIG",
          `Service ${service.id} produced an unsafe URL.`,
        );
      }
      const renderedService = {
        id: service.id,
        url: parsed.href,
        label: service.label,
        description: service.description,
        access: service.access,
      };
      if (service.notice !== null) renderedService.notice = service.notice;
      return renderedService;
    });
}
