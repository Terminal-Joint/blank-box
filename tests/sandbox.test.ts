import { describe, expect, it } from "vitest";

import {
  createSandbox,
  slugify,
} from "../packages/core/src/sandbox.js";

describe("sandbox domain", () => {
  it("creates a sandbox and admin membership for its owner", () => {
    const result = createSandbox({
      id: "sandbox-1",
      ownerId: "user-1",
      name: "PyTamil Community",
      description: "Tamil Python community resources",
      now: "2026-10-07T00:00:00.000Z",
    });

    expect(result.sandbox).toEqual({
      id: "sandbox-1",
      name: "PyTamil Community",
      slug: "pytamil-community",
      description: "Tamil Python community resources",
      createdAt: "2026-10-07T00:00:00.000Z",
    });

    expect(result.ownerMembership).toEqual({
      userId: "user-1",
      sandboxId: "sandbox-1",
      role: "admin",
      createdAt: "2026-10-07T00:00:00.000Z",
    });
  });

  it("rejects an empty sandbox name", () => {
    expect(() =>
      createSandbox({
        ownerId: "user-1",
        name: "   ",
      }),
    ).toThrow("Sandbox name is required");
  });

  it("creates URL-safe slugs", () => {
    expect(
      slugify("  Open Source / Tamil  "),
    ).toBe("open-source-tamil");
  });
});
