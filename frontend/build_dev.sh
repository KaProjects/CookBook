#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Trading (3000 / 9090 / 5005) and Accountant (3001 / 9091 / 5006) dev stacks
# already use these ports, so CookBook is offset by two to let all run side by side.
export PORT="${PORT:-3002}"

usage() {
  printf 'Usage: %s\n' "${0##*/}" >&2
  exit 2
}

[[ $# -eq 0 ]] || usage

node_is_supported() {
  local executable="$1"

  "$executable" -e '
    const major = Number(process.versions.node.split(".")[0])
    process.exit(major >= 18 ? 0 : 1)
  ' >/dev/null 2>&1
}

activate_development_node() {
  local candidate

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]] && [[ -n "${COOKBOOK_NODE_VERSION:-}" ]]; then
    set +u
    source "$NVM_DIR/nvm.sh"
    set -u
    if nvm use --silent "$COOKBOOK_NODE_VERSION" >/dev/null 2>&1; then
      printf 'Using Node.js %s for frontend development.\n' "$(node --version)"
      return 0
    fi
  fi

  if command -v node >/dev/null 2>&1 \
      && node_is_supported "$(command -v node)"; then
    return 0
  fi

  for candidate in \
      "$HOME"/.nvm/versions/node/v*/bin/node \
      /opt/homebrew/bin/node \
      /usr/local/bin/node; do
    [[ -x "$candidate" ]] || continue
    if node_is_supported "$candidate"; then
      export PATH="$(dirname "$candidate"):$PATH"
      hash -r
      printf 'Using Node.js %s from %s for frontend development.\n' \
        "$(node --version)" "$(dirname "$candidate")"
      return 0
    fi
  done

  printf 'Frontend development requires Node.js 18 or newer.\n' >&2
  return 127
}

cd "$SCRIPT_DIR"

activate_development_node || exit $?
exec npm start
