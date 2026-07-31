import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmod,
  copyFile,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const OLD_PASSWORD = "old-test-passphrase";
const NEW_PASSWORD = "new-test-passphrase";
const SOURCE_SCRIPT = new URL("../scripts/reset-password.sh", import.meta.url);

function toBashPath(path) {
  return path.replaceAll("\\", "/");
}

function bashExecutable() {
  return process.platform === "win32"
    ? "C:\\Program Files\\Git\\bin\\bash.exe"
    : "bash";
}

async function createScenario(
  context,
  {
    statuses = [0],
    copyFails = false,
    signal = false,
    hasPreviousPassword = true,
    running = true,
  } = {},
) {
  const projectDirectory = await mkdtemp(join(tmpdir(), "endpoint-reset-"));
  context.after(() => rm(projectDirectory, { recursive: true, force: true }));
  const scriptsDirectory = join(projectDirectory, "scripts");
  const secretsDirectory = join(projectDirectory, "secrets");
  await mkdir(scriptsDirectory);
  await mkdir(secretsDirectory);

  const resetScript = join(scriptsDirectory, "reset-password.sh");
  await copyFile(SOURCE_SCRIPT, resetScript);
  await chmod(resetScript, 0o700);
  const passwordFile = join(secretsDirectory, "home_access_password");
  const inputFile = join(projectDirectory, "new-password.input");
  if (hasPreviousPassword) {
    await writeFile(passwordFile, OLD_PASSWORD, { mode: 0o600 });
  }
  await writeFile(inputFile, NEW_PASSWORD, { mode: 0o600 });

  const logFile = join(projectDirectory, "docker.log");
  const countFile = join(projectDirectory, "run.count");
  const statusFile = join(projectDirectory, "run.statuses");
  await writeFile(statusFile, `${statuses.join("\n")}\n`, "utf8");
  const fakeDocker = join(projectDirectory, "fake-docker.sh");
  await writeFile(
    fakeDocker,
    `#!/usr/bin/env bash
set -u
printf '%s\\n' "$*" >> "\${FAKE_DOCKER_LOG}"
if [[ "$*" == "compose ps --status running --quiet publisher" ]]; then
  if [[ "\${FAKE_PUBLISHER_RUNNING:-0}" == "1" ]]; then printf '%s\\n' 'test-container'; fi
  exit 0
fi
if [[ "$*" == "compose run --rm --no-deps publisher once --force" ]]; then
  count=0
  if [[ -f "\${FAKE_RUN_COUNT}" ]]; then count="$(<"\${FAKE_RUN_COUNT}")"; fi
  count=$((count + 1))
  printf '%s\\n' "\${count}" > "\${FAKE_RUN_COUNT}"
  if [[ "\${FAKE_SIGNAL_ON_FIRST_RUN:-0}" == "1" && "\${count}" == "1" ]]; then
    kill -TERM "\${PPID}"
  fi
  status="$(sed -n "\${count}p" "\${FAKE_RUN_STATUSES}")"
  exit "\${status:-0}"
fi
exit 0
`,
    { mode: 0o700 },
  );

  let fakeCopy;
  if (copyFails) {
    fakeCopy = join(projectDirectory, "fake-copy.sh");
    await writeFile(fakeCopy, "#!/usr/bin/env bash\nexit 42\n", { mode: 0o700 });
  }

  const environment = {
    ...process.env,
    HOME_ENDPOINT_DOCKER_COMMAND: toBashPath(fakeDocker),
    FAKE_DOCKER_LOG: toBashPath(logFile),
    FAKE_RUN_COUNT: toBashPath(countFile),
    FAKE_RUN_STATUSES: toBashPath(statusFile),
    FAKE_SIGNAL_ON_FIRST_RUN: signal ? "1" : "0",
    FAKE_PUBLISHER_RUNNING: running ? "1" : "0",
  };
  if (fakeCopy) {
    environment.HOME_ENDPOINT_COPY_COMMAND = toBashPath(fakeCopy);
  }

  const result = spawnSync(
    bashExecutable(),
    [toBashPath(resetScript), "--password-file", toBashPath(inputFile)],
    { encoding: "utf8", env: environment, timeout: 30000, windowsHide: true },
  );
  const log = await readFile(logFile, "utf8").catch(() => "");
  const secretEntries = await readdir(secretsDirectory);
  return { result, log, passwordFile, secretEntries };
}

test("password reset publishes once and commits the new secret", async (context) => {
  const scenario = await createScenario(context);
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.equal(await readFile(scenario.passwordFile, "utf8"), NEW_PASSWORD);
  assert.match(scenario.log, /compose stop publisher/u);
  assert.equal(
    scenario.log.match(/compose run --rm --no-deps publisher once --force/gu)?.length,
    1,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.deepEqual(scenario.secretEntries, ["home_access_password"]);
});

test("failed new publication restores and republishes the old secret", async (context) => {
  const scenario = await createScenario(context, { statuses: [1, 0] });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, "utf8"), OLD_PASSWORD);
  assert.equal(
    scenario.log.match(/compose run --rm --no-deps publisher once --force/gu)?.length,
    2,
  );
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.deepEqual(scenario.secretEntries, ["home_access_password"]);
});

test("failed first publication retains the only secret for safe retry", async (context) => {
  const scenario = await createScenario(context, {
    statuses: [1],
    hasPreviousPassword: false,
    running: false,
  });
  assert.equal(scenario.result.status, 1);
  assert.equal(await readFile(scenario.passwordFile, "utf8"), NEW_PASSWORD);
  assert.equal(
    scenario.log.match(/compose run --rm --no-deps publisher once --force/gu)?.length,
    1,
  );
  assert.doesNotMatch(scenario.log, /compose up -d/u);
  assert.deepEqual(scenario.secretEntries, ["home_access_password"]);
});

test("backup copy failure cannot replace or stop the current secret", async (context) => {
  const scenario = await createScenario(context, { copyFails: true });
  assert.equal(scenario.result.status, 42);
  assert.equal(await readFile(scenario.passwordFile, "utf8"), OLD_PASSWORD);
  assert.doesNotMatch(scenario.log, /compose stop publisher/u);
  assert.deepEqual(scenario.secretEntries, ["home_access_password"]);
});

test("catchable interruption during publication is deferred until consistency", async (context) => {
  const scenario = await createScenario(context, { signal: true });
  assert.equal(scenario.result.status, 0, scenario.result.stderr);
  assert.equal(await readFile(scenario.passwordFile, "utf8"), NEW_PASSWORD);
  assert.match(scenario.log, /compose up -d --force-recreate publisher/u);
  assert.deepEqual(scenario.secretEntries, ["home_access_password"]);
});
