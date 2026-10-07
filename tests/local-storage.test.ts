import { describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LocalBlobStore } from "../adapters/local/src/local-blob-store.js";

describe("local blob store", () => {
  it("stores and retrieves bytes using a logical reference", async () => {
    const root = await mkdtemp(join(tmpdir(), "blank-box-"));
    try {
      const store = new LocalBlobStore(root);
      const ref = await store.put("sandbox-1", "resources/r1/v1.bin", new Uint8Array([1,2,3]));
      expect([...await store.get(ref)]).toEqual([1,2,3]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
