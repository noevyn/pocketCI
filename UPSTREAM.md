# Upstream and licensing

PocketCI is a GPL-2.0-only derivative built around **DroidRunner** as a Git submodule at `upstream/DroidRunner`.

- Upstream: https://github.com/m96-chan/DroidRunner
- Upstream project license: GPL-2.0-only
- Pinned commit: `5126eacf2855a252d38121238d787eacec6f3965`
- Submodule path: `upstream/DroidRunner`
- Submodule URL: `https://github.com/m96-chan/DroidRunner.git`

## How the derivative is maintained

The upstream submodule is kept at its pinned revision. `scripts/apply-pocketci-branding.mjs` applies a deterministic overlay during the APK build. It refuses to patch an unexpected upstream revision.

The overlay currently:
- Gives the app its own Android application ID: `com.noevyn.pocketci`.
- Applies PocketCI's label, adaptive icon, dark teal palette, and sans-serif typography.
- Rebrands product-facing status and setup messages and the HTTP User-Agent.
- Separates the app's credential-store alias.
- Adds PocketCI source attribution while retaining an explicit link to the pinned upstream source.
- Uses PocketCI-specific Gradle properties. The upstream GitHub App client ID and slug are intentionally not reused.
- Temporarily downloads the signed Linux runtime from the upstream DroidRunner release repository using the upstream public manifest-verification key.

This is a patch-overlay derivative, not a GitHub-native fork. The source archive for any public release must include the complete pinned upstream source, the PocketCI overlay, build scripts, and required third-party notices.

## Licensing and attribution

PocketCI is distributed under GPL-2.0-only. A distributed derivative must retain upstream copyright and license notices, provide the corresponding source, and preserve notices for bundled components. The root `LICENSE` contains the GPL-2.0 text. Consult upstream and third-party license manifests before redistributing an APK or runtime bundle.

## Verified implementation status

- [x] Public PocketCI repository.
- [x] Pin the upstream source revision as a submodule.
- [x] Add deterministic source-pin verification.
- [x] Register the Android phone as a repository-scoped runner.
- [x] Execute a successful phone-hosted GitHub Actions smoke test.
- [x] Build and unit-test the unmodified upstream baseline.
- [x] Apply the PocketCI identity overlay and build a debug APK.
- [x] Verify the APK manifest package and app label.
- [ ] Create PocketCI's own GitHub App and configure its public Client ID and slug.
- [ ] Install the debug APK and validate runtime setup and runner registration on-device.
- [ ] Create a stable APK signing key and a complete GPL source archive before release.
- [ ] Replace the temporary upstream runtime repository/key with PocketCI-owned runtime releases.
- [ ] Implement the authenticated assistant control bridge and per-project isolation.

## Planned PocketCI additions

1. Preserve upstream runner lifecycle, credential protection, resource admission, and watchdog behavior.
2. Add multi-project management and a restricted remote job/control bridge.
3. Run approved Atlas verification profiles using the existing monorepo scripts.
4. Add job status, logs, cancellation, project isolation, scoped credentials, and audit records.
5. Never execute untrusted pull-request code with privileged credentials.
