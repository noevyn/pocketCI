# PocketCI GitHub App setup

The PocketCI APK does not reuse the original DroidRunner GitHub App identity. Create a separate GitHub App under the Noevyn account before connecting the PocketCI app to repositories.

## Create the app

1. Open [GitHub Developer Settings](https://github.com/settings/apps) and choose **New GitHub App**.
2. Name it **PocketCI** (or **PocketCI by Noevyn**).
3. Set the homepage URL to `https://github.com/noevyn/pocketCI`.
4. Leave webhooks disabled; PocketCI uses GitHub's device flow.
5. Under repository permissions, grant **Administration: Read and write**. This is required to create and remove self-hosted runner registrations.
6. Enable **Device flow**.
7. Optionally disable user access-token expiration. This is not required, but reduces repeated sign-ins.
8. Create the app and note its public **Client ID** and URL slug.

## Configure the build

In the `noevyn/pocketCI` repository, open **Settings → Secrets and variables → Actions → Variables** and add:

| Variable | Value |
|---|---|
| `POCKETCI_GITHUB_APP_CLIENT_ID` | Client ID from the PocketCI GitHub App |
| `POCKETCI_GITHUB_APP_SLUG` | URL slug from the PocketCI GitHub App |

These are public identifiers, not private keys. Do not put the original DroidRunner Client ID or slug here.

Install the PocketCI GitHub App on `noevyn/pocketCI` initially. Keep its repository access limited to the repositories whose runners PocketCI should manage.

After the variables are saved, rerun **Build PocketCI Android app**. The next APK will contain the PocketCI GitHub App identity and its device-flow sign-in will be enabled.

## Current build behavior

If the variables are empty, the debug APK still compiles, but GitHub App device-flow sign-in is disabled and the setup screen explains why. The app's manual PAT route is available for development, but the GitHub App route is preferred for normal use.

The PocketCI app currently downloads the signed Linux runtime from the pinned upstream DroidRunner release repository. That runtime source is separate from the GitHub App identity and will be moved to PocketCI-owned releases in a later phase.
