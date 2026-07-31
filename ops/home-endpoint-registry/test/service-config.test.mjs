import assert from "node:assert/strict";
import test from "node:test";
import { renderServices, validateServiceConfig } from "../src/service-config.mjs";

const PUBLIC_TEST_ADDRESS = "8.8.4.4";

function service(overrides = {}) {
  return {
    id: "dashboard",
    urlTemplate: "https://{publicIPv4}/owner",
    label: { en: "Owner dashboard", zh: "个人控制台" },
    description: { en: "Private test entry.", zh: "私有测试入口。" },
    ...overrides,
  };
}

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
    },
  ]);
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
        services: [
          service(),
          service({ urlTemplate: "https://{publicIPv4}/second" }),
        ],
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
});
