import { describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createLocalBackend } from "../adapters/local/src/local-backend.js";
import {
  createResourceWithContent,
  getResourceContent,
} from "../packages/core/src/services/resource-service.js";

describe("resource service", () => {
  it("creates a resource, stores its content, and creates version 1", async () => {
    const root = await mkdtemp(join(tmpdir(), "solocrate-"));

    try {
      const backend = createLocalBackend(root);

      const result = await createResourceWithContent(backend, {
        id: "resource-1",
        versionId: "version-1",
        sandboxId: "sandbox-1",
        ownerId: "user-1",
        title: "Python Documentation",
        type: "documentation",
        content: new Uint8Array([1, 2, 3]),
        now: "2026-10-08T00:00:00.000Z",
      });

      expect(result.resource.id).toBe("resource-1");
      expect(result.resource.currentVersionId).toBe("version-1");

      expect(result.version.version).toBe(1);
      expect(result.version.resourceId).toBe("resource-1");

      expect(result.storageRef).toEqual({
        backend: "local",
        namespace: "sandbox-1",
        locator: "resources/resource-1/v1.bin",
      });

      expect(
        [...await backend.blobs.get(result.storageRef)],
      ).toEqual([1, 2, 3]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("retrieves content through the resource's current version", async () => {
    const root = await mkdtemp(join(tmpdir(), "solocrate-"));

    try {
      const backend = createLocalBackend(root);

      await createResourceWithContent(backend, {
        id: "resource-1",
        versionId: "version-1",
        sandboxId: "sandbox-1",
        ownerId: "user-1",
        title: "Test Resource",
        type: "note",
        content: new Uint8Array([10, 20, 30]),
      });

      const content = await getResourceContent(
        backend,
        "resource-1",
      );

      expect([...content]).toEqual([10, 20, 30]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
