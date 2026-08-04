import { createCipheriv, pbkdf2Sync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  decryptProtectedBlogCatalog,
  parseProtectedBlogCatalog,
  parseProtectedBlogEnvelope,
  type ProtectedBlogCatalog,
  ProtectedBlogError,
  renderProtectedBlogCatalog,
} from './protected-blog';

const password = 'a-long-test-password';
const payload: ProtectedBlogCatalog = {
  version: 1,
  publishedAt: '2026-08-04T12:00:00.000Z',
  posts: [
    {
      sourceId: 'post-0123456789abcdef',
      slug: 'safe-note',
      date: '2026-08-04',
      translations: {
        en: {
          title: 'Safe note',
          description: 'A protected note.',
          blocks: [
            { type: 'heading', level: 2, text: 'Section' },
            { type: 'paragraph', text: '<img src=x onerror=alert(1)>' },
            { type: 'list', ordered: false, items: ['One', 'Two'] },
            { type: 'code', language: 'js', text: '<script>alert(1)</script>' },
            { type: 'quote', text: 'Quoted text.' },
            { type: 'link', text: 'Source', href: 'https://example.com/' },
          ],
        },
        zh: {
          title: '安全笔记',
          description: '一篇受保护的笔记。',
          blocks: [{ type: 'paragraph', text: '正文。' }],
        },
      },
    },
  ],
};

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encryptForTest(value: unknown, encryptionPassword = password) {
  const salt = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
  const iv = Uint8Array.from({ length: 12 }, (_, index) => index + 17);
  const key = pbkdf2Sync(encryptionPassword, salt, 600000, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  return {
    version: 1,
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: 600000, salt: toBase64(salt) },
    cipher: { name: 'AES-GCM', iv: toBase64(iv), tagLength: 128 },
    ciphertext: toBase64(ciphertext),
  };
}

describe('protected blog validation', () => {
  it('accepts the exact publishing envelope', () => {
    const envelope = encryptForTest(payload);
    expect(parseProtectedBlogEnvelope(envelope)).toEqual(envelope);
  });

  it('rejects altered cryptographic parameters and extra fields', () => {
    const envelope = encryptForTest(payload);
    expect(() => parseProtectedBlogEnvelope({ ...envelope, unexpected: true })).toThrow(
      ProtectedBlogError,
    );
    expect(() =>
      parseProtectedBlogEnvelope({
        ...envelope,
        kdf: { ...envelope.kdf, iterations: 1000 },
      }),
    ).toThrow(ProtectedBlogError);
  });

  it('rejects unsupported blocks and non-HTTPS links', () => {
    const invalidBlock = structuredClone(payload) as unknown as Record<string, unknown>;
    const posts = invalidBlock.posts as Array<Record<string, unknown>>;
    const translations = posts[0].translations as Record<string, Record<string, unknown>>;
    translations.en.blocks = [{ type: 'html', text: '<b>unsafe</b>' }];
    expect(() => parseProtectedBlogCatalog(invalidBlock)).toThrow(ProtectedBlogError);

    const invalidLink = structuredClone(payload) as unknown as Record<string, unknown>;
    const linkPosts = invalidLink.posts as Array<Record<string, unknown>>;
    const linkTranslations = linkPosts[0].translations as Record<string, Record<string, unknown>>;
    linkTranslations.en.blocks = [{ type: 'link', text: 'Unsafe', href: 'http://example.com/' }];
    expect(() => parseProtectedBlogCatalog(invalidLink)).toThrow(ProtectedBlogError);
  });
});

describe('protected blog decryption', () => {
  it('decrypts the Node-compatible AES-GCM envelope', async () => {
    const envelope = encryptForTest(payload);
    await expect(decryptProtectedBlogCatalog(envelope, password)).resolves.toEqual(payload);
  });

  it('rejects the wrong password without returning partial data', async () => {
    const envelope = encryptForTest(payload);
    await expect(decryptProtectedBlogCatalog(envelope, 'valid-but-wrong-password')).rejects.toThrow(
      ProtectedBlogError,
    );
  });

  it('counts multibyte passwords as Unicode characters', async () => {
    for (const character of ['密', '🔐']) {
      const shortPassword = character.repeat(15);
      const minimumPassword = character.repeat(16);
      await expect(
        decryptProtectedBlogCatalog(encryptForTest(payload, shortPassword), shortPassword),
      ).rejects.toThrow(ProtectedBlogError);
      await expect(
        decryptProtectedBlogCatalog(encryptForTest(payload, minimumPassword), minimumPassword),
      ).resolves.toEqual(payload);
    }
  });

  it('accepts at most 1024 Unicode password characters', async () => {
    const maximumPassword = '🔐'.repeat(1024);
    const envelope = encryptForTest(payload, maximumPassword);
    await expect(decryptProtectedBlogCatalog(envelope, maximumPassword)).resolves.toEqual(payload);
    await expect(decryptProtectedBlogCatalog(envelope, '🔐'.repeat(1025))).rejects.toThrow(
      ProtectedBlogError,
    );
  });
});

describe('protected blog rendering', () => {
  it('renders untrusted text as text nodes and only preserves validated links', () => {
    const catalog = parseProtectedBlogCatalog(payload);
    const container = document.createElement('div');
    container.append(renderProtectedBlogCatalog(document, catalog, 'en'));

    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(container.querySelector('a')?.href).toBe('https://example.com/');
    expect(container.querySelector('a')?.rel).toBe('noopener noreferrer');
  });

  it('selects only the requested locale', () => {
    const catalog = parseProtectedBlogCatalog(payload);
    const container = document.createElement('div');
    container.append(renderProtectedBlogCatalog(document, catalog, 'zh'));
    expect(container.textContent).toContain('安全笔记');
    expect(container.textContent).not.toContain('Safe note');
  });
});
