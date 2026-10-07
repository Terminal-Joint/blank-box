import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { BlobStore } from "../../../packages/storage/src/contracts.js";
import type { StorageRef } from "../../../packages/core/src/types.js";

export class LocalBlobStore implements BlobStore {
  constructor(private readonly root: string) {}

  async put(namespace: string, locator: string, content: Uint8Array): Promise<StorageRef> {
    const path = join(this.root, namespace, locator);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
    return { backend: "local", namespace, locator };
  }

  async get(ref: StorageRef): Promise<Uint8Array> {
    if (ref.backend !== "local") throw new Error("Unsupported backend: " + ref.backend);
    return readFile(join(this.root, ref.namespace, ref.locator));
  }

  async delete(ref: StorageRef): Promise<void> {
    if (ref.backend !== "local") throw new Error("Unsupported backend: " + ref.backend);
    await unlink(join(this.root, ref.namespace, ref.locator));
  }
}
