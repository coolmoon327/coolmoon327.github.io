import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmod, copyFile, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const OLD_PASSWORD = 'old-test-passphrase';
const NEW_PASSWORD = 'new-test-passphrase';
const SOURCE_SCRIPT = new URL('../scripts/reset-password.sh', import.meta.url);

function toBashPath(path) {
  return path.replaceAll('\\', '/');
}

function bashExecutable() {
  return process.platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : 'bash';
}

async function createScenario(
  context,
  {
    statuses = [0],
    copyFails = false,
    signal = false,
    hasPreviousPassword = true,
    publisherState = 'running',
    newPassword = NEW_PASSWORD,
    trace = false,
    lockStatus = 0,
    restoreStateStatus = 0,
  } = {},
) {
  const projectDirectory = await mkdtemp(join(tmpdir(), 'endpoint-reset-'));
  context.after(() => rm(projectDirectory, { recursive: true, force: true }));
  const scriptsDirectory = join(projectDirectory, 'scripts');
  const secretsDirectory = join(projectDirectory, 'secrets');
  await mkdir(scriptsDirectory);
  await mkdir(secretsDirectory);

  const resetScript = join(scriptsDirectory, 'reset-password.sh');
  await copyFile(SOURCE_SCRIPT, resetScript);
  await chmod(resetScript, 0o700);
  const passwordFile = join(secretsDirectory, 'home_access_password');
  const inputFile = join(projectDirectory, 'new-password.input');
  if (hasPreviousPassword) await writeFile(passwordFile, OLD_PASSWORD, { mode: 0o600 });
  await writeFile(inputFile, newPassword, { mode: 0o600 });

  const logFile = join(projectDirectory, 'docker.log');
  const countFile = join(projectDirectory, 'run.count');
  const statusFile = join(projectDirectory, 'run.statuses');
  await writeFile(statusFile, `${statuses.join('\n')}\n`, 'utf8');
  const fakeDocker = join(projectDirectory, 'fake-docker.sh');
  await writeFile(
    fakeDocker,
    `#!/usr/bin/env bash
set -u
printf '%s\\n' "$*" >> "\${FAKE_DOCKER_LOG}"
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
  status="$(sed -n "\${count}p" "\${FAKE_RUN_STATUSES}")"
  exit "\${status:-0}"
fi
exit 0
`,
    { mode: 0o700 },
  );

  const fakeLock = join(projectDirectory, 'fake-flock.sh');
  await writeFile(fakeLock, '#!/usr/bin/env bash\nexit "${FAKE_LOCK_STATUS:-0}"\n', { mode: 0o700 });
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
    HOME_ENDPOINT_LOCK_COMMAND: toBashPath(fakeLock),
    HOME_ENDPOINT_TIMEOUT_COMMAND: toBashPath(fakeTimeout),
    HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS: '5',
    FAKE_DOCKER_LOG: toBashPath(logFile),
    FAKE_RUN_COUNT: toBashPath(countFile),
    FAKE_RUN_STATUSES: toBashPath(statusFile),
    FAKE_SIGNAL_ON_FIRST_RUN: signal ? '1' : '0',
    FAKE_PUBLISHER_STATE: publisherState,
    FAKE_LOCK_STATUS: String(lockStatus),
    FAKE_RESTORE_STATE_STATUS: String(restoreStateStatus),
  };
  if (fakeCopy) environment.HOME_ENDPOINT_COPY_COMMAND = toBashPath(fakeCopy);

  const result = spawnSync(
    bashExecutable(),
    [...(trace ? ['-x'] : []), toBashPath(resetScript), '--password-file', toBashPath(inputFile)],
    { encoding: 'utf8', env: environment, timeout: 30000, windowsHide: true },
  );
  const log = await readFile(logFile, 'utf8').catch(() => '');
  const secretEntries = await readdir(secretsDirectory);
  return { result, log, passwordFile, secretEntries };
}

test('password reset publishes once and commits the new secret', async (context) => {
  const scenario = await createScenario(context);
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), NEW_PASSWORD);
  assert.match(scenario.log, /compose rm -sf publisher/u);
  assert.equal(
    scenario.log.match(/compose run --name home-endpoint-registry-admin-once --interactive=false --no-TTY --rm --no-deps publisher once --force/gu)?.length,
    1,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.deepEqual(scenario.secretEntries.sort(), ['.publisher-mutation.lock', 'home_access_password']);
});

