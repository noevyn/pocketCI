# PocketCI

PocketCI is an open-source project to run GitHub Actions jobs on Android ARM64 devices, with a future remote control layer for project-specific CI tasks.

## Foundation

PocketCI pins [DroidRunner](https://github.com/m96-chan/DroidRunner) as a Git submodule at `upstream/DroidRunner`. This preserves the upstream project as a separately attributable source dependency while we develop PocketCI-specific changes around it.

- Upstream pin: `5126eacf2855a252d38121238d787eacec6f3965`
- Upstream license: GPL-2.0-only
- Submodule setup: `git clone --recurse-submodules https://github.com/noevyn/pocketCI.git`

## PocketCI additions

- Keep upstream runner lifecycle, credential handling, resource admission, and watchdog behavior intact.
- Add multi-project management and a restricted remote job interface.
- Add an Atlas verification profile that runs existing project scripts.
- Provide job status, logs, cancellation, and audit history.
- Keep untrusted pull-request code away from privileged credentials.

## Current status

- [x] Public GitHub repository.
- [x] Pinned DroidRunner source and documented GPL-2.0 provenance.
- [x] Android phone registered as a repository-scoped self-hosted runner.
- [x] First phone-hosted GitHub Actions smoke test passed: checkout, submodule verification, and environment inspection.
- [x] Android build-capacity preflight passed: 34 GB free in the runner filesystem and 7.5 GiB reported memory.
- [ ] Build and unit-test the upstream baseline APK.
- [ ] Create and test a separate PocketCI-branded APK.
- [ ] Implement the PocketCI project/job control layer.

The baseline APK build runs on a standard GitHub-hosted Linux runner because the Android runner's PRoot environment does not include the Android build toolchain. The phone remains the real-device runner for device-specific CI. Standard GitHub-hosted runners are free for public repositories; see [GitHub Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage).

See [UPSTREAM.md](UPSTREAM.md) for attribution and licensing details, [docs/POCKETCI_ARCHITECTURE.md](docs/POCKETCI_ARCHITECTURE.md) for the implementation sequence, and [docs/ANDROID_RUNNER_SETUP.md](docs/ANDROID_RUNNER_SETUP.md) for device setup.

## Why self-hosted?

GitHub Actions schedules the workflow, but the connected Android device supplies the job compute. Self-hosting does not bypass GitHub's API, repository, permission, or billing rules.

## License

Any distributed derivative must comply with DroidRunner's GPL-2.0-only license and preserve third-party notices. See [UPSTREAM.md](UPSTREAM.md) before redistributing source or binaries.
