# Upstream

PocketCI is intended to be a maintained derivative of **DroidRunner**.

- Upstream: https://github.com/m96-chan/DroidRunner
- Upstream project license: GPL-2.0-only
- Upstream snapshot reviewed: `5126eacf2855a252d38121238d787eacec6f3965` (2026-09-13)
- Upstream architecture: Android ARM64 app + PRoot Ubuntu ARM64 environment + official GitHub Actions self-hosted runner.

## Licensing and attribution

A distributed derivative must retain the upstream copyright and license notices, provide the corresponding source under GPL-2.0, and preserve notices for bundled components. Bundled components have their own licenses; consult their manifests and notices before redistributing an APK.

## Import status

The upstream source has been inspected but is **not yet imported into this repository**. This repository currently contains its original PocketCI initialization. Do not treat this as a working DroidRunner build until the source import and build verification are complete.

## Planned PocketCI additions

1. Keep the upstream runner, credential protection, resource admission, and watchdog behavior intact.
2. Add a constrained remote job/control bridge for authorized PocketCI operators.
3. Add a dedicated Atlas verification profile that invokes existing repository scripts rather than embedding Atlas-specific assumptions in the Android runner.
4. Add per-project isolation, scoped credentials, job logs, cancellation, and audit records.
5. Never execute untrusted pull-request code with privileged credentials; use explicit trust policy and isolated workspaces.
