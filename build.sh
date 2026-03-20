#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${ROOT_DIR}"

MODE="${2:-${BUILD_MODE:-production}}"
VERSION="${1:-$(node -p "require('./package.json').version")}"

ENV_FILE="${BUILD_ENV_FILE:-}"
if [[ -z "${ENV_FILE}" ]]; then
  if [[ -f ".env.build.${MODE}" ]]; then
    ENV_FILE=".env.build.${MODE}"
  elif [[ -f ".env.build" ]]; then
    ENV_FILE=".env.build"
  else
    echo "Missing build env file. Create .env.build or .env.build.${MODE} from .env.build.example." >&2
    exit 1
  fi
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required variable: ${name}" >&2
    exit 1
  fi
}

IMAGE_NAME="${IMAGE_NAME:-isbim-official-web}"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
PUSH_IMAGE="${PUSH_IMAGE:-false}"

require_var SWR_REGION
require_var SWR_ORG
require_var NEXT_PUBLIC_SITE_URL
require_var NEXT_PUBLIC_SANITY_PROJECT_ID
require_var NEXT_PUBLIC_SANITY_DATASET
require_var NEXT_PUBLIC_SANITY_API_VERSION

case "${MODE}" in
  development) IMAGE_TAG="${VERSION}-dev" ;;
  uat) IMAGE_TAG="${VERSION}-uat" ;;
  production) IMAGE_TAG="${VERSION}-prod" ;;
  *) IMAGE_TAG="${VERSION}-${MODE}" ;;
esac

LOCAL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
REMOTE_IMAGE="${SWR_REGION}/${SWR_ORG}/${IMAGE_NAME}:${IMAGE_TAG}"

DOCKER_BUILDKIT=1 docker build \
  --platform "${DOCKER_PLATFORM}" \
  --secret "id=next_env,src=${ENV_FILE}" \
  -t "${LOCAL_IMAGE}" \
  .

echo "Built image: ${LOCAL_IMAGE}"

if [[ "${PUSH_IMAGE}" == "true" ]]; then
  docker tag "${LOCAL_IMAGE}" "${REMOTE_IMAGE}"
  docker push "${REMOTE_IMAGE}"
  echo "Pushed image: ${REMOTE_IMAGE}"
else
  echo "Skip push because PUSH_IMAGE=${PUSH_IMAGE}"
  echo "Remote tag would be: ${REMOTE_IMAGE}"
fi
