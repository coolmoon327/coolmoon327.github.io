#!/usr/bin/env node
import { PublisherError } from "./errors.mjs";
import { runDaemon, runOnce } from "./publisher.mjs";
import { loadRuntimeConfig } from "./runtime-config.mjs";

function usage() {
  process.stdout.write(
    [
      "Usage:",
      "  node src/cli.mjs once [--force]",
      "  node src/cli.mjs daemon",
      "",
      "once    Run one discovery and publish cycle.",
      "--force Re-encrypt and publish even when service endpoints are unchanged.",
      "daemon  Repeat cycles using PUBLISH_INTERVAL_SECONDS.",
      "",
    ].join("\n"),
  );
}

async function main() {
  const [command, ...argumentsList] = process.argv.slice(2);
  if (command === "help" || command === "--help" || command === "-h") {
    usage();
    return;
  }

  const config = loadRuntimeConfig();
  if (command === "once") {
    if (argumentsList.some((argument) => argument !== "--force")) {
      throw new PublisherError("INVALID_ARGUMENT", "Unknown one-shot argument.");
    }
    await runOnce(config, { force: argumentsList.includes("--force") });
    return;
  }
  if (command === "daemon" && argumentsList.length === 0) {
    await runDaemon(config);
    return;
  }
  usage();
  throw new PublisherError("INVALID_ARGUMENT", "A valid command is required.");
}

main().catch((error) => {
  const code = error instanceof PublisherError ? error.code : "UNEXPECTED_ERROR";
  process.stderr.write(`${JSON.stringify({ event: "publisher_exit", errorCode: code })}\n`);
  process.exitCode = code === "PUBLISH_LOCK_BUSY" ? 75 : 1;
});
