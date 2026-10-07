import { randomUUID } from "node:crypto";
import type { Resource, Sandbox } from "../../../packages/core/src/types.js";
import type { StorageBackend } from "../../../packages/storage/src/contracts.js";

export async function createSandbox(
  backend: StorageBackend,
  name: string,
  slug: string,
  description?: string
): Promise<Sandbox> {
  const sandbox = { id: randomUUID(), name, slug, description, createdAt: new Date().toISOString() };
  await backend.data.createSandbox(sandbox);
  return sandbox;
}

export async function createResource(
  backend: StorageBackend,
  input: {
    sandboxId: string;
    ownerId: string;
    type: Resource["type"];
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    visibility?: Resource["visibility"];
  }
): Promise<Resource> {
  const now = new Date().toISOString();
  const resource: Resource = {
    id: randomUUID(),
    sandboxId: input.sandboxId,
    ownerId: input.ownerId,
    type: input.type,
    title: input.title,
    description: input.description,
    metadata: input.metadata ?? {},
    visibility: input.visibility ?? "members",
    createdAt: now,
    updatedAt: now
  };
  await backend.data.createResource(resource);
  return resource;
}
