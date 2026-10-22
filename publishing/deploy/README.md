# Update Hellow's privacy page on BeeDev Linode

The v0.3.0 deployment script updates the existing page at
`https://douglasmiguel.com.br/hellow/privacy/` using the established web root:
`/home/beedev/projects/hellow-policy/hellow/privacy`.

## Prepare the script locally

From the repository root:

```sh
node scripts/prepare-policy-deploy.mjs
bash -n release/update-hellow-policy-0.3.0.sh
```

The generated `release/update-hellow-policy-0.3.0.sh` embeds the current
`publishing/privacy/index.html` and its SHA-256 checksum. Regenerate it whenever
the privacy page changes. The filename follows the version in `package.json`.

## Run using SSH

Replace `BEEDEV_SERVER` with the BeeDev Linode's SSH hostname or IP. No server
address or credentials are embedded in the script.

From your local terminal, upload the generated script:

```sh
scp release/update-hellow-policy-0.3.0.sh beedev@BEEDEV_SERVER:/tmp/
ssh beedev@BEEDEV_SERVER
```

In the BeeDev SSH session (including a Linode console session), run:

```sh
sudo bash /tmp/update-hellow-policy-0.3.0.sh
```

If already logged in as root, run it with `bash` directly. The server needs Bash,
`curl`, `sha256sum`, `flock`, and standard Linux file utilities. The existing
privacy HTML and its two bundled assets must already be installed.

## Deployment behavior

- Checks the embedded HTML checksum before changing the live page.
- Prevents concurrent runs with a deployment lock.
- Saves the previous HTML under `/home/beedev/projects/hellow-policy-backups/`.
- Replaces `index.html` atomically in the existing web root.
- Verifies the actual HTTPS response against the embedded HTML, with up to three
  attempts and a cache-busting query parameter.
- Restores the previous HTML if verification fails or the deployment is interrupted.
- Prints the URL, backup path, and checksum on success.

The script updates only the privacy HTML. The existing photo, logo, Nginx
configuration, certificates, redirects, and extension ZIP remain in place. An
Nginx reload is not needed for this static-file update.

Backups are retained for later recovery. To restore a backup manually, replace
`BACKUP_FILE` below with the exact backup path printed by the script, then run
as root on BeeDev:

```sh
site=/home/beedev/projects/hellow-policy/hellow/privacy
restore=$(mktemp "$site/.index-restore.XXXXXX")
cp -p BACKUP_FILE "$restore" && mv -f "$restore" "$site/index.html"
```

## Preparation validation

The generated script passed Bash syntax validation and isolated local fixture
checks for successful publication, HTTP failure rollback, stale-response rollback,
corrupt embedded content, and missing assets. These checks do not connect to Linode.
Preparing this script does not publish the page; deployment occurs when you run it
on the server.
