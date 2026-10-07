# Provisioning

Provisioning creates infrastructure for a sandbox.

Modes:
- Managed: Blank Box operates the infrastructure.
- Bring your own: the user authorizes provisioning in their provider account.
- Self-hosted: the community operates a compatible node.

Target flow:
Create sandbox -> connect provider -> authorize -> provision -> configure -> register backend -> ready.

Provider credentials must not be stored as ordinary resource data. Prefer delegated or short-lived credentials.
