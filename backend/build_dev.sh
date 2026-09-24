#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/../deploy" && pwd)"
USE_PROD_DB=0
DEV_FRONTEND_ORIGIN="${DEV_FRONTEND_ORIGIN:-http://localhost:3002}"
DEV_HTTP_PORT="${DEV_HTTP_PORT:-9092}"
DEV_DEBUG_PORT="${DEV_DEBUG_PORT:-5007}"
# Dockerfile.dev sets 0.0.0.0 so the published debug port is reachable from the host.
DEV_DEBUG_HOST="${DEV_DEBUG_HOST:-localhost}"

load_env_file() {
  local env_file="$1"
  local line
  local key
  local value

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -n "$line" ]] || continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" == *=* ]] || continue

    key="${line%%=*}"
    value="${line#*=}"
    key="${key#"${key%%[![:space:]]*}"}"
    key="${key%"${key##*[![:space:]]}"}"

    export "$key=$value"
  done < "$env_file"
}

usage() {
  printf 'Usage: %s [--db-prod]\n' "${0##*/}" >&2
  exit 2
}

[[ $# -le 1 ]] || usage
case "${1:-}" in
  '')
    ;;
  --db-prod)
    USE_PROD_DB=1
    ;;
  *)
    usage
    ;;
esac

java_is_25() {
  local version

  version="$("$1" -version 2>&1)" || return 1
  grep -Eq 'version "25(\.|")' <<< "$version"
}

activate_java_25() {
  local candidate

  if [[ -n "${JAVA_HOME:-}" ]] \
      && [[ -x "$JAVA_HOME/bin/java" ]] \
      && java_is_25 "$JAVA_HOME/bin/java"; then
    export PATH="$JAVA_HOME/bin:$PATH"
    return 0
  fi

  if command -v java >/dev/null 2>&1 && java_is_25 "$(command -v java)"; then
    return 0
  fi

  for candidate in \
      /Library/Java/JavaVirtualMachines/graalvm-jdk-25*/Contents/Home \
      /Library/Java/JavaVirtualMachines/jdk-25*.jdk/Contents/Home \
      "$HOME"/Library/Java/JavaVirtualMachines/graalvm-jdk-25*/Contents/Home \
      "$HOME"/Library/Java/JavaVirtualMachines/jdk-25*.jdk/Contents/Home; do
    [[ -x "$candidate/bin/java" ]] || continue
    export JAVA_HOME="$candidate"
    export PATH="$JAVA_HOME/bin:$PATH"
    printf 'Using Java 25 from %s.\n' "$JAVA_HOME"
    return 0
  done

  printf 'Java 25 is required. Set JAVA_HOME to a Java 25 installation.\n' >&2
  return 127
}

require_production_config() {
  local variable

  for variable in DB_KIND JDBC_URL DB_USERNAME DB_PASSWORD; do
    if [[ -z "${!variable:-}" ]]; then
      printf 'Missing required --db-prod configuration: %s\n' "$variable" >&2
      return 1
    fi
  done
}

cd "$SCRIPT_DIR"

activate_java_25 || exit $?

if [[ $USE_PROD_DB -eq 1 ]]; then
  # Only --db-prod needs the production environment. Loading it for plain dev
  # would clobber the dev profile: environment variables such as JDBC_URL and
  # HTTP_PORT outrank application-dev.properties.
  [[ -f "$DEPLOY_DIR/.env.prod" ]] || {
    printf 'Missing %s, required by --db-prod.\n' "$DEPLOY_DIR/.env.prod" >&2
    exit 1
  }
  load_env_file "$DEPLOY_DIR/.env.prod"
  require_production_config || exit $?
  printf 'WARNING: Development mode is using the production database.\n'
  exec env \
    FRONTEND_ORIGIN="$DEV_FRONTEND_ORIGIN" \
    HTTP_PORT="$DEV_HTTP_PORT" \
    ./mvnw -Pdev-output clean compile quarkus:dev "-Ddebug=$DEV_DEBUG_PORT" "-DdebugHost=$DEV_DEBUG_HOST"
fi

exec ./mvnw -Pdev,dev-output clean compile quarkus:dev "-Ddebug=$DEV_DEBUG_PORT" "-DdebugHost=$DEV_DEBUG_HOST"
