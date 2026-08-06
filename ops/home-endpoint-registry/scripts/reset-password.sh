#!/usr/bin/env bash
set -Eeuo pipefail
set +x

project_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
secret_directory="${project_directory}/secrets"
password_file="${secret_directory}/home_access_password"
lock_file="${secret_directory}/.publisher-mutation.lock"
temporary_file=''
backup_file=''
active_command_pid=''
had_previous_password=0
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

restore_previous_secret() {
  if (( had_previous_password != 1 )) || [[ -z "${backup_file}" || ! -f "${backup_file}" || -L "${backup_file}" ]]; then
    printf '%s\n' 'The previous password backup is unavailable for rollback.' >&2
    return 1
  fi
  chmod 600 -- "${backup_file}"
  atomic_replace_file "${backup_file}" "${password_file}"
  backup_file=''
}

report_incomplete_registry_rollback() {
  if (( publisher_should_run == 1 && publisher_was_paused == 0 )); then
    printf '%s\n' 'The previous password was restored, but registry rollback publication is pending; the restored daemon will force a retry.' >&2
  else
    printf '%s\n' 'The previous password was restored, but registry rollback publication failed while automatic retry is unavailable; an operator must retry publication.' >&2
  fi
}

rollback_after_unexpected_exit() {
  local restore_status=0 rollback_publish_status=0 publisher_restore_status=0 cleanup_status=0

  printf '%s\n' 'The password transaction exited unexpectedly; attempting rollback.' >&2
  ensure_oneshot_absent || cleanup_status=$?
  if (( had_previous_password == 1 )); then
    restore_previous_secret || restore_status=$?
    if (( restore_status == 0 && cleanup_status == 0 )); then
      run_publisher_once || rollback_publish_status=$?
      if (( oneshot_cleanup_failed != 0 )); then cleanup_status=1; fi
    fi
  fi

  transaction_active=0
  if (( cleanup_status == 0 )); then
    restore_publisher_state || publisher_restore_status=$?
  else
    publisher_restore_status=1
  fi
  critical_section=0

  if (( had_previous_password == 1 )); then
    if (( restore_status != 0 )); then
      printf '%s\n' 'Automatic rollback could not restore the previous password; operator recovery is required.' >&2
    elif (( cleanup_status != 0 )); then
      printf '%s\n' 'A one-shot publisher container could not be confirmed stopped; the persistent daemon remains stopped and operator recovery is required.' >&2
    elif (( rollback_publish_status != 0 )); then
      report_incomplete_registry_rollback
    else
      printf '%s\n' 'The previous password and registry were restored.' >&2
    fi
  else
    printf '%s\n' 'No previous password existed; the new secret was retained for an explicit retry.' >&2
  fi
  if (( publisher_restore_status != 0 )); then
    printf '%s\n' 'The prior publisher state could not be restored automatically.' >&2
  fi
}

cleanup_on_exit() {
  local exit_status=$?
  trap - EXIT
  set +e
  unset first_password second_password

  if [[ -n "${temporary_file}" ]]; then
    secure_delete "${temporary_file}"
  fi
  if (( transaction_active == 1 )); then
    rollback_after_unexpected_exit
  fi
  if [[ -n "${backup_file}" ]]; then
    secure_delete "${backup_file}"
  fi

  if (( pending_signal == 1 )); then
    exit 130
  fi
  exit "${exit_status}"
}
trap cleanup_on_exit EXIT
trap on_signal HUP INT TERM

