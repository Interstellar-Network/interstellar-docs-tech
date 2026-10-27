# TODO — docs work (branch `305-m6-docs`, roadmap#305)

Parent issue: https://github.com/Interstellar-Network/roadmap/issues/305
Milestone: M6 — docs for the (semi) public "Interstellar Android/iOS SDK".

Source of truth for all SDK content: `../wallet-app-internal` (READ ONLY).

## Process

- pick ONE task below → work locally → mark fixed + commit (NEVER push)
- NEVER edit TODO.md without the matching code change in the same commit
- NEVER edit code without the matching TODO.md task being updated (done / can't-be-done)

## How to run the dev server (bubblewrap jail notes)

The jail has no global `npm`/`npx` (only a bare `node` v26 at `/usr/bin/node`), and `$HOME`
is read-only, so the shims live in the workspace. One-time setup:

```sh
# extract a local npm client into /tmp
curl -sSL -o /tmp/npm.tgz https://registry.npmjs.org/npm/-/npm-11.6.2.tgz
tar -xzf /tmp/npm.tgz -C /tmp
# shims (dir is inside the writable workspace)
mkdir -p ~/workspace/bin
printf '#!/bin/bash\nexec node /tmp/package/bin/npm-cli.js "$@"\n' > ~/workspace/bin/npm
printf '#!/bin/bash\nexec node /tmp/package/bin/npx-cli.js "$@"\n' > ~/workspace/bin/npx
chmod +x ~/workspace/bin/npm ~/workspace/bin/npx
# deps (package-lock.json is committed)
cd ~/workspace/interstellar/interstellar-docs-tech
PATH=~/workspace/bin:$PATH npm ci --no-audit --no-fund
```

Start / keep alive the dev server (background, **port 3456**, hot-reload on file edits).
A helper script does it (it detaches the server from the agent's process group, so it
survives the command timeouts):

```sh
cd ~/workspace/interstellar/interstellar-docs-tech
./.dev-server.sh
# check: curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3456/   # -> 200
# logs:  tail -f /tmp/docusaurus-dev.log
```

Manual equivalent:

```sh
cd ~/workspace/interstellar/interstellar-docs-tech
PATH=~/workspace/bin:$PATH setsid nohup npx docusaurus start --no-open --host 0.0.0.0 \
  --port 3456 > /tmp/docusaurus-dev.log 2>&1 < /dev/null &
```

Production build check (takes minutes → run it in the background, `./.build-check.sh`;
the exit code lands in `/tmp/docusaurus-build.exit`, the log in `/tmp/docusaurus-build.log`).

If the server dies (log shows "compiled successfully" but process gone), restart with the same
command; `~/.cache` lives on a read-only mount is NOT an issue — Docusaurus cache is in-repo
(`.docusaurus/`, gitignored).

