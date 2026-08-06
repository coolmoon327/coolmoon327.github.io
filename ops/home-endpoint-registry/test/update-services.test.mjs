import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  chmod,
  copyFile,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

const OLD_SERVICES = `${JSON.stringify({
  version: 1,
  services: [
    {
      id: 'old-service',
      urlTemplate: 'https://{publicIPv4}/old',
      label: { en: 'Old service', zh: '旧服务' },
      description: { en: 'Previous private entry.', zh: '原有私有入口。' },
      access: 'internet',
    },
  ],
})}\n`;
const NEW_SERVICES = `${JSON.stringify({
  version: 1,
  services: [
    {
      id: 'new-service',
      urlTemplate: 'https://{publicIPv4}/new',
      label: { en: 'New service', zh: '新服务' },
      description: { en: 'Replacement private entry.', zh: '替换后的私有入口。' },
      access: 'internet',
    },
  ],
})}\n`;
const SOURCE_SCRIPT = new URL('../scripts/update-services.sh', import.meta.url);

function toBashPath(path) {
  return path.replaceAll('\\', '/');
}

function bashExecutable() {
  return process.platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : 'bash';
}

async function createScenario(
  context,
  {
    publishStatuses = [0],
    validationStatus = 0,
    publisherState = 'running',
    signal = false,
    copyFails = false,
    lockStatus = 0,
    previousPathKind = 'absent',
    dockerTimeoutSeconds = 5,
    holdRealLock = false,
    restoreStateStatus = 0,
  } = {},
) {
  const projectDirectory = await mkdtemp(join(tmpdir(), 'endpoint-services-'));
  context.after(() => rm(projectDirectory, { recursive: true, force: true }));
  const scriptsDirectory = join(projectDirectory, 'scripts');
  const secretsDirectory = join(projectDirectory, 'secrets');
  await mkdir(scriptsDirectory);
  await mkdir(secretsDirectory);

  const updateScript = join(scriptsDirectory, 'update-services.sh');
  await copyFile(SOURCE_SCRIPT, updateScript);
  await chmod(updateScript, 0o700);
  const servicesFile = join(secretsDirectory, 'services.json');
  const previousFile = join(secretsDirectory, 'services.json.previous');
  const lockFile = join(secretsDirectory, '.publisher-mutation.lock');
  const inputFile = join(projectDirectory, 'services.input.json');
  await writeFile(servicesFile, OLD_SERVICES, { mode: 0o600 });
  await writeFile(inputFile, NEW_SERVICES, { mode: 0o600 });
  if (previousPathKind === 'directory') await mkdir(previousFile);

  const logFile = join(projectDirectory, 'docker.log');
  const countFile = join(projectDirectory, 'run.count');
  const statusFile = join(projectDirectory, 'run.statuses');
  await writeFile(statusFile, `${publishStatuses.join('\n')}\n`, 'utf8');
  const fakeDocker = join(projectDirectory, 'fake-docker.sh');
  await writeFile(
    fakeDocker,
    `#!/usr/bin/env bash
set -u
printf '%s\\n' "$*" >> "\${FAKE_DOCKER_LOG}"
if [[ "$*" == run\\ --rm\\ --network\\ none* ]]; then
  if [[ "\${FAKE_VALIDATION_STATUS:-0}" == "0" ]]; then
    printf '%s\\n' '{"event":"service_config_valid","serviceCount":1}'
  fi
  exit "\${FAKE_VALIDATION_STATUS:-0}"
fi
if [[ "$*" == "compose config --images publisher" ]]; then
  printf '%s\\n' 'home-endpoint-registry-publisher:local'
  exit 0
fi
if [[ "$*" == "compose ps --all --quiet publisher" ]]; then
  if [[ "\${FAKE_PUBLISHER_STATE:-absent}" != "absent" ]]; then printf '%s\\n' 'test-container'; fi
  exit 0
fi
if [[ "$*" == inspect\\ --format* ]]; then
  printf '%s\\n' "\${FAKE_PUBLISHER_STATE:-absent}"
  exit 0
fi
if [[ "$*" == "compose up -d --force-recreate publisher" ]]; then
  exit "\${FAKE_RESTORE_STATE_STATUS:-0}"
fi
if [[ "$*" == compose\\ run\\ --name\\ home-endpoint-registry-admin-once\\ --interactive=false\\ --no-TTY\\ --rm\\ --no-deps* ]]; then
  count=0
  if [[ -f "\${FAKE_RUN_COUNT}" ]]; then count="$(<"\${FAKE_RUN_COUNT}")"; fi
  count=$((count + 1))
  printf '%s\\n' "\${count}" > "\${FAKE_RUN_COUNT}"
  if [[ "\${FAKE_SIGNAL_ON_FIRST_RUN:-0}" == "1" && "\${count}" == "1" ]]; then
    kill -TERM "\${HOME_ENDPOINT_UPDATER_PID}"
  fi
  if [[ "\${FAKE_DELAY_FIRST_RUN_SECONDS:-0}" != "0" && "\${count}" == "1" ]]; then
    sleep "\${FAKE_DELAY_FIRST_RUN_SECONDS}"
  fi
  status="$(sed -n "\${count}p" "\${FAKE_RUN_STATUSES}")"
  exit "\${status:-0}"
fi
exit 0
`,
    { mode: 0o700 },
  );

  const fakeLock = join(projectDirectory, 'fake-flock.sh');
  await writeFile(fakeLock, '#!/usr/bin/env bash\nexit "${FAKE_LOCK_STATUS:-0}"\n', {
    mode: 0o700,
  });
  const fakeTimeout = join(projectDirectory, 'fake-timeout.sh');
  await writeFile(fakeTimeout, '#!/usr/bin/env bash\nshift 3\nexec "$@"\n', { mode: 0o700 });

  let fakeCopy;
  if (copyFails) {
    fakeCopy = join(projectDirectory, 'fake-copy.sh');
    await writeFile(fakeCopy, '#!/usr/bin/env bash\nexit 42\n', { mode: 0o700 });
  }

  const environment = {
    ...process.env,
    HOME_ENDPOINT_DOCKER_COMMAND: toBashPath(fakeDocker),
    HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS: String(dockerTimeoutSeconds),
    HOME_ENDPOINT_TIMEOUT_COMMAND: toBashPath(fakeTimeout),
    FAKE_DOCKER_LOG: toBashPath(logFile),
    FAKE_RUN_COUNT: toBashPath(countFile),
    FAKE_RUN_STATUSES: toBashPath(statusFile),
    FAKE_VALIDATION_STATUS: String(validationStatus),
    FAKE_PUBLISHER_STATE: publisherState,
    FAKE_SIGNAL_ON_FIRST_RUN: signal ? '1' : '0',
    FAKE_LOCK_STATUS: String(lockStatus),
    FAKE_RESTORE_STATE_STATUS: String(restoreStateStatus),
  };
  if (!holdRealLock) environment.HOME_ENDPOINT_LOCK_COMMAND = toBashPath(fakeLock);
  if (fakeCopy) environment.HOME_ENDPOINT_COPY_COMMAND = toBashPath(fakeCopy);

  let lockHolder;
  if (holdRealLock) {
    lockHolder = spawn('flock', ['-n', lockFile, 'sleep', '10'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    await delay(150);
    assert.equal(lockHolder.exitCode, null, 'real flock holder exited before the test');
  }

  const result = spawnSync(
    bashExecutable(),
    [toBashPath(updateScript), '--services-file', toBashPath(inputFile)],
    { encoding: 'utf8', env: environment, timeout: 30000, windowsHide: true },
  );
  if (lockHolder) {
    lockHolder.kill('SIGTERM');
    await new Promise((resolve) => lockHolder.once('exit', resolve));
  }

  const log = await readFile(logFile, 'utf8').catch(() => '');
  const secretEntries = await readdir(secretsDirectory);
  return { result, log, servicesFile, previousFile, secretEntries };
}

test('service update validates, publishes once, and preserves the previous catalog', async (context) => {
  const scenario = await createScenario(context);
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), NEW_SERVICES);
  assert.equal(await readFile(scenario.previousFile, 'utf8'), OLD_SERVICES);
  assert.match(scenario.log, /run --rm --network none/u);
  assert.match(scenario.log, /--user [0-9]+:[0-9]+/u);
  assert.match(scenario.log, /compose rm -sf publisher/u);
  assert.equal(
    scenario.log.match(/compose run --name home-endpoint-registry-admin-once --interactive=false --no-TTY --rm --no-deps publisher once --force/gu)?.length,
    1,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.deepEqual(scenario.secretEntries.sort(), [
    '.publisher-mutation.lock',
    'services.json',
    'services.json.previous',
  ]);
});

test('invalid service input cannot remove a container or replace the current catalog', async (context) => {
  const scenario = await createScenario(context, { validationStatus: 23 });
  assert.equal(scenario.result.status, 23);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
  assert.doesNotMatch(scenario.log, /publisher once --force/u);
  assert.deepEqual(scenario.secretEntries.sort(), ['.publisher-mutation.lock', 'services.json']);
});

test('failed publication restores and republishes the previous catalog', async (context) => {
  const scenario = await createScenario(context, { publishStatuses: [1, 0] });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.equal(await readFile(scenario.previousFile, 'utf8'), OLD_SERVICES);
  assert.equal(
    scenario.log.match(/compose run --name home-endpoint-registry-admin-once --interactive=false --no-TTY --rm --no-deps publisher once --force/gu)?.length,
    2,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
});

test('an exited publisher is recreated but remains stopped after success', async (context) => {
  const scenario = await createScenario(context, { publisherState: 'exited' });
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), NEW_SERVICES);
  assert.match(scenario.log, /compose rm -sf publisher/u);
  assert.match(scenario.log, /compose create --force-recreate publisher/u);
  assert.doesNotMatch(scenario.log, /compose up -d/u);
});

