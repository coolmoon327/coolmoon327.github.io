const MIN_PBKDF2_ITERATIONS = 100_000;
const MAX_PBKDF2_ITERATIONS = 2_000_000;
const MAX_CIPHERTEXT_BYTES = 256 * 1024;
const MAX_SERVICE_COUNT = 32;
const MAX_URL_LENGTH = 2048;
const MAX_LABEL_LENGTH = 96;
const MAX_DESCRIPTION_LENGTH = 320;
const MAX_FUTURE_CLOCK_SKEW_MS = 10 * 60 * 1000;
const MAX_DIRECTORY_LIFETIME_MS = 48 * 60 * 60 * 1000;
const SERVICE_ID_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;
const ISO_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

type JsonRecord = Record<string, unknown>;

export interface HomeAccessService {
  id: string;
  url: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface HomeAccessPayload {
  version: 1;
  publishedAt: string;
  expiresAt: string;
  services: HomeAccessService[];
}

interface HomeAccessEnvelope {
  version: 1;
  kdf: {
    name: 'PBKDF2';
    hash: 'SHA-256';
    iterations: number;
    salt: string;
  };
  cipher: {
    name: 'AES-GCM';
    iv: string;
    tagLength: 128;
  };
  ciphertext: string;
}

/** Deliberately hides whether the password, payload, or network data was invalid. */
export class HomeAccessError extends Error {
  constructor() {
    super('HOME_ACCESS_UNAVAILABLE');
    this.name = 'HomeAccessError';
  }
}

function fail(): never {
  throw new HomeAccessError();
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function decodeBase64(value: unknown, minBytes: number, maxBytes: number): Uint8Array {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > Math.ceil((maxBytes * 4) / 3) + 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
  ) {
    fail();
  }

  try {
    const decoded = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
    if (decoded.byteLength < minBytes || decoded.byteLength > maxBytes) fail();
    return decoded;
  } catch {
    fail();
  }
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.slice().buffer as ArrayBuffer;
}

function parseEnvelope(value: unknown): {
  envelope: HomeAccessEnvelope;
  salt: Uint8Array;
  iv: Uint8Array;
  ciphertext: Uint8Array;
} {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.kdf) || !isRecord(value.cipher)) {
    fail();
  }

  const { kdf, cipher } = value;
  if (
    kdf.name !== 'PBKDF2' ||
    kdf.hash !== 'SHA-256' ||
    !Number.isInteger(kdf.iterations) ||
    (kdf.iterations as number) < MIN_PBKDF2_ITERATIONS ||
    (kdf.iterations as number) > MAX_PBKDF2_ITERATIONS ||
    cipher.name !== 'AES-GCM' ||
    cipher.tagLength !== 128
  ) {
    fail();
  }

  const envelope = value as unknown as HomeAccessEnvelope;
  return {
    envelope,
    salt: decodeBase64(kdf.salt, 16, 64),
    iv: decodeBase64(cipher.iv, 12, 12),
    ciphertext: decodeBase64(value.ciphertext, 17, MAX_CIPHERTEXT_BYTES),
  };
}

function parseLocalizedText(value: unknown, maxLength: number, allowEmpty = false): LocalizedText {
  if (!isRecord(value)) fail();

  const parse = (candidate: unknown): string => {
    if (
      typeof candidate !== 'string' ||
      candidate.length > maxLength ||
      (!allowEmpty && candidate.trim().length === 0)
    ) {
      fail();
    }
    for (const character of candidate) {
      const codePoint = character.codePointAt(0) ?? 0;
      if (codePoint < 32 || codePoint === 127) fail();
    }
    return candidate;
  };

  return { en: parse(value.en), zh: parse(value.zh) };
}

function parsePayload(value: unknown, nowMs: number): HomeAccessPayload {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.publishedAt !== 'string' ||
    !ISO_UTC_PATTERN.test(value.publishedAt) ||
    typeof value.expiresAt !== 'string' ||
    !ISO_UTC_PATTERN.test(value.expiresAt) ||
    !Array.isArray(value.services) ||
    value.services.length > MAX_SERVICE_COUNT
  ) {
    fail();
  }

  const publishedAtMs = Date.parse(value.publishedAt);
  const expiresAtMs = Date.parse(value.expiresAt);
  if (
    !Number.isFinite(publishedAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    publishedAtMs > nowMs + MAX_FUTURE_CLOCK_SKEW_MS ||
    expiresAtMs <= nowMs ||
    expiresAtMs <= publishedAtMs ||
    expiresAtMs - publishedAtMs > MAX_DIRECTORY_LIFETIME_MS
  ) {
    fail();
  }

  const seen = new Set<string>();
  const services: HomeAccessService[] = [];

  for (const candidate of value.services) {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== 'string' ||
      !SERVICE_ID_PATTERN.test(candidate.id) ||
      seen.has(candidate.id) ||
      typeof candidate.url !== 'string' ||
      candidate.url.length > MAX_URL_LENGTH
    ) {
      fail();
    }

    let url: URL;
    try {
      url = new URL(candidate.url);
    } catch {
      fail();
    }

    if (url.protocol !== 'https:' || url.username.length > 0 || url.password.length > 0) {
      fail();
    }

    seen.add(candidate.id);
    services.push({
      id: candidate.id,
      url: url.href,
      label: parseLocalizedText(candidate.label, MAX_LABEL_LENGTH),
      description: parseLocalizedText(candidate.description, MAX_DESCRIPTION_LENGTH, true),
    });
  }

  return {
    version: 1,
    publishedAt: value.publishedAt,
    expiresAt: value.expiresAt,
    services,
  };
}

export async function decryptHomeAccess(
  value: unknown,
  password: string,
  nowMs = Date.now(),
): Promise<HomeAccessPayload> {
  try {
    if (
      password.length === 0 ||
      password.length > 1024 ||
      !Number.isFinite(nowMs) ||
      globalThis.crypto?.subtle === undefined
    ) {
      fail();
    }

    const { envelope, salt, iv, ciphertext } = parseEnvelope(value);
    const passwordBytes = new TextEncoder().encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(passwordBytes),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: envelope.kdf.hash,
        iterations: envelope.kdf.iterations,
        salt: toArrayBuffer(salt),
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const plaintext = await crypto.subtle.decrypt(
      {
        name: envelope.cipher.name,
        iv: toArrayBuffer(iv),
        tagLength: envelope.cipher.tagLength,
      },
      key,
      toArrayBuffer(ciphertext),
    );

    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(plaintext);
    if (decoded.length > MAX_CIPHERTEXT_BYTES) fail();
    return parsePayload(JSON.parse(decoded) as unknown, nowMs);
  } catch (error) {
    if (error instanceof HomeAccessError) throw error;
    throw new HomeAccessError();
  }
}