if (( $# == 0 )); then
  if [[ ! -t 0 ]]; then
    printf '%s\n' 'Password reset requires an interactive terminal.' >&2
    exit 1
  fi
  printf '%s' 'New owner-access password: ' >&2
  IFS= read -r -s first_password
  printf '\n%s' 'Confirm owner-access password: ' >&2
  IFS= read -r -s second_password
  printf '\n' >&2
elif (( $# == 2 )) && [[ "$1" == "--password-file" ]]; then
  input_password_file="$2"
  if [[ ! -f "${input_password_file}" || -L "${input_password_file}" ]]; then
    printf '%s\n' 'Password input must be a regular, non-symlink file.' >&2
    exit 1
  fi
  case "$(uname -s)" in
    Linux*)
      input_mode="$(stat -c '%a' -- "${input_password_file}")"
      if [[ "${input_mode}" != "600" && "${input_mode}" != "400" ]]; then
        printf '%s\n' 'Password input file must have mode 0600 or 0400.' >&2
        exit 1
      fi
      ;;
  esac
  first_password=''
  IFS= read -r first_password < "${input_password_file}" || [[ -n "${first_password}" ]]
  if [[ "${first_password}" == *$'\r'* ]] || IFS= read -r _extra_line < <(sed -n '2p' -- "${input_password_file}"); then
    unset first_password _extra_line
    printf '%s\n' 'Password input file must contain exactly one line.' >&2
    exit 1
  fi
  second_password="${first_password}"
else
  printf '%s\n' 'Usage: reset-password.sh [--password-file MODE_0600_FILE]' >&2
  exit 1
fi

if [[ "${first_password}" != "${second_password}" ]]; then
  unset first_password second_password
  printf '%s\n' 'Passwords do not match; nothing was changed.' >&2
  exit 1
fi

if ! command -v iconv >/dev/null 2>&1; then
  unset first_password second_password
  printf '%s\n' 'The iconv command is required to validate the password safely.' >&2
  exit 1
fi
if ! password_utf32_bytes="$(printf '%s' "${first_password}" | iconv -f UTF-8 -t UTF-32LE | wc -c | tr -d '[:space:]')"; then
  unset first_password second_password
  printf '%s\n' 'Password must be valid UTF-8.' >&2
  exit 1
fi
if (( password_utf32_bytes % 4 != 0 )); then
  unset first_password second_password password_utf32_bytes
  printf '%s\n' 'Password must be valid UTF-8.' >&2
  exit 1
fi
password_size=$((password_utf32_bytes / 4))
unset password_utf32_bytes
if (( password_size < 16 || password_size > 1024 )) || [[ "${first_password}" =~ ^[0-9]+$ ]]; then
  unset first_password second_password
  printf '%s\n' 'Password must contain 16-1024 Unicode characters and must not be numeric-only.' >&2
  exit 1
fi

if [[ ! "${docker_timeout_seconds}" =~ ^[1-9][0-9]{0,3}$ ]] || (( docker_timeout_seconds > 3600 )); then
  unset first_password second_password
  printf '%s\n' 'HOME_ENDPOINT_DOCKER_TIMEOUT_SECONDS must be an integer from 1 through 3600.' >&2
  exit 1
fi
for required_command in "${lock_command}" "${timeout_command}" "${docker_command}" "${copy_command}"; do
  if ! command_exists "${required_command}"; then
    unset first_password second_password
    printf 'Required command is unavailable: %s\n' "${required_command}" >&2
    exit 1
  fi
done

umask 077
mkdir -p -- "${secret_directory}"
chmod 700 -- "${secret_directory}"
cd -- "${project_directory}"

if [[ -L "${lock_file}" ]] || { [[ -e "${lock_file}" ]] && [[ ! -f "${lock_file}" ]]; }; then
  unset first_password second_password
  printf '%s\n' 'The publisher-mutation lock path must be a regular, non-symlink file.' >&2
  exit 1
fi
exec {lock_fd}>"${lock_file}"
chmod 600 -- "${lock_file}"
if ! "${lock_command}" -n "${lock_fd}"; then
  unset first_password second_password
  printf '%s\n' 'Another publisher mutation is already running.' >&2
  exit 75
fi

publisher_container_ids="$(run_docker compose ps --all --quiet publisher)"
if [[ -n "${publisher_container_ids}" ]]; then
  if [[ "${publisher_container_ids}" == *$'\n'* ]]; then
    unset first_password second_password
    printf '%s\n' 'More than one publisher container was found; refusing an ambiguous reset.' >&2
    exit 1
  fi
  publisher_had_container=1
  publisher_state="$(run_docker inspect --format '{{.State.Status}}' "${publisher_container_ids}")"
  case "${publisher_state}" in
    running|restarting) publisher_should_run=1 ;;
    paused)
      publisher_should_run=1
      publisher_was_paused=1
      ;;
    created|exited) publisher_should_run=0 ;;
    *)
      unset first_password second_password
      printf 'Unsupported publisher container state: %s\n' "${publisher_state}" >&2
      exit 1
      ;;
  esac
fi

if [[ -e "${password_file}" || -L "${password_file}" ]]; then
  if [[ ! -f "${password_file}" || -L "${password_file}" ]]; then
    unset first_password second_password
    printf '%s\n' 'The current password path must be absent or a regular, non-symlink file.' >&2
    exit 1
  fi
  had_previous_password=1
  backup_file="$(mktemp "${secret_directory}/.home_access_password.backup.XXXXXX")"
  chmod 600 -- "${backup_file}"
  copy_private_file "${password_file}" "${backup_file}"
  chmod 600 -- "${backup_file}"
fi

temporary_file="$(mktemp "${secret_directory}/.home_access_password.new.XXXXXX")"
printf '%s' "${first_password}" > "${temporary_file}"
chmod 600 -- "${temporary_file}"
unset first_password second_password

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

atomic_replace_file "${temporary_file}" "${password_file}"
temporary_file=''

set +e
run_publisher_once
publish_status=$?
initial_oneshot_cleanup_failed=${oneshot_cleanup_failed}
set -e

if (( publish_status != 0 )); then
  restore_status=0
  rollback_status=0
  rollback_oneshot_cleanup_failed=${initial_oneshot_cleanup_failed}
  publisher_restore_status=0

  if (( had_previous_password == 1 )); then
    printf '%s\n' 'New-password publication failed; restoring the previous password and registry.' >&2
    restore_previous_secret || restore_status=$?
    if (( restore_status == 0 && initial_oneshot_cleanup_failed == 0 )); then
      set +e
      run_publisher_once
      rollback_status=$?
      rollback_oneshot_cleanup_failed=${oneshot_cleanup_failed}
      set -e
    fi
  else
    printf '%s\n' 'Initial publication failed; retaining the new secret for an explicit retry.' >&2
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

  if (( had_previous_password == 1 )); then
    if (( restore_status != 0 )); then
      printf '%s\n' 'Automatic rollback could not restore the previous password; operator recovery is required.' >&2
    elif (( initial_oneshot_cleanup_failed != 0 || rollback_oneshot_cleanup_failed != 0 )); then
      printf '%s\n' 'A one-shot publisher container could not be confirmed stopped; the persistent daemon remains stopped and operator recovery is required.' >&2
    elif (( rollback_status != 0 )); then
      report_incomplete_registry_rollback
    else
      printf '%s\n' 'The previous password and registry were restored.' >&2
    fi
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
if [[ -n "${backup_file}" ]]; then
  secure_delete "${backup_file}"
  backup_file=''
fi
set +e
restore_publisher_state
publisher_restore_status=$?
set -e
critical_section=0

if (( publisher_restore_status != 0 )); then
  printf '%s\n' 'The password and registry were updated, but the prior publisher state could not be restored automatically.' >&2
  exit "${publisher_restore_status}"
fi
if (( pending_signal == 1 )); then
  exit 130
fi

printf '%s\n' 'Password changed and the encrypted registry was republished.'
