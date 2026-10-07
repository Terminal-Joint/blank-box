import type {
  ID,
  Resource,
  ResourceType,
  ResourceVersion,
  ResourceVisibility,
  StorageRef,
} from "../types.js";

import type { StorageBackend } from "../../../storage/src/contracts.js";

export interface CreateResourceWithContentInput {
  id?: ID;
  versionId?: ID;
  sandboxId: ID;
  ownerId: ID;
  title: string;
  type: ResourceType;
  description?: string;
  visibility?: ResourceVisibility;
  metadata?: Record<string, unknown>;
  content: Uint8Array;
  locator?: string;
  checksum?: string;
  now?: string;
}

export interface StoredResource {
  resource: Resource;
  version: ResourceVersion;
  storageRef: StorageRef;
}

export async function createResourceWithContent(
  backend: StorageBackend,
  input: CreateResourceWithContentInput,
): Promise<StoredResource> {
  const now = input.now ?? new Date().toISOString();

  const resourceId = input.id ?? crypto.randomUUID();
  const versionId = input.versionId ?? crypto.randomUUID();

  const resource: Resource = {
    id: resourceId,
    sandboxId: input.sandboxId,
    type: input.type,
    title: input.title.trim(),
    ...(input.description?.trim()
      ? { description: input.description.trim() }
      : {}),
    metadata: input.metadata ?? {},
    visibility: input.visibility ?? "members",
    ownerId: input.ownerId,
    createdAt: now,
    updatedAt: now,
  };

  if (!resource.sandboxId.trim()) {
    throw new Error("Resource sandboxId is required");
  }

  if (!resource.ownerId.trim()) {
    throw new Error("Resource ownerId is required");
  }

  if (!resource.title) {
    throw new Error("Resource title is required");
  }

  const locator =
    input.locator ?? `resources/${resourceId}/v1.bin`;

  const storageRef = await backend.blobs.put(
    input.sandboxId,
    locator,
    input.content,
  );

  const version: ResourceVersion = {
    id: versionId,
    resourceId,
    version: 1,
    storageRef,
    ...(input.checksum ? { checksum: input.checksum } : {}),
    createdAt: now,
    createdBy: input.ownerId,
  };

  resource.currentVersionId = version.id;

  await backend.data.createResource(resource);
  await backend.data.createResourceVersion(version);

  return {
    resource,
    version,
    storageRef,
  };
}

export async function getResourceContent(
  backend: StorageBackend,
  resourceId: ID,
): Promise<Uint8Array> {
  const resource = await backend.data.getResource(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (!resource.currentVersionId) {
    throw new Error("Resource has no current version");
  }

  const version = await backend.data.getResourceVersion(
    resource.currentVersionId,
  );

  if (!version) {
    throw new Error("Resource version not found");
  }

  if (!version.storageRef) {
    throw new Error("Resource version has no storage reference");
  }

  return backend.blobs.get(version.storageRef);
}
