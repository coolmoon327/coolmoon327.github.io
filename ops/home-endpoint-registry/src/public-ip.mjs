import { PublisherError } from "./errors.mjs";

export const DEFAULT_PUBLIC_IP_PROVIDERS = Object.freeze([
  "https://api.ipify.org/",
  "https://checkip.amazonaws.com/",
  "https://ipv4.icanhazip.com/",
  "https://v4.ident.me/",
]);

function ipv4ToInteger(value) {
  if (typeof value !== "string" || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) {
    return null;
  }
  const octets = value.split(".").map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return null;
  }
  if (octets.some((octet, index) => String(octet) !== value.split(".")[index])) {
    return null;
  }
  return octets.reduce((result, octet) => result * 256 + octet, 0) >>> 0;
}

function inCidr(value, base, prefixLength) {
  const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;
  return (value & mask) === (base & mask);
}

const NON_PUBLIC_RANGES = Object.freeze([
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
].map(([base, prefixLength]) => [ipv4ToInteger(base), prefixLength]));

export function isPublicIPv4(value) {
  const integer = ipv4ToInteger(value);
  if (integer === null) {
    return false;
  }
  return !NON_PUBLIC_RANGES.some(([base, prefixLength]) => inCidr(integer, base, prefixLength));
}

export function validateProviderUrls(providers) {
  if (!Array.isArray(providers) || providers.length < 2 || providers.length > 8) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      "Public address discovery requires between 2 and 8 providers.",
    );
  }
  const unique = new Set();
  return providers.map((provider) => {
    let parsed;
    try {
      parsed = new URL(provider);
    } catch (error) {
      throw new PublisherError("INVALID_CONFIGURATION", "A discovery provider URL is invalid.", {
        cause: error,
      });
    }
    if (
      parsed.protocol !== "https:" ||
      parsed.username !== "" ||
      parsed.password !== "" ||
      parsed.search !== "" ||
      parsed.hash !== "" ||
      unique.has(parsed.href)
    ) {
      throw new PublisherError("INVALID_CONFIGURATION", "A discovery provider URL is unsafe.");
    }
    unique.add(parsed.href);
    return parsed.href;
  });
}

async function readBoundedText(response, maximumBytes) {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null && Number(contentLength) > maximumBytes) {
    throw new Error("Provider response is too large.");
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel();
        throw new Error("Provider response is too large.");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
}

async function queryProvider(provider, timeoutMs, fetchImpl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  timeout.unref?.();
  try {
    const response = await fetchImpl(provider, {
      method: "GET",
      redirect: "error",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "text/plain",
        "user-agent": "home-endpoint-registry/1",
      },
    });
    if (!response.ok) {
      throw new Error("Provider returned a non-success status.");
    }
    const body = await readBoundedText(response, 128);
    const candidate = body.trim();
    if (!isPublicIPv4(candidate)) {
      throw new Error("Provider response is not a public IPv4 address.");
    }
    return candidate;
  } finally {
    clearTimeout(timeout);
  }
}

export async function discoverPublicIPv4({
  providers = DEFAULT_PUBLIC_IP_PROVIDERS,
  minimumAgreement = 2,
  timeoutMs = 5000,
  fetchImpl = globalThis.fetch,
} = {}) {
  const validatedProviders = validateProviderUrls(providers);
  if (
    !Number.isSafeInteger(minimumAgreement) ||
    minimumAgreement < 2 ||
    minimumAgreement > validatedProviders.length
  ) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      "Discovery agreement must be at least two and no greater than the provider count.",
    );
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 500 || timeoutMs > 30000) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      "Discovery timeout must be between 500 and 30000 milliseconds.",
    );
  }
  if (typeof fetchImpl !== "function") {
    throw new PublisherError("INVALID_CONFIGURATION", "Fetch implementation is unavailable.");
  }

  const results = await Promise.allSettled(
    validatedProviders.map((provider) => queryProvider(provider, timeoutMs, fetchImpl)),
  );
  const counts = new Map();
  for (const result of results) {
    if (result.status === "fulfilled") {
      counts.set(result.value, (counts.get(result.value) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  if (
    ranked.length === 0 ||
    ranked[0][1] < minimumAgreement ||
    (ranked.length > 1 && ranked[0][1] === ranked[1][1])
  ) {
    const successfulProviders = results.filter((result) => result.status === "fulfilled").length;
    throw new PublisherError(
      "PUBLIC_IP_NO_CONSENSUS",
      `Public address discovery had ${successfulProviders} valid responses but no safe consensus.`,
    );
  }
  return ranked[0][0];
}
