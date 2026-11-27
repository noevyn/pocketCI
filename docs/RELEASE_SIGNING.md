# Release signing and source distribution

The current PocketCI APK is a debug build for isolated testing. Do not publish it as a release. Android will not allow a debug-signed install to be upgraded by an APK signed with a different key.

## APK signing key

Before the first public release:

1. Generate a dedicated PocketCI Android release keystore and alias.
2. Keep an offline backup in a secure location. Loss of this key prevents in-place upgrades for installed PocketCI users.
3. Add these repository Actions secrets to `noevyn/pocketCI`:
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
4. The release workflow must decode the keystore to a temporary file and set `ANDROID_KEYSTORE_FILE`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` for Gradle.

Never commit the keystore, its passwords, or a decoded copy to the repository or workflow artifacts.

## Runtime manifest signing is separate

The Android APK signing key is not the runtime-manifest signing key.

The current debug build temporarily trusts the upstream DroidRunner public runtime key and downloads its signed runtime manifest from `m96-chan/DroidRunner`. Before PocketCI owns its runtime releases, generate a separate P-256 runtime-manifest key pair, keep the private key in a repository secret, and compile only the public key into the APK as `pocketci.runtimeSigningKeys`.

## GPL corresponding source

Every public PocketCI release must publish a source archive named `pocketci-<tag>-source.tar.gz` beside the APK. It must contain:
- The complete PocketCI repository source for the release.
- The full pinned `upstream/DroidRunner` submodule source, not only the gitlink.
- `scripts/apply-pocketci-branding.mjs` and all build scripts/workflows needed to reproduce the overlay.
- Upstream and third-party license notices and source-offer material.

The About screen's source link expects this archive naming convention. Do not create a public binary release until the archive is generated and verified.
