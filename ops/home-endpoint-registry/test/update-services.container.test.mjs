import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmod, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const enabled = process.platform === 'linux' && process.env.HOME_ENDPOINT_REAL_IMAGE_TEST === '1';
const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));

function runDockerValidation(image, file, user) {
  return spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--network',
      'none',
      '--read-only',
      '--cap-drop',
      'ALL',
      '--security-opt',
      'no-new-privileges:true',
      '--pids-limit',
      '32',
      '--memory',
      '128m',
      '--cpus',
      '0.25',
      '--user',
      user,
      '--mount',
      `type=bind,source=${file},target=/run/secrets/services-candidate.json,readonly`,
      '--entrypoint',
      'node',
      image,
      'src/validate-services.mjs',
      '/run/secrets/services-candidate.json',
    ],
    { cwd: projectDirectory, encoding: 'utf8', timeout: 30000 },
  );
}

test(
  'the real Compose image reads a mode-0600 candidate only as its actual owner',
  { skip: !enabled },
  async (context) => {
    const composeEnvironment = {
      ...process.env,
      REGISTRY_REMOTE_URL: 'git@github.com:example/example.git',
    };
    const compose = spawnSync('docker', ['compose', 'config', '--images', 'publisher'], {
      cwd: projectDirectory,
      encoding: 'utf8',
      env: composeEnvironment,
      timeout: 30000,
    });
    assert.equal(compose.status, 0, compose.stderr);
    const images = compose.stdout.trim().split(/\r?\n/u).filter(Boolean);
    assert.equal(images.length, 1, compose.stdout);
    const image = images[0];
    const imageCheck = spawnSync('docker', ['image', 'inspect', image], {
      encoding: 'utf8',
      timeout: 30000,
    });
    assert.equal(imageCheck.status, 0, `Build the publisher image before this smoke test: ${image}`);

    const directory = await mkdtemp(join(tmpdir(), 'endpoint-validator-'));
    context.after(() => rm(directory, { recursive: true, force: true }));
    const validFile = join(directory, 'valid.json');
    const invalidFile = join(directory, 'invalid.json');
    const validCatalog = {
      version: 1,
      services: [
        {
          id: 'synthetic-service',
          urlTemplate: 'https://{publicIPv4}/synthetic',
          label: { en: 'Synthetic service', zh: '合成测试服务' },
          description: { en: 'Integration-test entry.', zh: '集成测试入口。' },
          access: 'internet',
        },
      ],
    };
    await writeFile(validFile, `${JSON.stringify(validCatalog)}\n`, { mode: 0o600 });
    await writeFile(invalidFile, '{}\n', { mode: 0o600 });
    await chmod(validFile, 0o600);
    await chmod(invalidFile, 0o600);
    const owner = await stat(validFile);
    const user = `${owner.uid}:${owner.gid}`;

    const valid = runDockerValidation(image, validFile, user);
    assert.equal(valid.status, 0, valid.stderr);
    assert.equal(valid.stdout.trim(), '{"event":"service_config_valid","serviceCount":1}');
    assert.doesNotMatch(`${valid.stdout}${valid.stderr}`, /synthetic-service|publicIPv4/u);

    const invalid = runDockerValidation(image, invalidFile, user);
    assert.notEqual(invalid.status, 0);
    assert.doesNotMatch(`${invalid.stdout}${invalid.stderr}`, /synthetic-service|publicIPv4/u);
  },
);
