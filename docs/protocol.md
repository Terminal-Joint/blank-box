# Protocol

The protocol is the stable boundary between the resource engine and infrastructure adapters.

A backend implements DataStore and BlobStore and declares capabilities.

Provider-specific APIs stay inside adapters. The core domain must not depend on provider SDK types.
