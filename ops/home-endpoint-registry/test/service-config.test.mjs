import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  readPasswordSecret,
  renderServices,
  validateServiceConfig,
} from "../src/service-config.mjs";

const PUBLIC_TEST_ADDRESS = "8.8.4.4";
const LEGACY_HTTP_NOTICE = {
  en: "Use only on the home network or through Tailscale. Legacy HTTP is unencrypted and carries interception risk.",
  zh: "仅可在家中网络内或通过 Tailscale 访问。旧版 HTTP 未加密，存在被窃听的风险。",
};

function service(overrides = {}) {
  return {
    id: "dashboard",
    urlTemplate: "https://{publicIPv4}/owner",
    label: { en: "Owner dashboard", zh: "个人控制台" },
    description: { en: "Private test entry.", zh: "私有测试入口。" },
    ...overrides,
  };
}

test("reads publisher password bounds as Unicode characters", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "endpoint-password-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const passwordFile = join(directory, "password");

  for (const password of ["密".repeat(10), "🔐".repeat(1024)]) {
    await writeFile(passwordFile, password, { mode: 0o600 });
    assert.equal(await readPasswordSecret(passwordFile), password);
  }
  for (const password of ["密".repeat(9), "密".repeat(1025)]) {
    await writeFile(passwordFile, password, { mode: 0o600 });
    await assert.rejects(readPasswordSecret(passwordFile), { code: "INVALID_PASSWORD_SECRET" });
  }
});

test("keeps the encrypted directory within the browser service limit", () => {
  const services = Array.from({ length: 33 }, (_, index) =>
    service({ id: `service-${index}`, urlTemplate: `https://{publicIPv4}/service-${index}` }),
  );
  assert.throws(() => validateServiceConfig({ version: 1, services }), {
    code: "INVALID_SERVICE_CONFIG",
  });
});

test("validates, filters, and renders explicit service templates", () => {
  const config = validateServiceConfig({
    version: 1,
    services: [
      service(),
      service({
        id: "storage",
        urlTemplate: "https://{publicIPv4}/files",
        label: { en: "Storage", zh: "存储" },
        enabled: false,
      }),
    ],
  });
  assert.deepEqual(renderServices(config, PUBLIC_TEST_ADDRESS), [
    {
      id: "dashboard",
      url: `https://${PUBLIC_TEST_ADDRESS}/owner`,
      label: { en: "Owner dashboard", zh: "个人控制台" },
      description: { en: "Private test entry.", zh: "私有测试入口。" },
      access: "internet",
    },
  ]);
});

test("renders fixed private and Tailnet services without substituting the public address", () => {
  const notice = {
    en: "Connect through the private network before opening this service.",
    zh: "请先连接私有网络，再打开此服务。",
  };
  const fixedService = service({
    id: "private-dashboard",
    fixedUrl: "https://100.64.0.1:8443/dashboard",
    access: "home-or-tailnet",
    notice,
  });
  delete fixedService.urlTemplate;
  const config = validateServiceConfig({ version: 1, services: [fixedService] });

  assert.deepEqual(renderServices(config, PUBLIC_TEST_ADDRESS), [
    {
      id: "private-dashboard",
      url: "https://100.64.0.1:8443/dashboard",
      label: { en: "Owner dashboard", zh: "个人控制台" },
      description: { en: "Private test entry.", zh: "私有测试入口。" },
      access: "home-or-tailnet",
      notice,
    },
  ]);
});

test("renders explicitly acknowledged legacy HTTP only for private fixed services", () => {
  const legacyService = service({
    id: "legacy-dashboard",
    fixedUrl: "http://10.20.30.40:8080/legacy",
    access: "home-or-tailnet",
    notice: LEGACY_HTTP_NOTICE,
  });
  delete legacyService.urlTemplate;
  const config = validateServiceConfig({ version: 1, services: [legacyService] });

  assert.deepEqual(renderServices(config, PUBLIC_TEST_ADDRESS), [
    {
      id: "legacy-dashboard",
      url: "http://10.20.30.40:8080/legacy",
      label: { en: "Owner dashboard", zh: "个人控制台" },
      description: { en: "Private test entry.", zh: "私有测试入口。" },
      access: "home-or-tailnet",
      notice: LEGACY_HTTP_NOTICE,
    },
  ]);
});

