# Architecture

Blank Box separates domain logic from infrastructure.

Sandbox = ownership and governance boundary.
Resource = generic community resource.
ResourceVersion = immutable version pointing to content.
DataStore = structured metadata and relationships.
BlobStore = binary or large content.

The application depends on StorageBackend interfaces rather than vendor SDKs.

A logical storage reference contains:
backend, namespace, locator

Possible adapters include local filesystem, SQLite/PostgreSQL, Supabase, S3-compatible storage, and self-hosted nodes.

Provisioning is a separate subsystem. It can authenticate to a provider, create/configure infrastructure, and register the resulting backend.

First vertical slice:
sandbox -> membership -> authorization -> resource -> metadata -> blob -> version -> retrieval.
