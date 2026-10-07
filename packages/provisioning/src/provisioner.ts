import type { BackendDescriptor } from "../../protocol/src/contracts.js";

export interface ProvisionRequest {
  sandboxId: string;
  displayName: string;
  region?: string;
}

export interface ProvisionResult {
  backend: BackendDescriptor;
  externalProjectId?: string;
}

export interface Provisioner {
  provider: string;
  provision(request: ProvisionRequest): Promise<ProvisionResult>;
  destroy(externalProjectId: string): Promise<void>;
}