test("rejects legacy HTTP without an explicit bilingual scope and risk notice", () => {
  const invalidNotices = [
    undefined,
    {
      en: "Connect through the private network before opening this service.",
      zh: "请先连接私有网络，再打开此服务。",
    },
    {
      en: "Use only at home or through Tailscale. Legacy HTTP is unencrypted.",
      zh: "仅可在家中网络内或通过 Tailscale 访问。",
    },
    {
      en: "Legacy HTTP is unencrypted and carries risk.",
      zh: "仅可在家中网络内或通过 Tailscale 访问。旧版 HTTP 未加密。",
    },
  ];

  for (const notice of invalidNotices) {
    const candidate = service({
      fixedUrl: "http://10.20.30.40/",
      access: "home-or-tailnet",
      ...(notice === undefined ? {} : { notice }),
    });
    delete candidate.urlTemplate;
    assert.throws(() => validateServiceConfig({ version: 1, services: [candidate] }), {
      code: "INVALID_SERVICE_CONFIG",
    });
  }

  const internetCandidate = service({
    fixedUrl: "http://10.20.30.40/",
    access: "internet",
    notice: LEGACY_HTTP_NOTICE,
  });
  delete internetCandidate.urlTemplate;
  assert.throws(() => validateServiceConfig({ version: 1, services: [internetCandidate] }), {
    code: "INVALID_SERVICE_CONFIG",
  });
});

test("rejects legacy HTTP on public, loopback, and non-canonical addresses", () => {
  const invalidUrls = [
    "http://192.0.2.10/",
    "http://127.0.0.1/",
    "http://localhost/",
    "http://0300.0250.1.1/",
  ];

  for (const fixedUrl of invalidUrls) {
    const candidate = service({
      fixedUrl,
      access: "home-or-tailnet",
      notice: LEGACY_HTTP_NOTICE,
    });
    delete candidate.urlTemplate;
    assert.throws(() => validateServiceConfig({ version: 1, services: [candidate] }), {
      code: "INVALID_SERVICE_CONFIG",
    });
  }
});

test("rejects unknown keys, duplicate IDs, and unsupported placeholders", () => {
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ note: "no" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service(), service({ urlTemplate: "https://{publicIPv4}/second" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ urlTemplate: "https://{anotherToken}/" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
});

test("rejects templates that send the discovered address to another host", () => {
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [
          service({ urlTemplate: "https://example.invalid/observe?address={publicIPv4}" }),
        ],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
});

test("requires exactly one locator and explicit private access for fixed URLs", () => {
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ fixedUrl: "https://10.20.30.40/" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () => {
      const candidate = service();
      delete candidate.urlTemplate;
      return validateServiceConfig({ version: 1, services: [candidate] });
    },
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ fixedUrl: "https://10.20.30.40/", access: "home-or-tailnet" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () => {
      const candidate = service({ fixedUrl: "https://10.20.30.40/" });
      delete candidate.urlTemplate;
      return validateServiceConfig({ version: 1, services: [candidate] });
    },
    { code: "INVALID_SERVICE_CONFIG" },
  );
});

test("rejects public, loopback, credentialed, and non-canonical fixed URLs", () => {
  const invalidUrls = [
    "https://192.0.2.10/",
    "https://127.0.0.1/",
    "https://localhost/",
    "https://user:password@10.20.30.40/",
    "https://0300.0250.1.1/",
  ];

  for (const fixedUrl of invalidUrls) {
    const candidate = service({ fixedUrl, access: "home-or-tailnet" });
    delete candidate.urlTemplate;
    assert.throws(() => validateServiceConfig({ version: 1, services: [candidate] }), {
      code: "INVALID_SERVICE_CONFIG",
    });
  }
});

test("accepts only the intended RFC1918 and CGNAT IPv4 ranges", () => {
  const accepted = [
    "https://10.0.0.1/",
    "https://172.16.0.1/",
    "https://172.31.255.254/",
    "https://192.168.0.1/",
    "https://100.64.0.1/",
    "https://100.127.255.254/",
  ];
  const rejected = [
    "https://172.15.255.254/",
    "https://172.32.0.1/",
    "https://100.63.255.254/",
    "https://100.128.0.1/",
    "https://169.254.1.1/",
  ];

  for (const fixedUrl of accepted) {
    const candidate = service({ fixedUrl, access: "home-or-tailnet" });
    delete candidate.urlTemplate;
    assert.doesNotThrow(() => validateServiceConfig({ version: 1, services: [candidate] }));
  }
  for (const fixedUrl of rejected) {
    const candidate = service({ fixedUrl, access: "home-or-tailnet" });
    delete candidate.urlTemplate;
    assert.throws(() => validateServiceConfig({ version: 1, services: [candidate] }), {
      code: "INVALID_SERVICE_CONFIG",
    });
  }
});

test("rejects plain HTTP and malformed bilingual metadata", () => {
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ urlTemplate: "http://{publicIPv4}/owner" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ label: { en: "Owner dashboard", zh: "" } })],
      }),
    { code: "INVALID_LOCALIZED_TEXT" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ description: { en: "Unsafe\ntext", zh: "不安全" } })],
      }),
    { code: "INVALID_LOCALIZED_TEXT" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ access: "private" })],
      }),
    { code: "INVALID_SERVICE_CONFIG" },
  );
  assert.throws(
    () =>
      validateServiceConfig({
        version: 1,
        services: [service({ notice: { en: "", zh: "仅限内部访问" } })],
      }),
    { code: "INVALID_LOCALIZED_TEXT" },
  );
});
