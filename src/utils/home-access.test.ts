import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { decryptHomeAccess, HomeAccessError, type HomeAccessPayload } from './home-access';

const TEST_PASSWORD = 'local-test-passphrase';
const TEST_ITERATIONS = 100_000;
const NOW_MS = Date.parse('2026-07-31T12:00:00.000Z');

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
    },
    {
      id: 'future-service',
      url: 'https://example.test:8443/',
      label: { en: 'Future service', zh: '后续服务' },
      description: { en: '', zh: '' },
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
        },
      ],
    });
  });

  it('decrypts a valid payload with encrypted service metadata', async () => {
    const envelope = await encryptPayload(payload);

    await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).resolves.toEqual(payload);
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

    await expect(decryptHomeAccess(unsafeEnvelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
    await expect(
      decryptHomeAccess(duplicateEnvelope, TEST_PASSWORD, NOW_MS),
    ).rejects.toBeInstanceOf(HomeAccessError);
    await expect(decryptHomeAccess(insecureEnvelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
      HomeAccessError,
    );
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
    ];

    for (const service of cases) {
      const envelope = await encryptPayload({ ...payload, services: [service] });
      await expect(decryptHomeAccess(envelope, TEST_PASSWORD, NOW_MS)).rejects.toBeInstanceOf(
        HomeAccessError,
      );
    }
  });
});