test('password reset rejects short and numeric-only replacement secrets', async (context) => {
  for (const newPassword of ['short-pass', '密'.repeat(15), '🔐'.repeat(15), '1234567890123456']) {
    const scenario = await createScenario(context, { newPassword });
    assert.equal(scenario.result.status, 1);
    assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
    assert.equal(scenario.log, '');
    assert.match(scenario.result.stderr, /16-1024 Unicode characters and must not be numeric-only/u);
  }
});

test('password reset counts multibyte input as Unicode characters', async (context) => {
  for (const newPassword of ['密'.repeat(16), '🔐'.repeat(16)]) {
    const scenario = await createScenario(context, { newPassword });
    assert.equal(scenario.result.status, 0, scenario.result.stderr);
    assert.equal(await readFile(scenario.passwordFile, 'utf8'), newPassword);
  }
});

test('password reset disables shell tracing before reading the secret', async (context) => {
  const newPassword = 'trace-safe-secret';
  const scenario = await createScenario(context, { newPassword, trace: true });
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.doesNotMatch(scenario.result.stdout, new RegExp(newPassword, 'u'));
  assert.doesNotMatch(scenario.result.stderr, new RegExp(newPassword, 'u'));
});

test('failed new publication restores and republishes the old secret', async (context) => {
  const scenario = await createScenario(context, { statuses: [1, 0] });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
  assert.equal(
    scenario.log.match(/compose run --name home-endpoint-registry-admin-once --interactive=false --no-TTY --rm --no-deps publisher once --force/gu)?.length,
    2,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
});

test('failed first publication retains the only secret for safe retry', async (context) => {
  const scenario = await createScenario(context, {
    statuses: [1],
    hasPreviousPassword: false,
    publisherState: 'absent',
  });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), NEW_PASSWORD);
  assert.doesNotMatch(scenario.log, /compose (?:up|create)/u);
});

test('backup copy failure cannot replace or remove the current publisher', async (context) => {
  const scenario = await createScenario(context, { copyFails: true });
  assert.equal(scenario.result.status, 42);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
});

test('catchable interruption is returned only after password, registry, and state converge', async (context) => {
  const scenario = await createScenario(context, { signal: true });
  assert.equal(scenario.result.status, 130, scenario.result.stderr);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), NEW_PASSWORD);
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
});

test('exited, restarting, and paused containers are recreated without stale password mounts', async (context) => {
  for (const publisherState of ['exited', 'restarting', 'paused']) {
    const scenario = await createScenario(context, { publisherState });
    assert.equal(scenario.result.status, 0, scenario.result.stderr);
    assert.match(scenario.log, /compose rm -sf publisher/u);
    if (publisherState === 'exited') {
      assert.match(scenario.log, /compose create --force-recreate publisher/u);
      assert.doesNotMatch(scenario.log, /compose up -d/u);
    } else {
      assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
    }
    if (publisherState === 'paused') assert.match(scenario.log, /compose pause publisher/u);
  }
});

test('double publication failure while paused requires an operator retry', async (context) => {
  const scenario = await createScenario(context, { statuses: [1, 1], publisherState: 'paused' });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
  assert.match(scenario.result.stderr, /operator must retry publication/u);
  assert.doesNotMatch(scenario.result.stderr, /daemon will force a retry/u);
});

test('a publisher-state restore failure after successful publication keeps the new secret', async (context) => {
  const scenario = await createScenario(context, { restoreStateStatus: 19 });
  assert.equal(scenario.result.status, 19);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), NEW_PASSWORD);
  assert.equal(
    scenario.log.match(/publisher once --force/gu)?.length,
    1,
    'a post-publication state failure must not trigger rollback publication',
  );
});

test('lock contention rejects password reset before Docker or secret replacement', async (context) => {
  const scenario = await createScenario(context, { lockStatus: 1 });
  assert.equal(scenario.result.status, 75);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
  assert.equal(scenario.log, '');
});

test('unsupported publisher state fails closed before secret replacement', async (context) => {
  const scenario = await createScenario(context, { publisherState: 'dead' });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, 'utf8'), OLD_PASSWORD);
  assert.doesNotMatch(scenario.log, /compose rm -sf publisher/u);
});
