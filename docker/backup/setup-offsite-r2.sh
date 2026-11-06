#!/bin/sh
set -eu

STORE_REMOTE="${OFFSITE_STORE_REMOTE:-twise-r2}"
CRYPT_REMOTE="${OFFSITE_CRYPT_REMOTE:-twise-offsite}"
ENV_FILE="${BACKUP_ENV_FILE:-$HOME/.config/financas/backup.env}"
PASSPHRASE_BYTES=32

fail() {
  echo "Offsite setup failed: $1" >&2
  exit 1
}

ask() {
  printf '%s: ' "$1" >&2
  read -r answer
  [ -n "$answer" ] || fail "$1 is required"
  printf '%s' "$answer"
}

ask_secret() {
  printf '%s (not shown): ' "$1" >&2
  stty -echo
  read -r answer || true
  stty echo
  printf '\n' >&2
  [ -n "$answer" ] || fail "$1 is required"
  printf '%s' "$answer"
}

command -v rclone >/dev/null || fail "rclone is not installed"
[ -f "$ENV_FILE" ] || fail "$ENV_FILE not found"
. "$ENV_FILE"
: "${BACKUP_DIR:?BACKUP_DIR must be set in the backup env file}"
if grep -q BACKUP_RCLONE_REMOTE "$ENV_FILE"; then
  fail "$ENV_FILE already sets BACKUP_RCLONE_REMOTE"
fi
config_file="$(rclone config file | tail -n 1)"
if [ -f "$config_file" ] && grep -q "^\[$STORE_REMOTE\]\$" "$config_file"; then
  fail "remote $STORE_REMOTE already exists in $config_file"
fi

account_id="$(ask 'Cloudflare account ID')"
bucket="$(ask 'R2 bucket name')"
access_key="$(ask_secret 'R2 access key ID')"
secret_key="$(ask_secret 'R2 secret access key')"
passphrase="$(openssl rand -base64 "$PASSPHRASE_BYTES")"
obscured="$(printf '%s' "$passphrase" | rclone obscure -)"

umask 077
mkdir -p "$(dirname "$config_file")"
touch "$config_file"
chmod 600 "$config_file"
cat >>"$config_file" <<CONFIG

[$STORE_REMOTE]
type = s3
provider = Cloudflare
access_key_id = $access_key
secret_access_key = $secret_key
endpoint = https://$account_id.r2.cloudflarestorage.com
acl = private
no_check_bucket = true

[$CRYPT_REMOTE]
type = crypt
remote = $STORE_REMOTE:$bucket/financas
password = $obscured
CONFIG

latest_dump="$(ls -t "$BACKUP_DIR"/financas-db-*.dump 2>/dev/null | head -n 1)"
[ -n "$latest_dump" ] || fail "no backup in $BACKUP_DIR to test with"
latest_name="$(basename "$latest_dump")"
echo "Sending $latest_name, encrypted..."
rclone copy "$BACKUP_DIR" "$CRYPT_REMOTE:" --include "$latest_name" \
  || fail "the copy failed; check the keys and the bucket, and remove the two remotes from $config_file"
rclone cryptcheck "$BACKUP_DIR" "$CRYPT_REMOTE:" --include "$latest_name" \
  || fail "the copy does not match the local file"

cat <<MESSAGE

The copy arrived and matches the local file.

SAVE THIS PASSPHRASE OUTSIDE THE SERVER, in a password manager. Without it the
offsite backups can't be read if this server is lost. It is not shown again:

  $passphrase

MESSAGE
printf 'Press Enter once it is saved. ' >&2
read -r _

{
  echo "export PATH=\"$(dirname "$(command -v rclone)"):\$PATH\""
  echo "export BACKUP_RCLONE_REMOTE=$CRYPT_REMOTE:"
} >>"$ENV_FILE"
echo "Done. From the next run on, backups are also copied to $CRYPT_REMOTE:."
