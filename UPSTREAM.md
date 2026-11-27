# Upstream

PocketCI currently links **DroidRunner** as a Git submodule at `upstream/DroidRunner`.

- Upstream: https://github.com/m96-chan/DroidRunner
- Upstream project license: GPL-2.0-only
- Pinned commit: `5126eacf2855a252d38121238d787eacec6f3965`
- Submodule path: `upstream/DroidRunner`
- Submodule URL: `https://github.com/m96-chan/DroidRunner.git`

## Licensing and attribution

A distributed derivative must retain upstream copyright and license notices, provide corresponding source under GPL-2.0, and preserve notices for bundled components. Bundled components have their own licenses; consult their manifests and notices before redistributing an APK.

The submodule arrangement keeps upstream history and attribution separate. It is not a GitHub-native fork and no PocketCI patches have yet been applied inside the Android app source.

## Current implementation status

- [x] Pin the upstream source revision as a submodule.
- [x] Add a script to verify the pinned revision and required build files.
- [x] Add a manual GitHub Actions smoke workflow targeting the `self-hosted, android, arm64` labels.
- [ ] Register a DroidRunner device against `noevyn/pocketCI` and execute the smoke workflow.
- [ ] Build and install a PocketCI-branded APK with its own package identity and stable signing key.
- [ ] Implement the remote job/control bridge and project isolation.

## Planned PocketCI additions

1. Keep the upstream runner, credential protection, resource admission, and watchdog behavior intact.
2. Add a constrained remote job/control bridge for authorized PocketCI operators.
3. Add a dedicated Atlas verification profile that invokes existing repository scripts rather than embedding Atlas-specific assumptions in the Android runner.
4. Add per-project isolation, scoped credentials, job logs, cancellation, and audit records.
5. Never execute untrusted pull-request code with privileged credentials; use explicit trust policy and isolated workspaces.
