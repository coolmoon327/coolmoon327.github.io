import { spawnSync } from "node:child_process";
import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  unlink,
} from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join } from "node:path";
import { writeFileAtomic } from "./atomic-file.mjs";
import { PublisherError } from "./errors.mjs";
import { readPrivateFile } from "./service-config.mjs";

const LAST_HASH_FILE = "last-payload-hash";
const LAST_BLOB_FILE = "last-endpoint-blob";
const PENDING_HASH_FILE = "pending-payload-hash";
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const GIT_OBJECT_PATTERN = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u;

function runGit(argumentsList, { cwd, environment, allowedStatuses = [0] }) {
  const result = spawnSync("git", argumentsList, {
    cwd,
    env: environment,
    encoding: "utf8",
    timeout: 60000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
    shell: false,
  });
  if (result.error || !allowedStatuses.includes(result.status)) {
    const operation = argumentsList[0] ?? "command";
    const status = result.status ?? "unavailable";
    throw new PublisherError(
      "GIT_OPERATION_FAILED",
      `Git ${operation} failed with status ${status}.`,
      { cause: result.error },
    );
  }
  return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'"'"'`)}'`;
}

function buildGitEnvironment(config, homeDirectory) {
  return {
    ...process.env,
    HOME: homeDirectory,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0",
    GIT_SSH_VARIANT: "ssh",
    GIT_SSH_COMMAND: [
      "ssh",
      `-i ${shellQuote(config.deployKeyFile)}`,
      "-o IdentitiesOnly=yes",
      "-o BatchMode=yes",
      "-o StrictHostKeyChecking=yes",
      `-o UserKnownHostsFile=${shellQuote(config.knownHostsFile)}`,
      "-o ConnectTimeout=10",
      "-o ConnectionAttempts=1",
      "-o ServerAliveInterval=10",
      "-o ServerAliveCountMax=2",
    ].join(" "),
  };
}

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readHash(path) {
  try {
    const value = (await readFile(path, "utf8")).trim();
    return HASH_PATTERN.test(value) ? value : null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function writeHash(path, hash) {
  const value = String(hash).trim();
  if (!HASH_PATTERN.test(value)) {
    throw new PublisherError("INVALID_STATE", "Payload hash is invalid.");
  }
  await writeFileAtomic(path, `${value}\n`, { mode: 0o600 });
}

async function readBlobOid(path) {
  try {
    const value = (await readFile(path, "utf8")).trim();
    return GIT_OBJECT_PATTERN.test(value) ? value : null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function writeBlobOid(path, blobOid) {
  if (!GIT_OBJECT_PATTERN.test(blobOid)) {
    throw new PublisherError("INVALID_STATE", "Endpoint blob state is invalid.");
  }
  await writeFileAtomic(path, `${blobOid}\n`, { mode: 0o600 });
}

async function readPendingState(stateDirectory) {
  const pendingPath = join(stateDirectory, PENDING_HASH_FILE);
  try {
    const value = JSON.parse(await readFile(pendingPath, "utf8"));
    if (
      value?.version !== 1 ||
      Object.keys(value).sort().join(",") !== "blobOid,payloadHash,version" ||
      !HASH_PATTERN.test(value.payloadHash) ||
      !GIT_OBJECT_PATTERN.test(value.blobOid)
    ) {
      throw new PublisherError("INVALID_STATE", "Pending publication state is invalid.");
    }
    return value;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    if (error instanceof PublisherError) throw error;
    throw new PublisherError("INVALID_STATE", "Pending publication state is invalid.", {
      cause: error,
    });
  }
}

async function writePendingState(stateDirectory, payloadHash, blobOid) {
  if (!HASH_PATTERN.test(payloadHash) || !GIT_OBJECT_PATTERN.test(blobOid)) {
    throw new PublisherError("INVALID_STATE", "Pending publication state is invalid.");
  }
  await writeFileAtomic(
    join(stateDirectory, PENDING_HASH_FILE),
    `${JSON.stringify({ version: 1, payloadHash, blobOid })}\n`,
    { mode: 0o600 },
  );
}

function headBlobOid(config, repoDirectory, environment) {
  if (!hasHead(repoDirectory, environment)) return null;
  const result = runGit(["rev-parse", `HEAD:${config.endpointFile}`], {
    cwd: repoDirectory,
    environment,
    allowedStatuses: [0, 128],
  });
  return result.status === 0 && GIT_OBJECT_PATTERN.test(result.stdout) ? result.stdout : null;
}

function pendingMatchesHead(pending, config, repoDirectory, environment) {
  return Boolean(pending && headBlobOid(config, repoDirectory, environment) === pending.blobOid);
}

async function discardPendingState(stateDirectory) {
  await unlink(join(stateDirectory, PENDING_HASH_FILE)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}

async function promotePendingHash(config, repoDirectory, environment) {
  const pending = await readPendingState(config.stateDirectory);
  if (!pending || !pendingMatchesHead(pending, config, repoDirectory, environment)) {
    throw new PublisherError(
      "GIT_UNEXPECTED_LOCAL_COMMITS",
      "A local registry commit is not bound to matching publisher state.",
    );
  }
  await writeHash(join(config.stateDirectory, LAST_HASH_FILE), pending.payloadHash);
  await writeBlobOid(join(config.stateDirectory, LAST_BLOB_FILE), pending.blobOid);
  await discardPendingState(config.stateDirectory);
  return pending.payloadHash;
}

async function lastPayloadHashForHead(config, repoDirectory, environment) {
  const [payloadHash, recordedBlob] = await Promise.all([
    readHash(join(config.stateDirectory, LAST_HASH_FILE)),
    readBlobOid(join(config.stateDirectory, LAST_BLOB_FILE)),
  ]);
  const currentBlob = headBlobOid(config, repoDirectory, environment);
  return payloadHash && recordedBlob && currentBlob === recordedBlob ? payloadHash : null;
}

async function reconcilePendingState(config, repoDirectory, environment) {
  const pending = await readPendingState(config.stateDirectory);
  if (!pending) return false;
  if (!pendingMatchesHead(pending, config, repoDirectory, environment)) {
    await discardPendingState(config.stateDirectory);
    return false;
  }
  await promotePendingHash(config, repoDirectory, environment);
  return true;
}

function hasHead(repoDirectory, environment) {
  return runGit(["rev-parse", "--verify", "HEAD"], {
    cwd: repoDirectory,
    environment,
    allowedStatuses: [0, 128],
  }).status === 0;
}

function trackedFiles(repoDirectory, environment) {
  const result = runGit(["ls-files", "-z"], { cwd: repoDirectory, environment });
  return result.stdout === "" ? [] : result.stdout.split("\0").filter(Boolean);
}

function assertDedicatedBranch(repoDirectory, environment, endpointFile) {
  const unexpected = trackedFiles(repoDirectory, environment).filter((path) => path !== endpointFile);
  if (unexpected.length > 0) {
    throw new PublisherError(
      "REGISTRY_BRANCH_NOT_DEDICATED",
      "Registry branch contains files other than the encrypted endpoint artifact.",
    );
  }
}

async function cleanInterruptedEndpoint(repoDirectory, environment, endpointFile) {
  const status = runGit(["status", "--porcelain=v1", "--untracked-files=all"], {
    cwd: repoDirectory,
    environment,
  }).stdout;
  if (status === "") return;

  const lines = status.split("\n").filter(Boolean);
  const temporaryPrefix = `.${endpointFile}.`;
  for (const line of lines) {
    const path = line.slice(3).replace(/^"|"$/gu, "");
    if (path === endpointFile) continue;
    if (path.startsWith(temporaryPrefix) && path.endsWith(".tmp")) {
      await unlink(join(repoDirectory, path)).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
      continue;
    }
    throw new PublisherError(
      "REGISTRY_WORKTREE_DIRTY",
      "Registry worktree contains an unexpected local change.",
    );
  }

  const tracked = runGit(["ls-files", "--error-unmatch", "--", endpointFile], {
    cwd: repoDirectory,
    environment,
    allowedStatuses: [0, 1],
  }).status === 0;
  if (tracked && hasHead(repoDirectory, environment)) {
    runGit(["restore", "--staged", "--worktree", "--", endpointFile], {
      cwd: repoDirectory,
      environment,
    });
  } else {
    await unlink(join(repoDirectory, endpointFile)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}

async function initializeWorktree(config, repoDirectory, environment) {
  const gitDirectory = join(repoDirectory, ".git");
  if (await pathExists(gitDirectory)) return;

  await mkdir(repoDirectory, { recursive: true, mode: 0o700 });
  const existing = await readdir(repoDirectory);
  if (existing.length > 0) {
    throw new PublisherError(
      "REGISTRY_WORKTREE_INVALID",
      "Registry worktree directory is not empty and is not a Git repository.",
    );
  }
  runGit(["init", `--initial-branch=${config.branch}`, "."], {
    cwd: repoDirectory,
    environment,
  });
  runGit(["config", "user.name", "Home Endpoint Publisher"], {
    cwd: repoDirectory,
    environment,
  });
  runGit(["config", "user.email", "home-endpoint-publisher@localhost"], {
    cwd: repoDirectory,
    environment,
  });
  runGit(["remote", "add", "origin", config.remoteUrl], {
    cwd: repoDirectory,
    environment,
  });
}

function validateExistingWorktree(config, repoDirectory, environment) {
  const remote = runGit(["remote", "get-url", "origin"], {
    cwd: repoDirectory,
    environment,
  }).stdout;
  if (remote !== config.remoteUrl) {
    throw new PublisherError(
      "REGISTRY_REMOTE_MISMATCH",
      "Registry worktree remote does not match configured remote.",
    );
  }
  const branchResult = runGit(["symbolic-ref", "--quiet", "--short", "HEAD"], {
    cwd: repoDirectory,
    environment,
    allowedStatuses: [0, 1],
  });
  if (branchResult.status === 0 && branchResult.stdout !== config.branch) {
    throw new PublisherError(
      "REGISTRY_BRANCH_MISMATCH",
      "Registry worktree is on an unexpected branch.",
    );
  }
}

async function synchronizeRemote(config, repoDirectory, environment) {
  const remoteReference = `refs/remotes/origin/${config.branch}`;
  const targetReference = `refs/heads/${config.branch}`;
  const remoteProbe = runGit(["ls-remote", "--exit-code", "--heads", "origin", targetReference], {
    cwd: repoDirectory,
    environment,
    allowedStatuses: [0, 2],
  });
  const remoteExists = remoteProbe.status === 0;

  if (remoteExists) {
    runGit(
      ["fetch", "--no-tags", "origin", `+${targetReference}:${remoteReference}`],
      { cwd: repoDirectory, environment },
    );
  }

  const localHasHead = hasHead(repoDirectory, environment);
  if (!localHasHead && remoteExists) {
    runGit(["checkout", "-B", config.branch, remoteReference], {
      cwd: repoDirectory,
      environment,
    });
    return {
      recoveredPending: await reconcilePendingState(config, repoDirectory, environment),
    };
  }
  if (!localHasHead) {
    await discardPendingState(config.stateDirectory);
    return { recoveredPending: false };
  }

  if (!remoteExists) {
    const pending = await readPendingState(config.stateDirectory);
    if (!pending || !pendingMatchesHead(pending, config, repoDirectory, environment)) {
      throw new PublisherError(
        "GIT_UNEXPECTED_LOCAL_COMMITS",
        "Registry has an unpublished local commit without matching publisher state.",
      );
    }
    runGit(["push", "origin", `HEAD:${targetReference}`], {
      cwd: repoDirectory,
      environment,
    });
    await promotePendingHash(config, repoDirectory, environment);
    return { recoveredPending: true };
  }

  const counts = runGit(["rev-list", "--left-right", "--count", `HEAD...${remoteReference}`], {
    cwd: repoDirectory,
    environment,
  }).stdout.split(/\s+/u).map(Number);
  const [ahead, behind] = counts;
  if (!Number.isSafeInteger(ahead) || !Number.isSafeInteger(behind)) {
    throw new PublisherError("GIT_OPERATION_FAILED", "Git history comparison failed.");
  }
  if (ahead > 0 && behind > 0) {
    throw new PublisherError("GIT_HISTORY_DIVERGED", "Registry branch history has diverged.");
  }
  if (ahead > 0) {
    const pending = await readPendingState(config.stateDirectory);
    if (!pending || !pendingMatchesHead(pending, config, repoDirectory, environment)) {
      throw new PublisherError(
        "GIT_UNEXPECTED_LOCAL_COMMITS",
        "Registry has an unpublished local commit without matching publisher state.",
      );
    }
    runGit(["push", "origin", `HEAD:${targetReference}`], {
      cwd: repoDirectory,
      environment,
    });
    await promotePendingHash(config, repoDirectory, environment);
    return { recoveredPending: true };
  }
  if (behind > 0) {
    runGit(["merge", "--ff-only", remoteReference], { cwd: repoDirectory, environment });
  }
  return {
    recoveredPending: await reconcilePendingState(config, repoDirectory, environment),
  };
}

async function validateGitSecretFiles(config) {
  const deployKey = await readPrivateFile(config.deployKeyFile, "Registry deploy key", 32768);
  deployKey.fill(0);
  const knownHosts = await readPrivateFile(config.knownHostsFile, "SSH known-hosts file", 131072);
  knownHosts.fill(0);
}

export async function prepareGitWorktree(config, { allowLocalRemoteForTests = false } = {}) {
  await mkdir(config.stateDirectory, { recursive: true, mode: 0o700 });
  const homeDirectory = join(config.stateDirectory, "home");
  const repoDirectory = join(config.stateDirectory, "registry-worktree");
  await mkdir(homeDirectory, { recursive: true, mode: 0o700 });

  let environment = process.env;
  if (allowLocalRemoteForTests) {
    environment = { ...process.env, HOME: homeDirectory, GIT_CONFIG_NOSYSTEM: "1", GIT_TERMINAL_PROMPT: "0" };
  } else {
    await validateGitSecretFiles(config);
    environment = buildGitEnvironment(config, homeDirectory);
  }

  await initializeWorktree(config, repoDirectory, environment);
  validateExistingWorktree(config, repoDirectory, environment);
  await cleanInterruptedEndpoint(repoDirectory, environment, config.endpointFile);
  await synchronizeRemote(config, repoDirectory, environment);
  assertDedicatedBranch(repoDirectory, environment, config.endpointFile);

  const status = runGit(["status", "--porcelain=v1", "--untracked-files=all"], {
    cwd: repoDirectory,
    environment,
  }).stdout;
  if (status !== "") {
    throw new PublisherError("REGISTRY_WORKTREE_DIRTY", "Registry worktree is not clean.");
  }

  return {
    repoDirectory,
    environment,
    lastPayloadHash: await lastPayloadHashForHead(
      config,
      repoDirectory,
      environment,
    ),
  };
}

export async function commitEncryptedEnvelope(config, context, envelope, payloadHash) {
  const endpointPath = join(context.repoDirectory, config.endpointFile);
  await writeFileAtomic(endpointPath, `${JSON.stringify(envelope)}\n`, { mode: 0o644 });
  runGit(["add", "--", config.endpointFile], {
    cwd: context.repoDirectory,
    environment: context.environment,
  });
  const blobOid = runGit(["hash-object", "--", config.endpointFile], {
    cwd: context.repoDirectory,
    environment: context.environment,
  }).stdout;
  await writePendingState(config.stateDirectory, payloadHash, blobOid);

  const hasDifference = runGit(["diff", "--cached", "--quiet", "--", config.endpointFile], {
    cwd: context.repoDirectory,
    environment: context.environment,
    allowedStatuses: [0, 1],
  }).status === 1;
  if (!hasDifference) {
    await promotePendingHash(config, context.repoDirectory, context.environment);
    return { published: false };
  }

  runGit(["commit", "-m", "Update encrypted home endpoint registry", "--", config.endpointFile], {
    cwd: context.repoDirectory,
    environment: context.environment,
  });
  runGit(["push", "origin", `HEAD:refs/heads/${config.branch}`], {
    cwd: context.repoDirectory,
    environment: context.environment,
  });
  await promotePendingHash(config, context.repoDirectory, context.environment);
  return { published: true };
}

export async function inspectGitWorktreeForTests(config) {
  const repoDirectory = join(config.stateDirectory, "registry-worktree");
  const environment = { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_TERMINAL_PROMPT: "0" };
  const result = runGit(["status", "--short", "--branch"], { cwd: repoDirectory, environment });
  const endpointStat = await stat(join(repoDirectory, config.endpointFile));
  return { status: result.stdout, endpointSize: endpointStat.size };
}
