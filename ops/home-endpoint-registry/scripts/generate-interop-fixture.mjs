#!/usr/bin/env node
import { encryptPayload } from "../src/encryption.mjs";

const deterministicBytes = [
  Buffer.from(Array.from({ length: 16 }, (_, index) => index)),
  Buffer.from(Array.from({ length: 12 }, (_, index) => index + 16)),
];

const envelope = encryptPayload(
  {
    version: 1,
    publishedAt: "2026-02-03T04:05:06.000Z",
    expiresAt: "2026-02-04T04:05:06.000Z",
    services: [
      {
        id: "interop-service",
        url: "https://example.invalid/owner",
        label: { en: "Interop service", zh: "互操作服务" },
        description: { en: "Synthetic encrypted fixture.", zh: "合成加密测试数据。" },
      },
    ],
  },
  "interop-only-passphrase",
  {
    iterations: 100000,
    randomBytesFunction: (length) => {
      const value = deterministicBytes.shift();
      if (!value || value.length !== length) throw new Error("Unexpected fixture random request.");
      return value;
    },
  },
);

process.stdout.write(`${JSON.stringify(envelope, null, 2)}\n`);
