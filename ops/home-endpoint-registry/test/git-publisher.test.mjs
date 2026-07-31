import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  commitEncryptedEnvelope,
  prepareGitWorktree,
} from "../src/git-publisher.mjs";

function git(argumentsList, cwd) {
  const result = spawnSync("git", argumentsList, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("creates and advances only the dedicated encrypted registry branch", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "endpoint-git-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const remoteDirectory = join(directory, "remote.git");
  git(["init", "--bare", remoteDirectory], directory);

  const config = {
    stateDirectory: join(directory, "state"),
    remoteUrl: remoteDirectory,
    branch: "main",
    endpointFile: "endpoint.enc.json",
  };
  const firstContext = await prepareGitWorktree(config, { allowLocalRemoteForTests: true });
  assert.equal(firstContext.lastPayloadHash, null);
  const firstHash = "a".repeat(64);
  const firstEnvelope = { version: 1, test: "first" };
  assert.deepEqual(
    await commitEncryptedEnvelope(config, firstContext, firstEnvelope, firstHash),
    { published: true },
  );

  assert.equal(
    git(
      ["--git-dir", remoteDirectory, "show", `${config.branch}:${config.endpointFile}`],
      directory,
    ),
    JSON.stringify(firstEnvelope),
  );
  assert.equal(
    git(["--git-dir", remoteDirectory, "ls-tree", "--name-only", config.branch], directory),
    config.endpointFile,
  );

  const interruptedContext = await prepareGitWorktree(config, {
    allowLocalRemoteForTests: true,
  });
  await writeFile(
    join(interruptedContext.repoDirectory, config.endpointFile),
    `${JSON.stringify({ version: 1, test: "interrupted-before-commit" })}\n`,
    "utf8",
  );
  git(["add", "--", config.endpointFile], interruptedContext.repoDirectory);
  const interruptedBlob = git(
    ["hash-object", "--", config.endpointFile],
    interruptedContext.repoDirectory,
  );
  await writeFile(
    join(config.stateDirectory, "pending-payload-hash"),
    `${JSON.stringify({
      version: 1,
      payloadHash: "c".repeat(64),
      blobOid: interruptedBlob,
    })}\n`,
    "utf8",
  );

  const secondContext = await prepareGitWorktree(config, { allowLocalRemoteForTests: true });
  assert.equal(secondContext.lastPayloadHash, firstHash);
  await assert.rejects(
    readFile(join(config.stateDirectory, "pending-payload-hash"), "utf8"),
    { code: "ENOENT" },
  );
  assert.equal(
    git(
      ["--git-dir", remoteDirectory, "show", `${config.branch}:${config.endpointFile}`],
      directory,
    ),
    JSON.stringify(firstEnvelope),
  );
  assert.equal(
    await readFile(join(config.stateDirectory, "last-payload-hash"), "utf8"),
    `${firstHash}\n`,
  );

  const secondHash = "b".repeat(64);
  const secondEnvelope = { version: 1, test: "second" };
  assert.deepEqual(
    await commitEncryptedEnvelope(config, secondContext, secondEnvelope, secondHash),
    { published: true },
  );
  assert.equal(
    git(
      ["--git-dir", remoteDirectory, "show", `${config.branch}:${config.endpointFile}`],
      directory,
    ),
    JSON.stringify(secondEnvelope),
  );

  const aheadContext = await prepareGitWorktree(config, { allowLocalRemoteForTests: true });
  const aheadEnvelope = { version: 1, test: "committed-before-push" };
  await writeFile(
    join(aheadContext.repoDirectory, config.endpointFile),
    `${JSON.stringify(aheadEnvelope)}\n`,
    "utf8",
  );
  git(["add", "--", config.endpointFile], aheadContext.repoDirectory);
  const aheadBlob = git(["hash-object", "--", config.endpointFile], aheadContext.repoDirectory);
  const aheadHash = "d".repeat(64);
  await writeFile(
    join(config.stateDirectory, "pending-payload-hash"),
    `${JSON.stringify({ version: 1, payloadHash: aheadHash, blobOid: aheadBlob })}\n`,
    "utf8",
  );
  git(
    ["commit", "-m", "Simulate crash before push", "--", config.endpointFile],
    aheadContext.repoDirectory,
  );

  const recoveredContext = await prepareGitWorktree(config, { allowLocalRemoteForTests: true });
  assert.equal(recoveredContext.lastPayloadHash, aheadHash);
  assert.equal(
    git(
      ["--git-dir", remoteDirectory, "show", `${config.branch}:${config.endpointFile}`],
      directory,
    ),
    JSON.stringify(aheadEnvelope),
  );

  const externalDirectory = join(directory, "external-writer");
  git(["clone", "--branch", config.branch, remoteDirectory, externalDirectory], directory);
  git(["config", "user.name", "External Test Writer"], externalDirectory);
  git(["config", "user.email", "external-test@localhost"], externalDirectory);
  const externalEnvelope = { version: 1, test: "out-of-band-fast-forward" };
  await writeFile(
    join(externalDirectory, config.endpointFile),
    `${JSON.stringify(externalEnvelope)}\n`,
    "utf8",
  );
  git(["add", "--", config.endpointFile], externalDirectory);
  git(["commit", "-m", "Simulate external fast-forward"], externalDirectory);
  git(["push", "origin", config.branch], externalDirectory);

  const externalChangeContext = await prepareGitWorktree(config, {
    allowLocalRemoteForTests: true,
  });
  assert.equal(externalChangeContext.lastPayloadHash, null);
});