test('an absent publisher remains absent after success', async (context) => {
  const scenario = await createScenario(context, { publisherState: 'absent' });
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
  assert.doesNotMatch(scenario.log, /compose (?:up|create)/u);
});

test('restarting and paused publishers cannot retain the old bind-mount inode', async (context) => {
  for (const publisherState of ['restarting', 'paused']) {
    const scenario = await createScenario(context, { publisherState });
    assert.equal(scenario.result.status, 0, scenario.result.stderr);
    assert.match(scenario.log, /compose rm -sf publisher/u);
    assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
    if (publisherState === 'paused') assert.match(scenario.log, /compose pause publisher/u);
  }
});

test('copy failure cannot remove a container or replace the current catalog', async (context) => {
  const scenario = await createScenario(context, { copyFails: true });
  assert.equal(scenario.result.status, 42);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
  assert.deepEqual(scenario.secretEntries.sort(), ['.publisher-mutation.lock', 'services.json']);
});

test('catchable interruption is honored after catalog, registry, and container state converge', async (context) => {
  const scenario = await createScenario(context, { signal: true });
  assert.equal(scenario.result.status, 130, scenario.result.stderr);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), NEW_SERVICES);
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
});

test('a timed-out publication rolls back before returning', async (context) => {
  const scenario = await createScenario(context, {
    publishStatuses: [124, 0],
  });
  assert.equal(scenario.result.status, 124, scenario.result.stderr);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.equal(
    scenario.log.match(/compose run --name home-endpoint-registry-admin-once --interactive=false --no-TTY --rm --no-deps publisher once --force/gu)?.length,
    2,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
});

test('double publication failure with a stopped daemon requires an explicit operator retry', async (context) => {
  const scenario = await createScenario(context, {
    publishStatuses: [1, 1],
    publisherState: 'exited',
  });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.match(scenario.result.stderr, /operator must retry publication/u);
  assert.doesNotMatch(scenario.result.stderr, /daemon will force a retry/u);
  assert.match(scenario.log, /compose create --force-recreate publisher/u);
  assert.doesNotMatch(scenario.log, /compose up -d/u);
});

test('double publication failure with a paused daemon also requires an operator retry', async (context) => {
  const scenario = await createScenario(context, {
    publishStatuses: [1, 1],
    publisherState: 'paused',
  });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.match(scenario.result.stderr, /operator must retry publication/u);
  assert.doesNotMatch(scenario.result.stderr, /daemon will force a retry/u);
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.match(scenario.log, /compose pause publisher/u);
});

test('an abnormal previous-catalog path is rejected before validation or mutation', async (context) => {
  const scenario = await createScenario(context, { previousPathKind: 'directory' });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.equal(scenario.log, '');
  assert.match(scenario.result.stderr, /previous-catalog path/u);
});

test('lock contention rejects a second updater before Docker is invoked', async (context) => {
  const scenario = await createScenario(context, { lockStatus: 1 });
  assert.equal(scenario.result.status, 75);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.equal(scenario.log, '');
  assert.match(scenario.result.stderr, /already running/u);
});

test('unsupported container states fail closed before removing the publisher', async (context) => {
  const scenario = await createScenario(context, { publisherState: 'dead' });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
  assert.match(scenario.result.stderr, /Unsupported publisher container state/u);
});

test('a state-restore failure after successful publication keeps the new catalog', async (context) => {
  const scenario = await createScenario(context, { restoreStateStatus: 19 });
  assert.equal(scenario.result.status, 19);
  assert.equal(await readFile(scenario.servicesFile, 'utf8'), NEW_SERVICES);
  assert.equal(
    scenario.log.match(/publisher once --force/gu)?.length,
    1,
    'a post-publication state failure must not trigger rollback publication',
  );
});

const hasRealFlock =
  process.platform === 'linux' && spawnSync('flock', ['--version'], { stdio: 'ignore' }).status === 0;
test(
  'the host flock excludes a genuinely concurrent mutation',
  { skip: !hasRealFlock },
  async (context) => {
    const scenario = await createScenario(context, { holdRealLock: true });
    assert.equal(scenario.result.status, 75);
    assert.equal(await readFile(scenario.servicesFile, 'utf8'), OLD_SERVICES);
    assert.equal(scenario.log, '');
  },
);
