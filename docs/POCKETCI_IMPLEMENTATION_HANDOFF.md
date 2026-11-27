# PocketCI implementation handoff

**Audit date:** 2026-11-27  
**Repository:** `noevyn/pocketCI`  
**Audited branch:** `main`  
**Audited HEAD:** `396e151ff6e4bd36515a4776f55fbee2f6c77a46`

## 1. Verified repository state

- The repository is a public Android self-hosted GitHub Actions runner project.
- DroidRunner is linked as a Git submodule at `upstream/DroidRunner`.
- The pinned upstream revision is `5126eacf2855a252d38121238d787eacec6f3965`.
- The upstream project is GPL-2.0-only. Any distributed derivative must preserve required notices and comply with the license.
- `.github/workflows/android-runner-smoke.yml` defines a manual `workflow_dispatch` job targeting `[self-hosted, android, arm64]`.
- The smoke workflow checks out submodules, runs `scripts/verify-upstream-pin.sh`, and reports runner architecture, toolchain, and resources.
- The verifier checks the exact submodule revision and the presence of upstream license and Android/PRoot build entry points.
- The root repository does **not** currently contain an Android Gradle application project, root Gradle wrapper, or PocketCI app manifest. The Android application source remains upstream in the submodule.
- The latest public commit history inspected on 2026-11-27 ends at the audited HEAD above; no later app implementation commit was found.

## 2. Previously reported device checkpoint (not independently re-fetched)

The prior working session reported that the Android runner `android-2404ARN45A-217cab` connected and its smoke test passed. Preserve that checkpoint and do not ask the user to repeat setup unless a new test proves it is necessary.

The previous session also reported a green PocketCI-branded APK build. That claim does not match the current public repository tree: this repository currently has no PocketCI Android app module or branded APK build pipeline. The build may have been performed in a separate local checkout or unpushed working tree. Locate and reconcile that source before rebuilding anything.

## 3. Do not repeat completed work

- Do not recreate the DroidRunner submodule integration.
- Do not rebuild or reinstall the upstream DroidRunner APK merely to repeat runner registration.
- Do not change the pinned upstream revision without a compatibility and security review.
- Do not modify Atlas or customer data as part of PocketCI development.
- Do not assume a local build or device test is represented in the public repository until its source and build evidence are pushed or attached to a reproducible workflow.

## 4. Outstanding work

### P0 — Reconcile the missing branded-app source

1. Identify the exact local checkout, branch, or artifact that produced the previously reported PocketCI-branded APK.
2. Compare its package ID, manifest, source tree, signing configuration, and build workflow with this repository.
3. Bring the verified source into this repository without overwriting the working DroidRunner integration.
4. Add a reproducible Android build workflow and publish the APK as a workflow artifact.
5. Record the exact commit, artifact, package ID, version, and signing-certificate fingerprint.

### P1 — PocketCI identity and access

1. Implement PocketCI-specific package identity and product branding on top of the upstream app.
2. Keep upstream runner credential handling, lifecycle, resource admission, and watchdog behavior intact.
3. Configure GitHub App authentication only after the app's callback/device-flow design and required permissions are reviewed.
4. Keep any cross-repository read token separate from app sign-in credentials. Use least privilege and store secrets only in GitHub Actions or the device's secure configuration; never paste token values into chat.

### P2 — Restricted control plane

1. Add an authenticated, allowlisted remote control interface.
2. Support project registration, job status, bounded logs, cancellation, and audit history.
3. Keep project workspaces and credentials isolated.
4. Require explicit authorization for actions that can write to a repository.
5. Do not allow untrusted fork pull-request code to execute on a privileged self-hosted runner.

### P3 — Atlas profile

1. Add an Atlas-specific verification profile that invokes existing Atlas scripts.
2. Start with read-only checks and test fixtures.
3. Do not grant the runner production deployment or customer-data mutation credentials by default.
4. Add a clear approval boundary before any deployment or write operation.

## 5. Credentials and setup status

The following were not confirmed as configured in the prior session:

- GitHub App creation and its public Client ID/slug configuration.
- `NOEVYN_REPO_READ_TOKEN` Actions secret for private Atlas repository read access.
- A permanent PocketCI signing key and documented fingerprint.
- The ChatGPT-to-PocketCI control bridge.

Do not record secret values in this file or in Git. Record only whether each item is configured and the date it was verified.

## 6. Acceptance criteria

PocketCI is not complete until all of the following are reproducible:

- [ ] Branded Android APK builds from a clean checkout with submodules.
- [ ] APK package identity and signing fingerprint are documented.
- [ ] Installation and upgrade preserve runner configuration safely.
- [ ] Android runner reconnects after app restart and device reboot.
- [ ] Manual smoke workflow passes on the registered Android device.
- [ ] A test job can be dispatched, observed, logged, and cancelled through the restricted control plane.
- [ ] Project isolation and least-privilege credentials are tested.
- [ ] Atlas profile runs read-only checks against a test branch or fixture.
- [ ] No untrusted workflow can access privileged secrets.
- [ ] Handoff and README status match actual code and test evidence.

## 7. Immediate next action

Find the local source/artifact that produced the previously reported branded APK and reconcile it with this repository. This is the shortest path forward: preserve the working DroidRunner runner and recover the missing PocketCI-specific layer rather than starting again.
