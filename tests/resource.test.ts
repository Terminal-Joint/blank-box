import { describe, expect, it } from "vitest";

import { createResource } from "../packages/core/src/resource.js";

describe("resource domain", () => {
  it("creates a resource inside a sandbox", () => {
    const result = createResource({
      id: "resource-1",
      sandboxId: "sandbox-1",
      ownerId: "user-1",
      title: "Python Documentation",
      type: "documentation",
      description: "Tamil Python documentation",
      now: "2026-10-07T00:00:00.000Z",
    });

    expect(result).toEqual({
      id: "resource-1",
      sandboxId: "sandbox-1",
      type: "documentation",
      title: "Python Documentation",
      description: "Tamil Python documentation",
      metadata: {},
      visibility: "members",
      ownerId: "user-1",
      createdAt: "2026-10-07T00:00:00.000Z",
      updatedAt: "2026-10-07T00:00:00.000Z",
    });
  });

  it("trims the resource title and description", () => {
    const result = createResource({
      sandboxId: "sandbox-1",
      ownerId: "user-1",
      title: "  Python Docs  ",
      type: "documentation",
      description: "  Tamil documentation  ",
      now: "2026-10-07T00:00:00.000Z",
    });

    expect(result.title).toBe("Python Docs");
    expect(result.description).toBe("Tamil documentation");
  });

  it("rejects an empty sandbox id", () => {
    expect(() =>
      createResource({
        sandboxId: "   ",
        ownerId: "user-1",
        title: "Test Resource",
        type: "note",
      }),
    ).toThrow("Resource sandboxId is required");
  });

  it("rejects an empty owner id", () => {
    expect(() =>
      createResource({
        sandboxId: "sandbox-1",
        ownerId: "   ",
        title: "Test Resource",
        type: "note",
      }),
    ).toThrow("Resource ownerId is required");
  });

  it("rejects an empty title", () => {
    expect(() =>
      createResource({
        sandboxId: "sandbox-1",
        ownerId: "user-1",
        title: "   ",
        type: "note",
      }),
    ).toThrow("Resource title is required");
  });

  it("supports metadata and visibility", () => {
    const result = createResource({
      sandboxId: "sandbox-1",
      ownerId: "user-1",
      title: "AEEE Question Paper",
      type: "question-paper",
      visibility: "public",
      metadata: {
        year: 2026,
        language: "English",
        subject: "Physics",
      },
    });

    expect(result.metadata).toEqual({
      year: 2026,
      language: "English",
      subject: "Physics",
    });

    expect(result.visibility).toBe("public");
  });
});
