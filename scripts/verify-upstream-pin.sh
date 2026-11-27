#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM="$ROOT/upstream/DroidRunner"
EXPECTED="5126eacf2855a252d38121238d787eacec6f3965"

if [[ ! -d "$UPSTREAM/.git" && ! -f "$UPSTREAM/.git" ]]; then
  echo "ERROR: DroidRunner submodule is missing. Clone with --recurse-submodules." >&2
  exit 1
fi

ACTUAL="$(git -C "$UPSTREAM" rev-parse HEAD)"
if [[ "$ACTUAL" != "$EXPECTED" ]]; then
  echo "ERROR: unexpected DroidRunner revision: $ACTUAL (expected $EXPECTED)" >&2
  exit 1
fi

for required in LICENSE gradlew runtime/build-proot.sh app/build.gradle.kts; do
  if [[ ! -f "$UPSTREAM/$required" ]]; then
    echo "ERROR: upstream file missing: $required" >&2
    exit 1
  fi
done

grep -q "GNU GENERAL PUBLIC LICENSE" "$UPSTREAM/LICENSE"
echo "PASS: DroidRunner submodule is present and pinned to $EXPECTED"
echo "PASS: GPL license and Android/PRoot build entry points are present"
