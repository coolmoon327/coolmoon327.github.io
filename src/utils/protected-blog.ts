export type ProtectedBlogLocale = 'en' | 'zh';

export type ProtectedBlogBlock =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'link'; text: string; href: string };

export interface ProtectedBlogTranslation {
  title: string;
  description: string;
  blocks: ProtectedBlogBlock[];
}

export interface ProtectedBlogPost {
  sourceId: string;
  slug: string;
  date: string;
  translations: Record<ProtectedBlogLocale, ProtectedBlogTranslation>;
}

export interface ProtectedBlogCatalog {
  version: 1;
  publishedAt: string;
  posts: ProtectedBlogPost[];
}

export interface ProtectedBlogEnvelope {
  version: 1;
  kdf: {
    name: 'PBKDF2';
    hash: 'SHA-256';
    iterations: 600000;
    salt: string;
  };
  cipher: {
    name: 'AES-GCM';
    iv: string;
    tagLength: 128;
  };
  ciphertext: string;
}

export class ProtectedBlogError extends Error {
  constructor() {
    super('Protected blog data is unavailable or invalid.');
    this.name = 'ProtectedBlogError';
  }
}

export const PROTECTED_BLOG_MAX_ENVELOPE_CHARACTERS = 16 * 1024 * 1024;
export const PROTECTED_BLOG_MIN_PASSWORD_CHARACTERS = 16;
export const PROTECTED_BLOG_MAX_PASSWORD_CHARACTERS = 1024;
const MAX_POSTS = 256;
const MAX_BLOCKS_PER_POST = 2048;
const MAX_TITLE_CHARACTERS = 300;
const MAX_DESCRIPTION_CHARACTERS = 2000;
const MAX_BLOCK_CHARACTERS = 1024 * 1024;
const MAX_LIST_ITEMS = 1024;
const MAX_LINK_CHARACTERS = 2048;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SOURCE_ID_PATTERN = /^post-[a-f0-9]{16}$/u;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;

function fail(): never {
  throw new ProtectedBlogError();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail();
  return value as Record<string, unknown>;
}

function requireExactKeys(record: Record<string, unknown>, expected: readonly string[]): void {
  const actual = Object.keys(record).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) {
    fail();
  }
}

function requireString(value: unknown, minimum: number, maximum: number): string {
  if (
    typeof value !== 'string' ||
    value.length < minimum ||
    value.length > maximum ||
    value.includes('\0')
  ) {
    fail();
  }
  return value;
}

function requireInteger(value: unknown, expected: number): number {
  if (!Number.isInteger(value) || value !== expected) fail();
  return value as number;
}

function decodeBase64(value: unknown, exactBytes?: number): Uint8Array {
  const encoded = requireString(value, 1, PROTECTED_BLOG_MAX_ENVELOPE_CHARACTERS);
  if (encoded.length % 4 !== 0 || !BASE64_PATTERN.test(encoded)) fail();

  let binary: string;
  try {
    binary = atob(encoded);
  } catch {
    fail();
  }

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (exactBytes !== undefined && bytes.byteLength !== exactBytes) fail();
  return bytes;
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.slice().buffer as ArrayBuffer;
}

function requireDate(value: unknown): string {
  const date = requireString(value, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) fail();
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) fail();
  return date;
}

function requirePublishedAt(value: unknown): string {
  const publishedAt = requireString(value, 20, 40);
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== publishedAt) fail();
  return publishedAt;
}

function parseHttpsUrl(value: unknown): string {
  const href = requireString(value, 1, MAX_LINK_CHARACTERS);
  let parsed: URL;
  try {
    parsed = new URL(href);
  } catch {
    fail();
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) fail();
  return href;
}

