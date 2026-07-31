import assert from "node:assert/strict";
import test from "node:test";
import { discoverPublicIPv4, isPublicIPv4 } from "../src/public-ip.mjs";

const PROVIDERS = [
  "https://one.example.invalid/",
  "https://two.example.invalid/",
  "https://three.example.invalid/",
];

test("distinguishes globally routable and reserved IPv4 addresses", () => {
  assert.equal(isPublicIPv4("8.8.4.4"), true);
  assert.equal(isPublicIPv4("10.1.2.3"), false);
  assert.equal(isPublicIPv4("100.64.1.2"), false);
  assert.equal(isPublicIPv4("192.0.2.9"), false);
  assert.equal(isPublicIPv4("203.0.113.9"), false);
  assert.equal(isPublicIPv4("01.2.3.4"), false);
  assert.equal(isPublicIPv4("not-an-address"), false);
});

test("requires agreement from independent discovery providers", async () => {
  const responses = new Map([
    [PROVIDERS[0], "8.8.4.4\n"],
    [PROVIDERS[1], "8.8.4.4"],
    [PROVIDERS[2], "1.1.1.1"],
  ]);
  const fetchImpl = async (url) => new Response(responses.get(url), { status: 200 });
  const result = await discoverPublicIPv4({
    providers: PROVIDERS,
    minimumAgreement: 2,
    timeoutMs: 1000,
    fetchImpl,
  });
  assert.equal(result, "8.8.4.4");
});

test("fails closed on disagreement or private responses", async () => {
  const responses = ["8.8.4.4", "1.1.1.1", "10.1.2.3"];
  let index = 0;
  const fetchImpl = async () => new Response(responses[index++], { status: 200 });
  await assert.rejects(
    discoverPublicIPv4({
      providers: PROVIDERS,
      minimumAgreement: 2,
      timeoutMs: 1000,
      fetchImpl,
    }),
    { code: "PUBLIC_IP_NO_CONSENSUS" },
  );
});

test("bounds a stalled provider without losing valid consensus", async () => {
  const fetchImpl = async (url, options) => {
    if (url === PROVIDERS[2]) {
      return await new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(options.signal.reason), { once: true });
      });
    }
    return new Response("8.8.4.4", { status: 200 });
  };
  const result = await discoverPublicIPv4({
    providers: PROVIDERS,
    minimumAgreement: 2,
    timeoutMs: 500,
    fetchImpl,
  });
  assert.equal(result, "8.8.4.4");
});

test("rejects oversized provider bodies before they can influence consensus", async () => {
  const fetchImpl = async (url) => {
    if (url === PROVIDERS[0]) return new Response("8.8.4.4", { status: 200 });
    return new Response("8.8.4.4".padEnd(256, "x"), { status: 200 });
  };
  await assert.rejects(
    discoverPublicIPv4({
      providers: PROVIDERS,
      minimumAgreement: 2,
      timeoutMs: 1000,
      fetchImpl,
    }),
    { code: "PUBLIC_IP_NO_CONSENSUS" },
  );
});
