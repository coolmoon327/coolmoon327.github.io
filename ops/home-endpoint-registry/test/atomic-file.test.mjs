import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { writeFileAtomic } from "../src/atomic-file.mjs";

test("atomically replaces a file without leaving temporary artifacts", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "endpoint-atomic-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const target = join(directory, "state.json");
  await writeFileAtomic(target, "first\n");
  await writeFileAtomic(target, "second\n");
  assert.equal(await readFile(target, "utf8"), "second\n");
  assert.deepEqual(await readdir(directory), ["state.json"]);
});
