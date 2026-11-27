# First Android runner setup

This gets the pinned PocketCI workflow onto a real Android self-hosted runner. The APK below is the official upstream DroidRunner release, not a PocketCI-branded build.

## 1. Install the upstream runner

Install the official [DroidRunner v1.0.0 APK](https://github.com/m96-chan/DroidRunner/releases/download/v1.0.0/droidrunner-v1.0.0.apk) from the [upstream release page](https://github.com/m96-chan/DroidRunner/releases/tag/v1.0.0).

The app downloads its Linux ARM64 runtime on first setup. Allow that download to finish.

## 2. Register it to this repository

In DroidRunner, use its GitHub device-flow sign-in and register the runner to **only**:

`noevyn/pocketCI`

Prefer repository scope over organization scope for the initial test. Confirm the runner appears online and has the labels:

- `self-hosted`
- `android`
- `arm64`

Keep the phone powered, connected to the internet, and exempt the app from battery optimization while testing.

## 3. Run the smoke test

Open [PocketCI Actions](https://github.com/noevyn/pocketCI/actions), select **Android self-hosted runner smoke test**, choose **Run workflow**, and start it on `main`.

The workflow checks out this repository and the pinned DroidRunner submodule, verifies the exact upstream commit and license/build files, then reports the Android runner architecture, available toolchain, and device resources.

## 4. Security

A self-hosted runner executes workflow code on the device. Do not register it to a repository that runs untrusted fork pull requests with privileged credentials. Keep the first test repository-scoped and do not add secrets to this smoke workflow.

## What this does not do yet

This validates DroidRunner as the compute foundation. It does not yet install a PocketCI-branded APK, provide a ChatGPT control bridge, or run Atlas workflows. Those are subsequent implementation steps after the device runner is online and the smoke test passes.
