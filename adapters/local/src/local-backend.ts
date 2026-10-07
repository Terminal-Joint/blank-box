import type { StorageBackend } from "../../../packages/storage/src/contracts.js";
import { InMemoryDataStore } from "./in-memory-data-store.js";
import { LocalBlobStore } from "./local-blob-store.js";

export function createLocalBackend(root: string): StorageBackend {
  return { name: "local", data: new InMemoryDataStore(), blobs: new LocalBlobStore(root) };
}
