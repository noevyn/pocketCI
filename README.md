# PocketCI

PocketCI is an open-source project to run GitHub Actions jobs on Android ARM64 devices, with a planned assistant-controlled layer for approved project CI tasks.

## Foundation

PocketCI pins [DroidRunner](https://github.com/m96-chan/DroidRunner) as a Git submodule at `upstream/DroidRunner`, currently pinned to `5126eacf2855a252d38121238d787eacec6f3965`. A deterministic build-time overlay applies PocketCI's app identity and branding without rewriting the upstream submodule history.

- Upstream license: GPL-2.0-only
- PocketCI license: GPL-2.0-only
- Clone with submodules: `git clone --recurse-submodules https://github.com/noevyn/pocketCI.git`

## Verified status

- [x] Public GitHub repository.
- [x] Android phone registered as a repository-scoped self-hosted runner.
- [x] Phone-hosted GitHub Actions smoke test passed.
- [x] Unmodified upstream baseline APK built and unit-tested.
- [x] PocketCI overlay applied and compiled.
- [x] PocketCI unit tests passed.
- [x] APK manifest verified as package `com.noevyn.pocketci`, label `PocketCI`.
- [ ] Create and configure PocketCI's own GitHub App identity.
- [ ] Install the PocketCI debug APK on the phone and verify runtime setup and runner registration.
- [ ] Create a stable release-signing key and reproducible GPL source archive.
- [ ] Complete the Atlas CI profile's read-only private-repository access setup.
- [ ] Implement the authenticated assistant-to-runner control bridge.

**Latest successful PocketCI debug build:** [Run #46067595848](https://github.com/noevyn/pocketCI/actions/runs/46067595848). The [debug APK artifact](https://github.com/noevyn/pocketCI/actions/runs/46067595848/artifacts/15232775295) is retained for seven days.

The APK is debug-signed and intended for isolated testing, not public release. It uses its own package ID, so it can be installed alongside the upstream DroidRunner app without replacing it. Do not treat the current build as connected until the PocketCI GitHub App is configured; see [GitHub App setup](docs/GITHUB_APP_SETUP.md).

## Build and device roles

- Standard GitHub-hosted Linux runners build the Android APK. Standard hosted runners are free for public repositories.
- The connected Android phone supplies self-hosted job compute for device-side CI.
- The current Android runner labels are `self-hosted`, `android`, and `arm64`.

The successful smoke test proves GitHub Actions can schedule and execute jobs on the phone. It does not mean ChatGPT can directly control the phone yet; the secure assistant control bridge is a later phase.

## Atlas CI

A manual-only Atlas profile is being prepared to run the existing Atlas workspace checks on the Android runner. Because the PocketCI repository is public and the Noevyn monorepo is private, that workflow requires a narrowly scoped read-only token. See [Atlas CI profile](docs/ATLAS_CI_PROFILE.md).

## Project documents

- [Architecture and implementation phases](docs/POCKETCI_ARCHITECTURE.md)
- [Android runner setup](docs/ANDROID_RUNNER_SETUP.md)
- [PocketCI GitHub App setup](docs/GITHUB_APP_SETUP.md)
- [Release signing and source obligations](docs/RELEASE_SIGNING.md)
- [Upstream attribution and licensing](UPSTREAM.md)

## License

PocketCI is distributed under GPL-2.0-only. See [LICENSE](LICENSE) and [UPSTREAM.md](UPSTREAM.md).
