import { resolve } from "node:path";
import { DEFAULT_PBKDF2_ITERATIONS, MAXIMUM_PBKDF2_ITERATIONS, MINIMUM_PBKDF2_ITERATIONS } from "./encryption.mjs";
import { PublisherError } from "./errors.mjs";
import { DEFAULT_PUBLIC_IP_PROVIDERS, validateProviderUrls } from "./public-ip.mjs";
import { parseBoundedInteger } from "./validation.mjs";

const DEFAULT_STATE_DIRECTORY = "/state";
const DEFAULT_PASSWORD_FILE = "/run/secrets/home_access_password";
const DEFAULT_SERVICES_FILE = "/run/secrets/services.json";
const DEFAULT_DEPLOY_KEY_FILE = "/run/secrets/registry_deploy_key";
const DEFAULT_KNOWN_HOSTS_FILE = "/run/secrets/known_hosts";

function parseSshRemote(remoteUrl) {
  if (typeof remoteUrl !== "string" || remoteUrl.length < 8 || remoteUrl.length > 2048) {
    throw new PublisherError("INVALID_CONFIGURATION", "Registry SSH remote is required.");
  }
  if (/[\r\n\0]/u.test(remoteUrl)) {
    throw new PublisherError("INVALID_CONFIGURATION", "Registry SSH remote is invalid.");
  }

  if (/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+:[A-Za-z0-9._~/-]+$/u.test(remoteUrl)) {
    return remoteUrl;
  }
  let parsed;
  try {
    parsed = new URL(remoteUrl);
  } catch (error) {
    throw new PublisherError("INVALID_CONFIGURATION", "Registry remote must use SSH.", {
      cause: error,
    });
  }
  if (
    parsed.protocol !== "ssh:" ||
    parsed.username === "" ||
    parsed.password !== "" ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    throw new PublisherError("INVALID_CONFIGURATION", "Registry remote must use SSH without credentials.");
  }
  return remoteUrl;
}

function validateBranch(branch) {
  if (
    typeof branch !== "string" ||
    branch.length < 1 ||
    branch.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(branch) ||
    branch.includes("..") ||
    branch.includes("//") ||
    branch.includes("@{") ||
    branch.endsWith("/") ||
    branch.endsWith(".") ||
    branch.endsWith(".lock")
  ) {
    throw new PublisherError("INVALID_CONFIGURATION", "Registry branch name is invalid.");
  }
  return branch;
}

function absolutePath(value, fallback, label) {
  const candidate = value || fallback;
  const resolved = resolve(candidate);
  if (resolved !== candidate && process.platform !== "win32") {
    throw new PublisherError("INVALID_CONFIGURATION", `${label} must be an absolute path.`);
  }
  return resolved;
}

export function loadRuntimeConfig(environment = process.env) {
  const providers = validateProviderUrls(
    environment.PUBLIC_IP_PROVIDERS
      ? environment.PUBLIC_IP_PROVIDERS.split(",").map((value) => value.trim()).filter(Boolean)
      : DEFAULT_PUBLIC_IP_PROVIDERS,
  );
  const minimumAgreement = parseBoundedInteger(
    environment.IP_DISCOVERY_MIN_AGREEMENT ?? 2,
    "IP discovery agreement",
    2,
    providers.length,
  );

  const heartbeatHours = parseBoundedInteger(
    environment.HOME_HEARTBEAT_HOURS ?? 6,
    "Registry heartbeat",
    1,
    24,
  );
  const ttlHours = parseBoundedInteger(
    environment.HOME_REGISTRY_TTL_HOURS ?? 24,
    "Registry lifetime",
    2,
    48,
  );
  if (heartbeatHours >= ttlHours) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      "Registry heartbeat must be shorter than registry lifetime.",
    );
  }
  const publishIntervalSeconds = parseBoundedInteger(
    environment.PUBLISH_INTERVAL_SECONDS ?? 600,
    "Publish interval",
    60,
    86400,
  );
  if (publishIntervalSeconds >= heartbeatHours * 60 * 60) {
    throw new PublisherError(
      "INVALID_CONFIGURATION",
      "Publish interval must be shorter than the registry heartbeat.",
    );
  }

  return Object.freeze({
    stateDirectory: absolutePath(environment.STATE_DIRECTORY, DEFAULT_STATE_DIRECTORY, "State directory"),
    passwordFile: absolutePath(environment.PASSWORD_FILE, DEFAULT_PASSWORD_FILE, "Password file"),
    servicesFile: absolutePath(environment.SERVICES_FILE, DEFAULT_SERVICES_FILE, "Services file"),
    deployKeyFile: absolutePath(
      environment.DEPLOY_KEY_FILE,
      DEFAULT_DEPLOY_KEY_FILE,
      "Deploy key file",
    ),
    knownHostsFile: absolutePath(
      environment.KNOWN_HOSTS_FILE,
      DEFAULT_KNOWN_HOSTS_FILE,
      "Known hosts file",
    ),
    remoteUrl: parseSshRemote(environment.REGISTRY_REMOTE_URL),
    branch: validateBranch(environment.REGISTRY_BRANCH ?? "main"),
    endpointFile: "endpoint.enc.json",
    publishIntervalSeconds,
    discoveryTimeoutMs: parseBoundedInteger(
      environment.IP_DISCOVERY_TIMEOUT_MS ?? 5000,
      "IP discovery timeout",
      500,
      30000,
    ),
    minimumAgreement,
    providers,
    pbkdf2Iterations: parseBoundedInteger(
      environment.PBKDF2_ITERATIONS ?? DEFAULT_PBKDF2_ITERATIONS,
      "PBKDF2 iterations",
      MINIMUM_PBKDF2_ITERATIONS,
      MAXIMUM_PBKDF2_ITERATIONS,
    ),
    heartbeatHours,
    ttlHours,
  });
}