function parseBlock(value: unknown): ProtectedBlogBlock {
  const block = asRecord(value);
  const type = requireString(block.type, 1, 16);

  if (type === 'heading') {
    requireExactKeys(block, ['type', 'level', 'text']);
    if (block.level !== 2 && block.level !== 3 && block.level !== 4) fail();
    return {
      type,
      level: block.level,
      text: requireString(block.text, 0, MAX_BLOCK_CHARACTERS),
    };
  }

  if (type === 'paragraph' || type === 'quote') {
    requireExactKeys(block, ['type', 'text']);
    return { type, text: requireString(block.text, 0, MAX_BLOCK_CHARACTERS) };
  }

  if (type === 'list') {
    requireExactKeys(block, ['type', 'ordered', 'items']);
    if (typeof block.ordered !== 'boolean' || !Array.isArray(block.items)) fail();
    if (block.items.length > MAX_LIST_ITEMS) fail();
    return {
      type,
      ordered: block.ordered,
      items: block.items.map((item) => requireString(item, 0, MAX_BLOCK_CHARACTERS)),
    };
  }

  if (type === 'code') {
    requireExactKeys(block, ['type', 'language', 'text']);
    return {
      type,
      language: requireString(block.language, 0, 64),
      text: requireString(block.text, 0, MAX_BLOCK_CHARACTERS),
    };
  }

  if (type === 'link') {
    requireExactKeys(block, ['type', 'text', 'href']);
    return {
      type,
      text: requireString(block.text, 0, MAX_BLOCK_CHARACTERS),
      href: parseHttpsUrl(block.href),
    };
  }

  return fail();
}

function parseTranslation(value: unknown): ProtectedBlogTranslation {
  const translation = asRecord(value);
  requireExactKeys(translation, ['title', 'description', 'blocks']);
  if (!Array.isArray(translation.blocks) || translation.blocks.length > MAX_BLOCKS_PER_POST) fail();
  return {
    title: requireString(translation.title, 1, MAX_TITLE_CHARACTERS),
    description: requireString(translation.description, 0, MAX_DESCRIPTION_CHARACTERS),
    blocks: translation.blocks.map(parseBlock),
  };
}

function parsePost(value: unknown): ProtectedBlogPost {
  const post = asRecord(value);
  requireExactKeys(post, ['sourceId', 'slug', 'date', 'translations']);

  const sourceId = requireString(post.sourceId, 21, 21);
  const slug = requireString(post.slug, 1, 200);
  if (!SOURCE_ID_PATTERN.test(sourceId) || !SLUG_PATTERN.test(slug)) fail();

  const translations = asRecord(post.translations);
  requireExactKeys(translations, ['en', 'zh']);

  return {
    sourceId,
    slug,
    date: requireDate(post.date),
    translations: {
      en: parseTranslation(translations.en),
      zh: parseTranslation(translations.zh),
    },
  };
}

export function parseProtectedBlogEnvelope(input: unknown): ProtectedBlogEnvelope {
  const envelope = asRecord(input);
  requireExactKeys(envelope, ['version', 'kdf', 'cipher', 'ciphertext']);
  requireInteger(envelope.version, 1);

  const kdf = asRecord(envelope.kdf);
  requireExactKeys(kdf, ['name', 'hash', 'iterations', 'salt']);
  if (kdf.name !== 'PBKDF2' || kdf.hash !== 'SHA-256') fail();
  requireInteger(kdf.iterations, 600000);
  decodeBase64(kdf.salt, 16);

  const cipher = asRecord(envelope.cipher);
  requireExactKeys(cipher, ['name', 'iv', 'tagLength']);
  if (cipher.name !== 'AES-GCM') fail();
  requireInteger(cipher.tagLength, 128);
  decodeBase64(cipher.iv, 12);
  const ciphertext = decodeBase64(envelope.ciphertext);
  if (ciphertext.byteLength <= 16) fail();

  return {
    version: 1,
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: 600000,
      salt: kdf.salt as string,
    },
    cipher: { name: 'AES-GCM', iv: cipher.iv as string, tagLength: 128 },
    ciphertext: envelope.ciphertext as string,
  };
}

export function parseProtectedBlogCatalog(input: unknown): ProtectedBlogCatalog {
  const catalog = asRecord(input);
  requireExactKeys(catalog, ['version', 'publishedAt', 'posts']);
  requireInteger(catalog.version, 1);
  if (
    !Array.isArray(catalog.posts) ||
    catalog.posts.length === 0 ||
    catalog.posts.length > MAX_POSTS
  ) {
    fail();
  }

  const posts = catalog.posts.map(parsePost);
  const sourceIds = new Set(posts.map((post) => post.sourceId));
  const slugs = new Set(posts.map((post) => post.slug));
  if (sourceIds.size !== posts.length || slugs.size !== posts.length) fail();

  return { version: 1, publishedAt: requirePublishedAt(catalog.publishedAt), posts };
}

