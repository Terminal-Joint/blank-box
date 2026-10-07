import type {
  ID,
  ResourceVersion,
  StorageRef,
} from "./types.js";

export interface CreateResourceVersionInput {
  resourceId: ID;
  version: number;
  createdBy: ID;
  storageRef?: StorageRef;
  checksum?: string;
  now?: string;
  id?: ID;
}

export function createResourceVersion(
  input: CreateResourceVersionInput,
): ResourceVersion {
  if (!input.resourceId.trim()) {
    throw new Error("Resource version resourceId is required");
  }

  if (!Number.isInteger(input.version) || input.version <= 0) {
    throw new Error("Resource version must be greater than 0");
  }

  if (!input.createdBy.trim()) {
    throw new Error("Resource version createdBy is required");
  }

  const now = input.now ?? new Date().toISOString();

  return {
    id: input.id ?? crypto.randomUUID(),
    resourceId: input.resourceId,
    version: input.version,
    ...(input.storageRef ? { storageRef: input.storageRef } : {}),
    ...(input.checksum ? { checksum: input.checksum } : {}),
    createdAt: now,
    createdBy: input.createdBy,
  };
}
