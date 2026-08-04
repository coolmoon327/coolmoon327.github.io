import assert from "node:assert/strict";
import test from "node:test";
import { validatePayload } from "../src/payload.mjs";

const LEGACY_HTTP_NOTICE = {
  en: "Use only on the home network or through Tailscale. Legacy HTTP is unencrypted and carries interception risk.",
  zh: "仅可在家中网络内或通过 Tailscale 访问。旧版 HTTP 未加密，存在被窃听的风险。",
};

function payload(serviceOverrides = {}) {
  return {
    version: 1,
    publishedAt: "2026-02-03T04:05:06.000Z",
    expiresAt: "2026-02-04T04:05:06.000Z",
    services: [
      {
        id: "dashboard",
        url: "https://example.invalid/owner",
        label: { en: "Owner dashboard", zh: "个人控制台" },
        description: { en: "Private test entry.", zh: "私有测试入口。" },
        ...serviceOverrides,
      },
    ],
  };
}

test("preserves the version 1 service shape when optional access metadata is absent", () => {
  const candidate = payload();
  assert.deepEqual(validatePayload(candidate), candidate);
});

test("rejects directories larger than the browser contract", () => {
  const candidate = payload();
  candidate.services = Array.from({ length: 33 }, (_, index) => ({
    ...candidate.services[0],
    id: `service-${index}`,
    url: `https://example.invalid/service-${index}`,
  }));
  assert.throws(() => validatePayload(candidate), { code: "INVALID_PAYLOAD" });
});

test("accepts encrypted access classification and bilingual notice metadata", () => {
  const candidate = payload({
    access: "home-or-tailnet",
    notice: {
      en: "Connect through the private network before opening this service.",
      zh: "请先连接私有网络，再打开此服务。",
    },
  });
  assert.deepEqual(validatePayload(candidate), candidate);
});

test("accepts only explicitly acknowledged private legacy HTTP payload URLs", () => {
  const candidate = payload({
    url: "http://100.64.0.1:8080/legacy",
    access: "home-or-tailnet",
    notice: LEGACY_HTTP_NOTICE,
  });
  assert.deepEqual(validatePayload(candidate), candidate);
});

test("rejects unsafe legacy HTTP payload URLs and incomplete risk notices", () => {
  const candidates = [
    payload({ url: "http://10.20.30.40/" }),
    payload({
      url: "http://10.20.30.40/",
      access: "internet",
      notice: LEGACY_HTTP_NOTICE,
    }),
    payload({
      url: "http://192.0.2.10/",
      access: "home-or-tailnet",
      notice: LEGACY_HTTP_NOTICE,
    }),
    payload({
      url: "http://0300.0250.1.1/",
      access: "home-or-tailnet",
      notice: LEGACY_HTTP_NOTICE,
    }),
    payload({
      url: "http://10.20.30.40/",
      access: "home-or-tailnet",
      notice: {
        en: "Use only on the private network.",
        zh: "仅可在内网访问。",
      },
    }),
  ];

  for (const candidate of candidates) {
    assert.throws(() => validatePayload(candidate), { code: "INVALID_PAYLOAD" });
  }
});

test("rejects invalid access values, malformed notices, and unknown service fields", () => {
  const candidates = [
    payload({ access: "private" }),
    payload({ notice: { en: "Missing Chinese notice" } }),
    payload({ notice: { en: "Unsafe\nnotice", zh: "不安全" } }),
    payload({ unexpected: true }),
  ];

  for (const candidate of candidates) {
    assert.throws(() => validatePayload(candidate));
  }
});