export async function decryptProtectedBlogCatalog(
  input: unknown,
  password: string,
): Promise<ProtectedBlogCatalog> {
  const passwordCharacters =
    typeof password === 'string' && password.length <= 2048 ? Array.from(password).length : 0;
  if (
    typeof password !== 'string' ||
    passwordCharacters < PROTECTED_BLOG_MIN_PASSWORD_CHARACTERS ||
    passwordCharacters > PROTECTED_BLOG_MAX_PASSWORD_CHARACTERS ||
    /[\0\r\n]/u.test(password) ||
    /^[0-9]+$/u.test(password)
  ) {
    fail();
  }
  const envelope = parseProtectedBlogEnvelope(input);
  const salt = decodeBase64(envelope.kdf.salt, 16);
  const iv = decodeBase64(envelope.cipher.iv, 12);
  const ciphertext = decodeBase64(envelope.ciphertext);

  try {
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(new TextEncoder().encode(password)),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: toArrayBuffer(salt),
        iterations: envelope.kdf.iterations,
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: toArrayBuffer(iv),
        tagLength: envelope.cipher.tagLength,
      },
      key,
      toArrayBuffer(ciphertext),
    );
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(plaintext);
    if (decoded.length > PROTECTED_BLOG_MAX_ENVELOPE_CHARACTERS) fail();
    return parseProtectedBlogCatalog(JSON.parse(decoded) as unknown);
  } catch (error) {
    if (error instanceof ProtectedBlogError) throw error;
    fail();
  }
}

function appendBlock(document: Document, parent: HTMLElement, block: ProtectedBlogBlock): void {
  if (block.type === 'heading') {
    const heading = document.createElement(`h${Math.min(block.level + 1, 6)}`);
    heading.className = 'protected-post-heading';
    heading.textContent = block.text;
    parent.append(heading);
    return;
  }

  if (block.type === 'paragraph') {
    const paragraph = document.createElement('p');
    paragraph.textContent = block.text;
    parent.append(paragraph);
    return;
  }

  if (block.type === 'quote') {
    const quote = document.createElement('blockquote');
    quote.textContent = block.text;
    parent.append(quote);
    return;
  }

  if (block.type === 'list') {
    const list = document.createElement(block.ordered ? 'ol' : 'ul');
    for (const item of block.items) {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      list.append(listItem);
    }
    parent.append(list);
    return;
  }

  if (block.type === 'code') {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.dataset.language = block.language;
    code.textContent = block.text;
    pre.append(code);
    parent.append(pre);
    return;
  }

  const paragraph = document.createElement('p');
  const link = document.createElement('a');
  link.href = block.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = block.text;
  paragraph.append(link);
  parent.append(paragraph);
}

export function renderProtectedBlogCatalog(
  document: Document,
  catalog: ProtectedBlogCatalog,
  locale: ProtectedBlogLocale,
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const languageTag = locale === 'zh' ? 'zh-CN' : 'en-US';

  for (const post of catalog.posts) {
    const translation = post.translations[locale];
    const article = document.createElement('article');
    article.className = 'protected-post';

    const header = document.createElement('header');
    header.className = 'protected-post-header';
    const title = document.createElement('h2');
    title.textContent = translation.title;
    const date = document.createElement('time');
    date.dateTime = post.date;
    date.textContent = new Date(`${post.date}T00:00:00.000Z`).toLocaleDateString(languageTag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    header.append(title, date);

    if (translation.description) {
      const description = document.createElement('p');
      description.className = 'protected-post-description';
      description.textContent = translation.description;
      header.append(description);
    }

    const body = document.createElement('div');
    body.className = 'protected-post-body';
    for (const block of translation.blocks) appendBlock(document, body, block);

    article.append(header, body);
    fragment.append(article);
  }

  return fragment;
}
