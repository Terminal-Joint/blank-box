import type {
  ID,
  Resource,
  ResourceType,
  ResourceVisibility,
} from "./types.js";

export interface CreateResourceInput {
  sandboxId: ID;
  ownerId: ID;
  title: string;
  type: ResourceType;
  description?: string;
  visibility?: ResourceVisibility;
  metadata?: Record<string, unknown>;
  now?: string;
  id?: ID;
}

export function createResource(
  input: CreateResourceInput,
): Resource {
  const title = input.title.trim();

  if (!input.sandboxId.trim()) {
    throw new Error("Resource sandboxId is required");
  }

  if (!input.ownerId.trim()) {
    throw new Error("Resource ownerId is required");
  }

  if (!title) {
    throw new Error("Resource title is required");
  }

  const now = input.now ?? new Date().toISOString();

  return {
    id: input.id ?? crypto.randomUUID(),
    sandboxId: input.sandboxId,
    type: input.type,
    title,
    ...(input.description?.trim()
      ? { description: input.description.trim() }
      : {}),
    metadata: input.metadata ?? {},
    visibility: input.visibility ?? "members",
    ownerId: input.ownerId,
    createdAt: now,
    updatedAt: now,
  };
}
