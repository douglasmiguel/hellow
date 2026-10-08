#!/usr/bin/env bash
set -euo pipefail
stage=/home/beedev/hellow-policy-staging
config=/etc/nginx/sites-available/douglas_miguel
backup="${config}.hellow-backup-$(date -u +%Y%m%dT%H%M%SZ)"
sudo -v
sudo mkdir -p /home/beedev/projects/hellow-policy/hellow/privacy
sudo cp -R "$stage/privacy/." /home/beedev/projects/hellow-policy/hellow/privacy/
sudo chmod -R a+rX /home/beedev/projects/hellow-policy
sudo cp -p "$config" "$backup"
sudo install -m 644 "$stage/douglas_miguel.nginx" "$config"
if ! sudo nginx -t; then
  sudo cp -p "$backup" "$config"
  echo "Nginx validation failed; original configuration restored." >&2
  exit 1
fi
if ! sudo systemctl reload nginx; then
  sudo cp -p "$backup" "$config"
  sudo nginx -t && sudo systemctl reload nginx
  echo "Reload failed; original configuration restored." >&2
  exit 1
fi
echo "Policy deployed. Configuration backup: $backup"
curl --fail --silent --show-error -I https://douglasmiguel.com.br/hellow/privacy/
