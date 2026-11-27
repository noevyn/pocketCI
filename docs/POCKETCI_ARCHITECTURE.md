# PocketCI architecture and implementation plan

## Product goal

PocketCI is a phone-hosted CI control plane and worker built around a real Android device. It should let an owner connect a GitHub repository, run approved CI jobs on their own Android hardware, inspect job status and logs, and reuse existing workflows without paying for hosted runner compute.

The first verified device is the Android phone registered as the self-hosted runner `android-2404ARN45A-217cab`.

## Foundation and provenance

- Android execution foundation: [DroidRunner](https://github.com/m96-chan/DroidRunner), pinned as a Git submodule at `5126eacf2855a252d38121238d787eacec6f3965`.
- Upstream license: GPL-2.0-only. Any distributed derivative must comply with the license, provide corresponding source and preserve required notices.
- The current repository is a PocketCI wrapper around an upstream submodule, not a native GitHub fork and not yet a branded derivative APK.
- First device smoke test passed on 2026-11-27. This proves Actions scheduling, submodule checkout, source/license verification and the runner's ability to execute a job. It does not prove a PocketCI APK build.

## Intended architecture

1. **Device runtime** — retain the upstream PRoot + official Linux ARM64 Actions runner, Android foreground service, wake lock, watchdog and resource admission controls.
2. **PocketCI app layer** — progressively replace upstream product identity and add a PocketCI dashboard while preserving working runner lifecycle and credential storage.
3. **Repository control** — connect a repository with least-privilege GitHub App permissions; prefer repository-scoped registration. Never store a personal access token in the Linux guest.
4. **Job policy** — allow jobs only from explicitly selected repositories and trusted branches. Do not execute public-fork pull requests or untrusted workflow code on a device holding credentials.
5. **Job visibility** — show online/listening/running/held/offline states, job history, exit status, timestamps, logs and the reason a job is held.
6. **Optional assistant bridge (later phase)** — expose a narrow, authenticated job-control API for an assistant to request approved workflows and read status/logs. The bridge must not expose unrestricted shell access or arbitrary command execution.

## Implementation sequence

### Phase 0 — verified runner foundation
- [x] Public PocketCI repository.
- [x] Pinned DroidRunner upstream source and license notes.
- [x] Repo-scoped Android runner connected.
- [x] First smoke workflow passed on the phone.
- [x] Record device capacity: 34 GB free in the runner filesystem and 7.5 GiB reported memory.
- [x] Build and unit-test the upstream baseline on a standard hosted Linux runner.
- [x] Apply the PocketCI overlay and build a separate debug APK; manifest identity verified.

### Phase 1 — reproducible PocketCI build
- [x] Confirm device capacity and establish a repeatable hosted Linux Android build.
- [x] Create a separate PocketCI application identity and debug APK; it can coexist with upstream DroidRunner.
- [ ] Create PocketCI's own GitHub App identity and configure the Client ID and slug.
- [ ] Install the debug APK side-by-side and validate runtime setup and runner registration.
- [ ] Create a stable APK signing key and complete source archive before public release.

### Phase 2 — PocketCI experience
- [ ] Product name, icon, onboarding and repository connection.
- [ ] Clear job dashboard, queue, logs and device health.
- [ ] Explicit project profiles and safe workflow admission.
- [ ] Regression tests for runner start/stop, reboot recovery, low battery, thermal hold and job completion.

### Phase 3 — assistant integration
- [ ] Authenticated outbound polling or a signed job-request channel.
- [ ] Allowlisted repository/workflow/ref combinations.
- [ ] Approval gate for sensitive or write-capable workflows.
- [ ] Read-only status/log retrieval by default.
- [ ] Audit trail, token rotation, replay protection and request expiry.

## Non-negotiable safety constraints

- Do not run arbitrary commands supplied by a chat message on the host.
- Do not expose GitHub credentials, Android Keystore material or runner tokens to the guest shell or logs.
- Do not execute untrusted pull-request code on a runner that has repository secrets.
- Do not replace the existing upstream installation or its signing identity during early development.
- Do not treat a green smoke test as proof that an APK has been built or that Atlas CI is ready.


## Current build split

The Android phone is the self-hosted Actions worker for device-side CI. APK compilation runs on a standard GitHub-hosted Linux runner because the phone's PRoot image does not include the Android build toolchain. PocketCI is public, so standard hosted runner compute is free for this repository.

The current PocketCI APK uses a separate package ID but has no PocketCI GitHub App Client ID/slug compiled in yet. The original DroidRunner GitHub App identity is deliberately not reused. The assistant control bridge is also not implemented yet.
