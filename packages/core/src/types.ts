export type ID = string;

export type ResourceVisibility = "private" | "members" | "public";

export type ResourceType =
  | "question-paper" | "note" | "documentation" | "dataset"
  | "project" | "code" | "image" | "video" | "event-material"
  | "research" | "archive" | "custom";

export type MemberRole = "admin" | "moderator" | "contributor" | "member";

export interface Sandbox {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface Membership {
  userId: ID;
  sandboxId: ID;
  role: MemberRole;
  createdAt: string;
}

export interface StorageRef {
  backend: string;
  namespace: string;
  locator: string;
}

export interface Resource {
  id: ID;
  sandboxId: ID;
  type: ResourceType;
  title: string;
  description?: string;
  metadata: Record<string, unknown>;
  visibility: ResourceVisibility;
  ownerId: ID;
  currentVersionId?: ID;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceVersion {
  id: ID;
  resourceId: ID;
  version: number;
  storageRef?: StorageRef;
  checksum?: string;
  createdAt: string;
  createdBy: ID;
}

export interface Actor {
  userId: ID;
}

export type Action =
  | "sandbox:read" | "sandbox:manage"
  | "resource:create" | "resource:read"
  | "resource:update" | "resource:delete";
