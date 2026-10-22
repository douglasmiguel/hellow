#!/usr/bin/env bash
# Generated for Hellow __VERSION__. Run on the BeeDev Linode server.
# Updates the existing privacy HTML only; existing assets and Nginx stay in place.
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this saved script with sudo bash (or as root)." >&2
  exit 1
fi

site=/home/beedev/projects/hellow-policy/hellow/privacy
backups=/home/beedev/projects/hellow-policy-backups
url=https://douglasmiguel.com.br/hellow/privacy/
expected_sha=__SHA256__

for command in curl sha256sum cmp flock mktemp cp mv chmod; do
  command -v "$command" >/dev/null || { echo "Missing command: $command" >&2; exit 1; }
done

if [[ ! -f "$site/index.html" || -L "$site/index.html" || ! -f "$site/assets/hellow-mark.svg" || ! -f "$site/assets/alpine-lake.jpg" ]]; then
  echo "Expected the existing Hellow privacy page and assets at $site. Nothing changed." >&2
  exit 1
fi

mkdir -p "$backups"
chmod 700 "$backups"
exec 9>"$backups/deploy.lock"
flock -n 9 || { echo "Another privacy-page deployment is running." >&2; exit 1; }

workdir=$(mktemp -d)
staged=
backup=
installed=false
cleanup() {
  result=$?
  trap - EXIT
  if [[ $result -ne 0 && $installed == true ]]; then
    echo "Deployment failed. Restoring the previous privacy page." >&2
    if rollback=$(mktemp "$site/.index-rollback.XXXXXX") &&
       cp -p "$backup" "$rollback" && mv -f "$rollback" "$site/index.html"; then
      echo "Previous page restored. Backup: $backup" >&2
    else
      echo "Automatic restore failed. Restore $backup to $site/index.html manually." >&2
    fi
  fi
  [[ -z "$staged" ]] || rm -f -- "$staged"
  rm -rf -- "$workdir"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

cat > "$workdir/index.html" <<'HELLOW_PRIVACY_HTML'
__HTML__
HELLOW_PRIVACY_HTML
actual_sha=$(sha256sum "$workdir/index.html")
actual_sha=${actual_sha%% *}
if [[ "$actual_sha" != "$expected_sha" ]]; then
  echo "Embedded page checksum mismatch. Nothing changed." >&2
  exit 1
fi

release_id="$(date -u +%Y%m%dT%H%M%SZ)-$$"
backup="$backups/index-$release_id.html"
cp -p "$site/index.html" "$backup"
staged=$(mktemp "$site/.index-new.XXXXXX")
cp "$workdir/index.html" "$staged"
chmod 644 "$staged"
# Set before the rename so interruption immediately after it still triggers rollback.
installed=true
mv -f "$staged" "$site/index.html"
staged=

verified=false
for attempt in 1 2 3; do
  if curl --fail --silent --show-error --location \
      --proto '=https' --proto-redir '=https' \
      --connect-timeout 5 --max-time 15 \
      -H 'Cache-Control: no-cache' \
      --output "$workdir/live.html" "$url?hellow_deploy=$release_id" &&
     cmp -s "$workdir/index.html" "$workdir/live.html"; then
    verified=true
    break
  fi
  if [[ $attempt -lt 3 ]]; then sleep 2; fi
done

if [[ $verified != true ]]; then
  echo "HTTPS content verification failed after three attempts." >&2
  exit 1
fi

printf 'Hellow __VERSION__ privacy page deployed and verified: %s\nBackup: %s\nSHA-256: %s\n' "$url" "$backup" "$expected_sha"
