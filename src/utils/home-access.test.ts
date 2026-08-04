import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { decryptHomeAccess, HomeAccessError, type HomeAccessPayload } from './home-access';

const TEST_PASSWORD = 'local-test-passphrase';
const TEST_ITERATIONS = 100_000;
const NOW_MS = Date.parse('2026-07-31T12:00:00.000Z');
const LEGACY_HTTP_NOTICE = {
  en: 'Only use this legacy HTTP service at home or through Tailscale; traffic is unencrypted.',
  zh: '此旧版 HTTP 服务仅限家庭内网或 Tailscale 使用；流量未加密。',
};

function encodeBase64(value: Uint8Array): string {
  return btoa(String.fromCharCode(...value));
}

function asBuffer(value: Uint8Array): ArrayBuffer {
  return value.slice().buffer as ArrayBuffer;
}

async function encryptPayload(payload: unknown, password = TEST_PASSWORD) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey(
    'raw',
    asBuffer(new TextEncoder().encode(password)),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', iterations: TEST_ITERATIONS, salt: asBuffer(salt) },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: asBuffer(iv), tagLength: 128 },
    key,
    asBuffer(new TextEncoder().encode(JSON.stringify(payload))),
  );

  return {
    version: 1,
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: TEST_ITERATIONS,
      salt: encodeBase64(salt),
    },
    cipher: {
      name: 'AES-GCM',
      iv: encodeBase64(iv),
      tagLength: 128,
    },
    ciphertext: encodeBase64(new Uint8Array(ciphertext)),
  };
}

const payload: HomeAccessPayload = {
  version: 1,
  publishedAt: '2026-07-31T11:00:00.000Z',
  expiresAt: '2026-08-01T11:00:00.000Z',
  services: [
    {
      id: 'router',
      url: 'https://example.test/router',
      label: { en: 'Router', zh: '路由器' },
      description: { en: 'Network administration.', zh: '网络管理。' },
      access: 'internet',
      notice: { en: '', zh: '' },
    },
    {
      id: 'future-service',
      url: 'https://example.test:8443/',
      label: { en: 'Future service', zh: '后续服务' },
      description: { en: '', zh: '' },
      access: 'home-or-tailnet',
      notice: {
        en: 'Connect through the private network before opening this service.',
        zh: '请先连接私有网络，再打开此服务。',
      },
    },
  ],
};

