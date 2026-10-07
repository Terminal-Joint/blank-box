import type { DataStore } from "../../../packages/storage/src/contracts.js";
import type { Membership, Resource, ResourceVersion, Sandbox } from "../../../packages/core/src/types.js";

export class InMemoryDataStore implements DataStore {
  private sandboxes = new Map<string, Sandbox>();
  private memberships = new Map<string, Membership>();
  private resources = new Map<string, Resource>();
  private versions = new Map<string, ResourceVersion>();

  async createSandbox(v: Sandbox) { this.sandboxes.set(v.id, v); }
  async getSandbox(id: string) { return this.sandboxes.get(id) ?? null; }
  async createMembership(v: Membership) { this.memberships.set(v.userId + ":" + v.sandboxId, v); }
  async getMembership(u: string, s: string) { return this.memberships.get(u + ":" + s) ?? null; }
  async createResource(v: Resource) { this.resources.set(v.id, v); }
  async getResource(id: string) { return this.resources.get(id) ?? null; }
  async createResourceVersion(v: ResourceVersion) { this.versions.set(v.id, v); }
  async getResourceVersion(id: string) { return this.versions.get(id) ?? null; }
  async getResourceVersions(resourceId: string) {
  return [...this.versions.values()]
    .filter((version) => version.resourceId === resourceId)
    .sort((a, b) => a.version - b.version);
}
}
