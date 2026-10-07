import type { StorageBackend } from "../../storage/src/contracts.js";

export interface BackendCapabilities {
  transactions: boolean;
  search: boolean;
  versioning: boolean;
  signedUrls: boolean;
  streaming: boolean;
}

export interface BackendDescriptor {
  id: string;
  provider: string;
  capabilities: BackendCapabilities;
}

export interface BackendFactory {
  descriptor: BackendDescriptor;
  create(): Promise<StorageBackend>;
}
