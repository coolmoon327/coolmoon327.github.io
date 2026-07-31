import { mkdir, open, rmdir, stat, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { PublisherError } from "./errors.mjs";

const OWNER_FILE = "owner.json";
const DEFAULT_STALE_AFTER_MS = 300000;

async function removeKnownStaleLock(lockDirectory) {
  const ownerPath = join(lockDirectory, OWNER_FILE);
  await unlink(ownerPath).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await rmdir(lockDirectory);
}

export async function acquirePublishLock(stateDirectory, { staleAfterMs = DEFAULT_STALE_AFTER_MS } = {}) {
  const resolvedState = resolve(stateDirectory);
  const lockDirectory = resolve(resolvedState, "publish.lock");
  if (!lockDirectory.startsWith(`${resolvedState}${process.platform === "win32" ? "\\" : "/"}`)) {
    throw new PublisherError("INVALID_CONFIGURATION", "Publish lock path escaped state directory.");
  }

  try {
    await mkdir(lockDirectory, { mode: 0o700 });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    let lockStat;
    try {
      lockStat = await stat(lockDirectory);
    } catch (statError) {
      throw new PublisherError("PUBLISH_LOCK_BUSY", "Another publish operation is active.", {
        cause: statError,
      });
    }
    if (Date.now() - lockStat.mtimeMs <= staleAfterMs) {
      throw new PublisherError("PUBLISH_LOCK_BUSY", "Another publish operation is active.");
    }
    try {
      await removeKnownStaleLock(lockDirectory);
      await mkdir(lockDirectory, { mode: 0o700 });
    } catch (cleanupError) {
      throw new PublisherError("PUBLISH_LOCK_BUSY", "A stale publish lock could not be recovered.", {
        cause: cleanupError,
      });
    }
  }

  const ownerPath = join(lockDirectory, OWNER_FILE);
  const handle = await open(ownerPath, "wx", 0o600);
  await handle.writeFile(
    `${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() })}\n`,
  );
  await handle.sync();
  await handle.close();

  let released = false;
  return async () => {
    if (released) return;
    released = true;
    await unlink(ownerPath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await rmdir(lockDirectory).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  };
}
