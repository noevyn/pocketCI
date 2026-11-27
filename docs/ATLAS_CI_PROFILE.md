# Atlas CI profile

This workflow runs the existing Atlas checks from the private `NoevynHQ/Noevyn` monorepo on the PocketCI Android ARM64 runner.

## What it runs

1. Checks out the PocketCI workflow repository.
2. Checks out `NoevynHQ/Noevyn` at `main` using a read-only repository token.
3. Installs `build-essential`, Python 3, and pkg-config inside the isolated Ubuntu PRoot image if they are missing. The runner operates as root inside PRoot; this does not install packages on Android itself.
4. Installs the exact root workspace lockfile with `npm ci`.
5. Runs the existing production dependency audit.
6. Runs Atlas TypeScript and ESLint checks.
7. Runs Atlas's existing `test` script, which performs the bounded production build and then runs the Atlas Node tests.

It does not run database migrations, write to Cloudflare, deploy, or access production customer records. The current Atlas tests use an in-memory SQLite database for migration assertions and inspect the generated local build output.

## One-time secret setup

The PocketCI workflow repository is public, while the Noevyn monorepo is private. GitHub's default `GITHUB_TOKEN` from PocketCI cannot read the private monorepo, so the workflow requires a narrowly scoped fine-grained token:

- Resource owner: `NoevynHQ`
- Repository access: only `Noevyn`
- Repository permission: `Contents: Read-only`
- No Actions, Administration, Issues, or Write permissions
- Save it in `noevyn/pocketCI` as repository Actions secret `NOEVYN_REPO_READ_TOKEN`

The token is used only by the private-repository checkout step. `persist-credentials: false` prevents checkout credentials from being left in either workspace. It is not passed to npm, build scripts, or tests.

## Run

After the secret exists and this workflow is on the default branch, open the PocketCI Actions page, select **Atlas CI on Android**, and run it from `main`.

## Runner requirement

The Android device must remain registered to `noevyn/pocketCI` with labels `self-hosted`, `android`, and `arm64`. The job downloads Node.js 22.13.0 into its temporary workspace; it does not require Node or npm to be preinstalled in the DroidRunner Linux image.

## Safety

- Manual dispatch only; no pull-request or push trigger.
- Private source is checked out read-only.
- No secrets are passed to project build/test commands.
- No deployment or database-write commands are run.
- The workflow runs the Atlas workspace checks, not the entire monorepo's deployment or production workflows.
