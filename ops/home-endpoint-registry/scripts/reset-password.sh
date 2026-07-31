#!/usr/bin/env bash
set -Eeuo pipefail

project_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
secret_directory="${project_directory}/secrets"
password_file="${secret_directory}/home_access_password"
temporary_file=''
backup_file=''
had_previous_password=0
publisher_was_running=0
transaction_active=0
docker_command="${HOME_ENDPOINT_DOCKER_COMMAND:-docker}"
copy_command="${HOME_ENDPOINT_COPY_COMMAND:-cp}"

run_docker() {
  "${docker_command}" "$@"
}

copy_private_file() {
  "${copy_command}" -- "$1" "$2"
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

restart_if_previously_running() {
  if (( publisher_was_running == 1 )); then
    (cd -- "${project_directory}" && run_docker compose up -d --force-recreate publisher)
  fi
}

restore_previous_secret() {
  if (( had_previous_password == 1 )) && [[ -n "${backup_file}" && -f "${backup_file}" ]]; then
    chmod 600 -- "${backup_file}"
    mv -f -- "${backup_file}" "${password_file}"
    backup_file=''
  fi
}

cleanup_on_exit() {
  if [[ -n "${temporary_file}" ]]; then
    secure_delete "${temporary_file}"
  fi
  unset first_password second_password
  if (( transaction_active == 1 )); then
    restore_previous_secret || true
    restart_if_previously_running || true
  fi
  if [[ -n "${backup_file}" ]]; then
    secure_delete "${backup_file}"
  fi
}
trap cleanup_on_exit EXIT
trap 'exit 130' HUP INT TERM

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

password_size="$(LC_ALL=C printf '%s' "${first_password}" | wc -c | tr -d '[:space:]')"
if (( password_size < 10 || password_size > 1024 )); then
  unset first_password second_password
  printf '%s\n' 'Password must contain between 10 and 1024 UTF-8 bytes.' >&2
  exit 1
fi

umask 077
mkdir -p -- "${secret_directory}"
chmod 700 -- "${secret_directory}"
cd -- "${project_directory}"

running_container="$(run_docker compose ps --status running --quiet publisher)"
if [[ -n "${running_container}" ]]; then
  publisher_was_running=1
fi

if [[ -f "${password_file}" ]]; then
  had_previous_password=1
  backup_file="$(mktemp "${secret_directory}/.home_access_password.backup.XXXXXX")"
  chmod 600 -- "${backup_file}"
  copy_private_file "${password_file}" "${backup_file}"
  chmod 600 -- "${backup_file}"
fi

# From this point through commit or rollback, interruption could desynchronize the
# mounted secret and the public ciphertext. Defer catchable signals until the
# transaction reaches a consistent state. The private backup also supports
# manual recovery after an uncatchable process or host failure.
trap '' HUP INT TERM
transaction_active=1
if (( publisher_was_running == 1 )); then
  run_docker compose stop publisher
fi

temporary_file="$(mktemp "${secret_directory}/.home_access_password.new.XXXXXX")"
printf '%s' "${first_password}" > "${temporary_file}"
chmod 600 -- "${temporary_file}"
mv -f -- "${temporary_file}" "${password_file}"
temporary_file=''
unset first_password second_password

set +e
run_docker compose run --rm --no-deps publisher once --force
publish_status=$?
set -e

if (( publish_status != 0 )); then
  rollback_status=0
  if (( had_previous_password == 1 )); then
    printf '%s\n' 'New-password publication failed; restoring the previous password and registry.' >&2
    restore_previous_secret
    set +e
    run_docker compose run --rm --no-deps publisher once --force
    rollback_status=$?
    set -e
  else
    printf '%s\n' 'Initial publication failed; retaining the new secret so an ambiguous or pending push can be retried.' >&2
  fi
  restart_if_previously_running
  transaction_active=0
  trap 'exit 130' HUP INT TERM

  if (( had_previous_password == 1 )); then
    if (( rollback_status != 0 )); then
      printf '%s\n' 'The old password was restored, but registry rollback publication is pending; the daemon will force a retry.' >&2
    else
      printf '%s\n' 'The previous password and registry were restored.' >&2
    fi
  fi
  exit "${publish_status}"
fi

transaction_active=0
if [[ -n "${backup_file}" ]]; then
  secure_delete "${backup_file}"
  backup_file=''
fi
restart_if_previously_running
trap 'exit 130' HUP INT TERM
printf '%s\n' 'Password changed and the encrypted registry was republished.'