describe('decryptHomeAccess', () => {
  it('decrypts the independent publisher interoperability fixture', async () => {
    const fixturePath = resolve(
      process.cwd(),
      'ops',
      'home-endpoint-registry',
      'test',
      'fixtures',
      'interop-envelope-v1.json',
    );
    const envelope = JSON.parse(readFileSync(fixturePath, 'utf8')) as unknown;

    await expect(
      decryptHomeAccess(
        envelope,
        'interop-only-passphrase',
        Date.parse('2026-02-03T12:00:00.000Z'),
      ),
    ).resolves.toEqual({
      version: 1,
      publishedAt: '2026-02-03T04:05:06.000Z',
      expiresAt: '2026-02-04T04:05:06.000Z',
      services: [
        {
          id: 'interop-service',
          url: 'https://example.invalid/owner',
          label: { en: 'Interop service', zh: '互操作服务' },
          description: { en: 'Synthetic encrypted fixture.', zh: '合成加密测试数据。' },
          access: 'internet',
          notice: { en: '', zh: '' },
        },
      ],
    });
  });

  it('decrypts a valid payload with encrypted service metadata', async () => {
    const envelope = await encryptPayload(payload);

    await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).resolves.toEqual(payload);
  });

  it('counts non-BMP password bounds as Unicode characters', async () => {
    const maximumPassword = '🔐'.repeat(1024);
    const envelope = await encryptPayload(payload, maximumPassword);

    await expect(decryptHomeAccess(envelope, maximumPassword, NOW_MS)).resolves.toEqual(payload);
    await expect(decryptHomeAccess(envelope, '🔐'.repeat(1025), NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
  });

  it('rejects a directory larger than the shared 32-service contract', async () => {
    const oversized = {
      ...payload,
      services: Array.from({ length: 33 }, (_, index) => ({
        ...payload.services[0],
        id: `service-${index}`,
        url: `https://example.test/service-${index}`,
      })),
    };
    const envelope = await encryptPayload(oversized);

    await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
  });

  it('accepts legacy HTTP only for a warned private or Tailnet service', async () => {
    const legacyPayload: HomeAccessPayload = {
      ...payload,
      services: [
        {
          ...payload.services[1],
          url: 'http://192.168.1.20:8080/',
          notice: LEGACY_HTTP_NOTICE,
        },
      ],
    };
    const envelope = await encryptPayload(legacyPayload);

    await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).resolves.toEqual(
      legacyPayload,
    );
  });

  it('uses the same generic error for a wrong password and tampered ciphertext', async () => {
    const envelope = await encryptPayload(payload);
    const tampered = structuredClone(envelope);
    const bytes = Uint8Array.from(atob(tampered.ciphertext), (character) =>
      character.charCodeAt(0),
    );
    bytes[0] ^= 1;
    tampered.ciphertext = encodeBase64(bytes);

    await expect(decryptHomeAccess(envelope, 'incorrect-passphrase', NOW_MS)).rejects.toEqual(
      new HomeAccessError(),
    );
    await expect(decryptHomeAccess(tampered, TEST_PASSWORD, NOW_MS)).rejects.toEqual(
      new HomeAccessError(),
    );
  });

  it('rejects unsupported algorithms, iteration counts, and malformed base64', async () => {
    const envelope = await encryptPayload(payload);

    await expect(
      decryptHomeAccess(
        { ...envelope, kdf: { ...envelope.kdf, iterations: 2_000_001 } },
        TEST_PASSWORD,
        NOW_MS,
      ),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(
      decryptHomeAccess(
        { ...envelope, cipher: { ...envelope.cipher, name: 'AES-CBC' } },
        TEST_PASSWORD,
        NOW_MS,
      ),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(
      decryptHomeAccess({ ...envelope, ciphertext: 'not-base64!' }, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
  });

  it('rejects unsafe URLs and duplicate service ids after successful decryption', async () => {
    const unsafeEnvelope = await encryptPayload({
      ...payload,
      services: [{ ...payload.services[0], url: 'javascript:alert(1)' }],
    });
    const duplicateEnvelope = await encryptPayload({
      ...payload,
      services: [
        { ...payload.services[0], url: 'https://example.test/one' },
        { ...payload.services[0], url: 'https://example.test/two' },
      ],
    });
    const insecureEnvelope = await encryptPayload({
      ...payload,
      services: [{ ...payload.services[0], url: 'http://example.test/router' }],
    });
    const publicHttpEnvelope = await encryptPayload({
      ...payload,
      services: [
        {
          ...payload.services[1],
          url: 'http://203.0.113.9/',
          notice: LEGACY_HTTP_NOTICE,
        },
      ],
    });
    const unwarntPrivateHttpEnvelope = await encryptPayload({
      ...payload,
      services: [
        {
          ...payload.services[1],
          url: 'http://192.168.1.20/',
          notice: { en: '', zh: '' },
        },
      ],
    });
    const noncanonicalPrivateHttpEnvelope = await encryptPayload({
      ...payload,
      services: [
        {
          ...payload.services[1],
          url: 'http://0300.0250.0001.0024/',
          notice: LEGACY_HTTP_NOTICE,
        },
      ],
    });

    await expect(decryptHomeAccess(unsafeEnvelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
    await expect(
      decryptHomeAccess(duplicateEnvelope, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(decryptHomeAccess(insecureEnvelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
    await expect(
      decryptHomeAccess(publicHttpEnvelope, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(
      decryptHomeAccess(unwarntPrivateHttpEnvelope, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(
      decryptHomeAccess(noncanonicalPrivateHttpEnvelope, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
  });

  it('rejects expired, future-dated, reversed, and overlong directory lifetimes', async () => {
    const cases = [
      { ...payload, expiresAt: '2026-07-31T12:00:00.000Z' },
      { ...payload, publishedAt: '2026-07-31T12:10:00.001Z' },
      {
        ...payload,
        publishedAt: '2026-07-31T11:00:00.000Z',
        expiresAt: '2026-08-02T11:00:00.001Z',
      },
      {
        ...payload,
        publishedAt: '2026-08-01T11:00:00.000Z',
        expiresAt: '2026-08-01T10:00:00.000Z',
      },
      { ...payload, expiresAt: '2026-08-01T11:00:00Z' },
    ];

    for (const candidate of cases) {
      const envelope = await encryptPayload(candidate);
      await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
        HomeAccessError,
      );
    }

    const envelope = await encryptPayload(payload);
    await expect(decryptHomeAccess(envelope, TEST_PASSWORD, Number.NaN)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
  });

  it('rejects missing or invalid encrypted service metadata', async () => {
    const cases = [
      { ...payload.services[0], label: { en: '', zh: '路由器' } },
      { ...payload.services[0], label: { en: 'Router' } },
      { ...payload.services[0], description: { en: 'Line\nbreak', zh: '网络管理。' } },
      { ...payload.services[0], access: 'private' },
      { ...payload.services[0], notice: { en: '', zh: '仅限内部访问' } },
      { ...payload.services[0], notice: { en: 'Missing Chinese notice' } },
    ];

    for (const service of cases) {
      const envelope = await encryptPayload({ ...payload, services: [service] });
      await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
        HomeAccessError,
      );
    }
  });
});
