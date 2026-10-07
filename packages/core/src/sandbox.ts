import type {
  ID,
  MemberRole,
  Membership,
  Sandbox,
} from "./types.js";

export interface CreateSandboxInput {
  name: string;
  description?: string;
  ownerId: ID;
  now?: string;
  id?: ID;
}

export interface SandboxResult {
  sandbox: Sandbox;
  ownerMembership: Membership;
}

export function createSandbox(
  input: CreateSandboxInput,
): SandboxResult {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Sandbox name is required");
  }

  if (!input.ownerId.trim()) {
    throw new Error("Sandbox ownerId is required");
  }

  const now = input.now ?? new Date().toISOString();
  const id = input.id ?? crypto.randomUUID();

  const sandbox: Sandbox = {
    id,
    name,
    slug: slugify(name),
    ...(input.description?.trim()
      ? { description: input.description.trim() }
      : {}),
    createdAt: now,
  };

  const ownerMembership: Membership = {
    userId: input.ownerId,
    sandboxId: id,
    role: "admin" satisfies MemberRole,
    createdAt: now,
  };

  return {
    sandbox,
    ownerMembership,
  };
}

export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error(
      "Sandbox name cannot produce a valid slug",
    );
  }

  return slug;
}
