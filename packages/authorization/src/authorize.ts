import type { Action, Actor, Membership, Resource } from "../../core/src/types.js";

export interface AuthorizationContext {
  membership: Membership | null;
  resource?: Resource | null;
}

function roleAllows(role: Membership["role"], action: Action): boolean {
  if (role === "admin") return true;
  if (role === "moderator") return action !== "sandbox:manage";
  if (role === "contributor") {
    return action === "sandbox:read" ||
      action === "resource:create" ||
      action === "resource:read" ||
      action === "resource:update";
  }
  return action === "sandbox:read" || action === "resource:read";
}

export function can(actor: Actor, action: Action, context: AuthorizationContext): boolean {
  const { membership, resource } = context;
  if (!membership || membership.userId !== actor.userId) return false;
  if (resource && resource.sandboxId !== membership.sandboxId) return false;
  return roleAllows(membership.role, action);
}
