#!/usr/bin/env bash
set -Eeuo pipefail
set +x

project_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
secret_directory="${project_directory}/secrets"
services_file="${secret_directory}/services.json"
previous_file="${secret_directory}/services.json.previous"
lock_file="${secret_directory}/.publisher-mutation.lock"
temporary_file=''
backup_temporary_file=''
restore_temporary_file=''
active_command_pid=''
publisher_had_container=0
publisher_should_run=0
publisher_was_paused=0
publisher_state='absent'
transaction_active=0
critical_section=0
pending_signal=0
oneshot_cleanup_failed=0
docker_command="${HOME_ENDPOINT_DOCKER_COMMAND:-docker}"
copy_command="${HOME_ENDPOINT_COPY_COMMAND:-cp}"
lock_command="${HOME_ENDPOINT_LOCK_COMMAND:-flock}"
timeout_command="${HOME_ENDPOINT_TIMEOUT_COMMAND:-timeout}"
docker_timeout_seconds="${HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS:-180}"
oneshot_container_name="${HOME_ENDPOINT_ONESHOT_CONTAINER_NAME:-home-endpoint-registry-admin-once}"
publisher_image=''

command_exists() {
  local command_name="$1"
  if [[ "${command_name}" == */* ]]; then
    [[ -x "${command_name}" ]]
  else
    command -v "${command_name}" >/dev/null 2>&1
  fi
}

on_signal() {
  pending_signal=1
  if (( critical_section == 0 )); then
    if [[ -n "${active_command_pid}" ]]; then
      kill -TERM "${active_command_pid}" 2>/dev/null || true
    fi
    exit 130
  fi
}

run_docker() {
  local command_pid command_status
  HOME_ENDPOINT_UPDATER_PID="$$" "${timeout_command}" \
    --signal=TERM \
    --kill-after=10s \
    "${docker_timeout_seconds}s" \
    "${docker_command}" "$@" &
  command_pid=$!
  active_command_pid="${command_pid}"

  while true; do
    if wait "${command_pid}"; then
      command_status=0
      break
    else
      command_status=$?
    fi

    # A trapped signal interrupts wait(1) even when the bounded child is still
    # running. During the transaction, finish waiting instead of starting a
    # rollback concurrently with that Docker operation.
    if (( critical_section == 1 )) && kill -0 "${command_pid}" 2>/dev/null; then
      continue
    fi
    break
  done

  active_command_pid=''
  return "${command_status}"
}

copy_private_file() {
  "${copy_command}" -- "$1" "$2"
}

atomic_replace_file() {
  mv -fT -- "$1" "$2"
}

ensure_oneshot_absent() {
  local matching_containers
  if ! matching_containers="$(run_docker container ls --all --quiet --filter "name=^/${oneshot_container_name}$")"; then
    return 1
  fi
  if [[ -n "${matching_containers}" ]]; then
    run_docker container rm --force "${oneshot_container_name}" >/dev/null
  fi
  if ! matching_containers="$(run_docker container ls --all --quiet --filter "name=^/${oneshot_container_name}$")"; then
    return 1
  fi
  [[ -z "${matching_containers}" ]]
}

run_publisher_once() {
  local publish_status
  oneshot_cleanup_failed=0
  if run_docker compose run \
    --name "${oneshot_container_name}" \
    --interactive=false \
    --no-TTY \
    --rm \
    --no-deps \
    publisher once --force; then
    return 0
  else
    publish_status=$?
  fi
  if ! ensure_oneshot_absent; then
    oneshot_cleanup_failed=1
  fi
  return "${publish_status}"
}

secure_delete() {
  local target="${1:-}"
  if [[ -z "${target}" || ! -e "${target}" ]]; then
    return
  fi
  if command -v shred >/dev/null 2>&1; then
    shred --force --iterations=2 --zero --remove -- "${target}" || rm -f -- "${target}"
  else
    rm -f -- "${target}"
  fi
}

restore_publisher_state() {
  if (( publisher_should_run == 1 )); then
    (cd -- "${project_directory}" && run_docker compose up -d --force-recreate publisher) || return $?
    if (( publisher_was_paused == 1 )); then
      (cd -- "${project_directory}" && run_docker compose pause publisher) || return $?
    fi
  elif (( publisher_had_container == 1 )); then
    (cd -- "${project_directory}" && run_docker compose create --force-recreate publisher) || return $?
  fi
}

restore_previous_services() {
  if [[ ! -f "${previous_file}" || -L "${previous_file}" ]]; then
    printf '%s\n' 'The previous private service catalog is unavailable for rollback.' >&2
    return 1
  fi
  restore_temporary_file="$(mktemp "${secret_directory}/.services.json.restore.XXXXXX")"
  chmod 600 -- "${restore_temporary_file}"
  copy_private_file "${previous_file}" "${restore_temporary_file}"
  chmod 600 -- "${restore_temporary_file}"
  atomic_replace_file "${restore_temporary_file}" "${services_file}"
  restore_temporary_file=''
}

report_incomplete_registry_rollback() {
  if (( publisher_should_run == 1 && publisher_was_paused == 0 )); then
    printf '%s\n' 'The previous catalog was restored, but registry rollback publication is pending; the restored daemon will force a retry.' >&2
  else
    printf '%s\n' 'The previous catalog was restored, but registry rollback publication failed while the daemon was stopped; an operator must retry publication.' >&2
  fi
}

rollback_after_unexpected_exit() {
  local restore_status=0 rollback_publish_status=0 publisher_restore_status=0

  printf '%s\n' 'The service-catalog transaction exited unexpectedly; attempting rollback.' >&2
  restore_previous_services || restore_status=$?
  if (( restore_status == 0 )); then
    run_publisher_once || rollback_publish_status=$?
  fi

  transaction_active=0
  restore_publisher_state || publisher_restore_status=$?
  critical_section=0

  if (( restore_status != 0 )); then
    printf '%s\n' 'Automatic rollback could not restore the previous private catalog; operator recovery is required.' >&2
  elif (( rollback_publish_status != 0 )); then
    report_incomplete_registry_rollback
  else
    printf '%s\n' 'The previous service catalog and registry were restored.' >&2
  fi
  if (( publisher_restore_status != 0 )); then
    printf '%s\n' 'The prior publisher state could not be restored automatically.' >&2
  fi
}

cleanup_on_exit() {
  local exit_status=$?
  trap - EXIT
  set +e

  if [[ -n "${temporary_file}" ]]; then
    secure_delete "${temporary_file}"
  fi
  if [[ -n "${backup_temporary_file}" ]]; then
    secure_delete "${backup_temporary_file}"
  fi
  if [[ -n "${restore_temporary_file}" ]]; then
    secure_delete "${restore_temporary_file}"
  fi
  if (( transaction_active == 1 )); then
    rollback_after_unexpected_exit
  fi

  if (( pending_signal == 1 )); then
    exit 130
  fi
  exit "${exit_status}"
}
trap cleanup_on_exit EXIT
trap on_signal HUP INT TERM

if (( $# != 2 )) || [[ "$1" != "--services-file" ]]; then
  printf '%s\n' 'Usage: update-services.sh --services-file MODE_0600_JSON' >&2
  exit 1
fi

candidate_source="$2"
if [[ ! -f "${candidate_source}" || -L "${candidate_source}" ]]; then
  printf '%s\n' 'Service input must be a regular, non-symlink file.' >&2
  exit 1
fi

case "$(uname -s)" in
  Linux*)
    input_mode="$(stat -c '%a' -- "${candidate_source}")"
    if [[ "${input_mode}" != "600" && "${input_mode}" != "400" ]]; then
      printf '%s\n' 'Service input must have mode 0600 or 0400.' >&2
      exit 1
    fi
    ;;
esac

if [[ ! "${docker_timeout_seconds}" =~ ^[1-9][0-9]{0,3}$ ]] || (( docker_timeout_seconds > 3600 )); then
  printf '%s\n' 'HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS must be an integer from 1 through 3600.' >&2
  exit 1
fi
for required_command in "${lock_command}" "${timeout_command}" "${docker_command}" "${copy_command}"; do
  if ! command_exists "${required_command}"; then
    printf 'Required command is unavailable: %s\n' "${required_command}" >&2
    exit 1
  fi
done

umask 077
mkdir -p -- "${secret_directory}"
chmod 700 -- "${secret_directory}"
cd -- "${project_directory}"

if [[ -L "${lock_file}" ]] || { [[ -e "${lock_file}" ]] && [[ ! -f "${lock_file}" ]]; }; then
  printf '%s\n' 'The updater lock path must be a regular, non-symlink file.' >&2
  exit 1
fi
exec {lock_fd}>"${lock_file}"
chmod 600 -- "${lock_file}"
if ! "${lock_command}" -n "${lock_fd}"; then
  printf '%s\n' 'Another service-catalog update is already running.' >&2
  exit 75
fi

if [[ ! -f "${services_file}" || -L "${services_file}" ]]; then
  printf '%s\n' 'The current private service catalog must be a regular, non-symlink file.' >&2
  exit 1
fi
if { [[ -e "${previous_file}" ]] || [[ -L "${previous_file}" ]]; } && \
  { [[ ! -f "${previous_file}" ]] || [[ -L "${previous_file}" ]]; }; then
  printf '%s\n' 'The previous-catalog path must be absent or a regular, non-symlink file.' >&2
  exit 1
fi

publisher_image="$(run_docker compose config --images publisher)"
if [[ -z "${publisher_image}" || "${publisher_image}" == *$'\n'* ]]; then
  printf '%s\n' 'Compose must resolve exactly one publisher image for candidate validation.' >&2
  exit 1
fi

temporary_file="$(mktemp "${secret_directory}/.services.json.new.XXXXXX")"
chmod 600 -- "${temporary_file}"
copy_private_file "${candidate_source}" "${temporary_file}"
chmod 600 -- "${temporary_file}"

case "$(uname -s)" in
  Linux*) validator_user="$(stat -c '%u:%g' -- "${temporary_file}")" ;;
  *) validator_user="$(id -u):$(id -g)" ;;
esac
run_docker run \
  --rm \
  --network none \
  --read-only \
  --cap-drop ALL \
  --security-opt no-new-privileges:true \
  --pids-limit 32 \
  --memory 128m \
  --cpus 0.25 \
  --user "${validator_user}" \
  --mount "type=bind,source=${temporary_file},target=/run/secrets/services-candidate.json,readonly" \
  --entrypoint node \
  "${publisher_image}" \
  src/validate-services.mjs /run/secrets/services-candidate.json

publisher_container_ids="$(run_docker compose ps --all --quiet publisher)"
if [[ -n "${publisher_container_ids}" ]]; then
  if [[ "${publisher_container_ids}" == *$'\n'* ]]; then
    printf '%s\n' 'More than one publisher container was found; refusing an ambiguous update.' >&2
    exit 1
  fi
  publisher_had_container=1
  publisher_state="$(run_docker inspect --format '{{.State.Status}}' "${publisher_container_ids}")"
  case "${publisher_state}" in
    running|restarting)
      publisher_should_run=1
      ;;
    paused)
      publisher_should_run=1
      publisher_was_paused=1
      ;;
    created|exited)
      publisher_should_run=0
      ;;
    *)
      printf 'Unsupported publisher container state: %s\n' "${publisher_state}" >&2
      exit 1
      ;;
  esac
fi

backup_temporary_file="$(mktemp "${secret_directory}/.services.json.previous.XXXXXX")"
chmod 600 -- "${backup_temporary_file}"
copy_private_file "${services_file}" "${backup_temporary_file}"
chmod 600 -- "${backup_temporary_file}"
atomic_replace_file "${backup_temporary_file}" "${previous_file}"
backup_temporary_file=''

# The catalog mount, encrypted registry and prior container state must move as
# one bounded transaction. Catchable signals are recorded and honored only
# after those three pieces have reached a consistent state.
critical_section=1
if ! ensure_oneshot_absent; then
  printf '%s\n' 'A prior one-shot publisher container could not be cleared safely.' >&2
  critical_section=0
  exit 1
fi
transaction_active=1
if (( publisher_had_container == 1 )); then
  run_docker compose rm -sf publisher
fi

atomic_replace_file "${temporary_file}" "${services_file}"
temporary_file=''

set +e
run_publisher_once
publish_status=$?
initial_oneshot_cleanup_failed=${oneshot_cleanup_failed}
set -e

if (( publish_status != 0 )); then
  local_restore_status=0
  rollback_status=0
  publisher_restore_status=0
  printf '%s\n' 'Service-catalog publication failed; restoring the previous catalog and registry.' >&2
  restore_previous_services || local_restore_status=$?
  if (( local_restore_status == 0 && initial_oneshot_cleanup_failed == 0 )); then
    set +e
    run_publisher_once
    rollback_status=$?
    rollback_oneshot_cleanup_failed=${oneshot_cleanup_failed}
    set -e
  else
    rollback_oneshot_cleanup_failed=${initial_oneshot_cleanup_failed}
  fi

  transaction_active=0
  if (( initial_oneshot_cleanup_failed == 0 && rollback_oneshot_cleanup_failed == 0 )); then
    set +e
    restore_publisher_state
    publisher_restore_status=$?
    set -e
  else
    publisher_restore_status=1
  fi
  critical_section=0

  if (( local_restore_status != 0 )); then
    printf '%s\n' 'Automatic rollback could not restore the previous private catalog; operator recovery is required.' >&2
  elif (( initial_oneshot_cleanup_failed != 0 || rollback_oneshot_cleanup_failed != 0 )); then
    printf '%s\n' 'A one-shot publisher container could not be confirmed stopped; the persistent daemon remains stopped and operator recovery is required.' >&2
  elif (( rollback_status != 0 )); then
    report_incomplete_registry_rollback
  else
    printf '%s\n' 'The previous service catalog and registry were restored.' >&2
  fi
  if (( publisher_restore_status != 0 )); then
    printf '%s\n' 'The prior publisher state could not be restored automatically.' >&2
  fi
  if (( pending_signal == 1 )); then
    exit 130
  fi
  exit "${publish_status}"
fi

transaction_active=0
set +e
restore_publisher_state
publisher_restore_status=$?
set -e
critical_section=0

if (( publisher_restore_status != 0 )); then
  printf '%s\n' 'The catalog and registry were updated, but the prior publisher state could not be restored automatically.' >&2
  exit "${publisher_restore_status}"
fi
if (( pending_signal == 1 )); then
  exit 130
fi

printf '%s\n' 'Service catalog changed and the encrypted registry was republished.'
printf '%s\n' 'The previous private catalog remains available as secrets/services.json.previous.'
