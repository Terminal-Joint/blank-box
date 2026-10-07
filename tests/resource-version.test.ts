import { describe, expect, it } from "vitest";

import { createResourceVersion } from "../packages/core/src/resource-version.js";

describe("resource version domain", () => {
  it("creates the first version", () => {
    const result = createResourceVersion({
      id: "version-1",
      resourceId: "resource-1",
      version: 1,
      createdBy: "user-1",
      now: "2026-10-08T00:00:00.000Z",
    });

    expect(result).toEqual({
      id: "version-1",
      resourceId: "resource-1",
      version: 1,
      createdAt: "2026-10-08T00:00:00.000Z",
      createdBy: "user-1",
    });
  });

  it("creates a later version", () => {
    const result = createResourceVersion({
      id: "version-2",
      resourceId: "resource-1",
      version: 2,
      createdBy: "user-2",
    });

    expect(result.version).toBe(2);
  });

  it("rejects an empty resource id", () => {
    expect(() =>
      createResourceVersion({
        resourceId: "   ",
        version: 1,
        createdBy: "user-1",
      }),
    ).toThrow("Resource version resourceId is required");
  });

  it("rejects an invalid version number", () => {
    expect(() =>
      createResourceVersion({
        resourceId: "resource-1",
        version: 0,
        createdBy: "user-1",
      }),
    ).toThrow("Resource version must be greater than 0");
  });

  it("rejects an empty creator id", () => {
    expect(() =>
      createResourceVersion({
        resourceId: "resource-1",
        version: 1,
        createdBy: "   ",
      }),
    ).toThrow("Resource version createdBy is required");
  });

  it("supports a storage reference and checksum", () => {
    const result = createResourceVersion({
      resourceId: "resource-1",
      version: 1,
      createdBy: "user-1",
      storageRef: {
        backend: "local",
        namespace: "sandbox-1",
        locator: "resources/r1/v1.bin",
      },
      checksum: "sha256:abc123",
    });

    expect(result.storageRef).toEqual({
      backend: "local",
      namespace: "sandbox-1",
      locator: "resources/r1/v1.bin",
    });

    expect(result.checksum).toBe("sha256:abc123");
  });
});
