#!/usr/bin/env node

import { PublisherError } from './errors.mjs';
import { loadServiceConfig } from './service-config.mjs';

async function main() {
  const [filePath, ...extra] = process.argv.slice(2);
  if (!filePath || extra.length > 0) {
    throw new PublisherError(
      'INVALID_ARGUMENT',
      'Usage: node src/validate-services.mjs <private-services-json>',
    );
  }

  const config = await loadServiceConfig(filePath);
  process.stdout.write(
    `${JSON.stringify({ event: 'service_config_valid', serviceCount: config.services.length })}\n`,
  );
}

main().catch((error) => {
  const code = error instanceof PublisherError ? error.code : 'UNEXPECTED_ERROR';
  process.stderr.write(`${JSON.stringify({ event: 'service_config_invalid', errorCode: code })}\n`);
  process.exitCode = 1;
});
