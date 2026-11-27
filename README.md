# PocketCI

PocketCI is an open-source project exploring Android phones as low-cost GitHub Actions self-hosted runners, with a future remote control layer for project-specific CI tasks.

## Direction

Rather than rebuilding Android runner infrastructure, PocketCI is intended to build on [DroidRunner](https://github.com/m96-chan/DroidRunner), which already provides an Android ARM64 app, a PRoot Ubuntu environment, and the official GitHub Actions self-hosted runner.

Planned PocketCI work:
- Preserve upstream runner lifecycle, credential handling, resource checks, and watchdog behavior.
- Add multi-project management and a restricted remote job interface.
- Add an Atlas verification profile that runs the existing project scripts.
- Provide job status, logs, cancellation, and audit history.
- Keep untrusted pull-request code away from privileged credentials.

## Status

**Not yet a runnable DroidRunner derivative.** The upstream implementation has been inspected, and its licensing requirements are documented in [UPSTREAM.md](UPSTREAM.md), but its source files have not yet been imported or built in this repository.

## Why self-hosted?

GitHub Actions can schedule workflows on a self-hosted runner. The job compute then runs on the connected device rather than a GitHub-hosted runner. GitHub still manages workflow scheduling and permissions; self-hosting does not bypass GitHub's API, repository, or billing rules.

## License

The intended derivative must comply with DroidRunner's GPL-2.0-only license and preserve third-party notices. See [UPSTREAM.md](UPSTREAM.md) before redistributing source or binaries.
