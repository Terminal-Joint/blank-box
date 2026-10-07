import { describe, expect, it } from "vitest";
import { can } from "../packages/authorization/src/authorize.js";

describe("authorization", () => {
  it("allows an admin to manage a sandbox", () => {
    expect(can(
      { userId: "u1" },
      "sandbox:manage",
      { membership: { userId: "u1", sandboxId: "s1", role: "admin", createdAt: new Date().toISOString() } }
    )).toBe(true);
  });

  it("rejects a member creating resources", () => {
    expect(can(
      { userId: "u1" },
      "resource:create",
      { membership: { userId: "u1", sandboxId: "s1", role: "member", createdAt: new Date().toISOString() } }
    )).toBe(false);
  });
});
