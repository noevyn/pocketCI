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
- Add an Atlas verification profile that runs the existing project scripts.
- Provide job status, logs, cancellation, and audit history.
- Keep untrusted pull-request code away from privileged credentials.

## Status

**Source is pinned, but PocketCI is not yet a built or tested Android app.** The repository contains a manual Android self-hosted-runner smoke workflow and a script that verifies the pinned upstream source and required build entry points. That workflow still needs a registered Android runner to execute.

See [UPSTREAM.md](UPSTREAM.md) for attribution and licensing details.

## Why self-hosted?

GitHub Actions schedules the workflow, but the connected Android device supplies the job compute. Self-hosting does not bypass GitHub's API, repository, permission, or billing rules.

## License

Any distributed derivative must comply with DroidRunner's GPL-2.0-only license and preserve third-party notices. See [UPSTREAM.md](UPSTREAM.md) before redistributing source or binaries.
