#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

mode="--write"
if [[ "${1:-}" == "--check" ]]; then
  mode="--check"
fi

npm exec -- prettier "$mode" .
