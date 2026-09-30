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

Start / keep alive the dev server (background, port 3000, hot-reload on file edits):

```sh
cd ~/workspace/interstellar/interstellar-docs-tech
PATH=~/workspace/bin:$PATH nohup npx docusaurus start --no-open --host 0.0.0.0 --port 3000 \
  > /tmp/docusaurus-dev.log 2>&1 &
# check: curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # -> 200
# logs:  tail -f /tmp/docusaurus-dev.log
```

If the server dies (log shows "compiled successfully" but process gone), restart with the same
command; `~/.cache` lives on a read-only mount is NOT an issue — Docusaurus cache is in-repo
(`.docusaurus/`, gitignored).

## Tasks

### [1] First version of the (semi) public "Interstellar Android/iOS SDK" docs
- split iOS vs Android at the "root" unless signatures are exactly identical
- document the public part of `InterstellarSdk` — every part/API explained
- source of truth: `../wallet-app-internal`
  - Android: `shared/src/androidMain/kotlin/gg/interstellar/wallet/InterstellarSdk.kt`
  - iOS: `iosApp/InterstellarSdk/InterstellarSdk.swift`
- status: **FIXED** → `developers/SDK/` (intro + android/{index,api-reference,pinpad} + ios/{index,api-reference,pinpad})
- notes:
  - iOS/Android split at the root as required; identical-behavior contracts (pinpad result semantics,
    server-reset) documented on both sides with a cross-link + a differences table (iOS api-reference).
  - naming kept faithful to source of truth: Android `getterRootAccount()` vs iOS `getRootAccount()`,
    iOS `TxAmount.fixed(amountInAtomicUnits:)` (atomic) vs Android `JniTxAmount.fixed()` (display units).

### [2] M5 → M6: new "Milestones 6" section + walk roadmap#305 items
- start from what matches https://interstellar-docs-tech.pages.dev/developers/category/milestones-5
  and replace M5/Milestone 5 → M6/Milestone 6 EVERYWHERE (commands, text, links…)
- then go item by item through https://github.com/Interstellar-Network/roadmap/issues/305
- status: **FIXED** → `developers/Milestones/M6/` (local-demo-with-docker, quick-start-evaluator,
  components_delivered/interstellar_sdk) + `developers/intro.md` shortcut now points at M6
- #305 walk-down mapping:
  - "update demo website for M6" → M6 section (clone of M5 with renames: testnet-m6 tags,
    links, prose; M5-specific scope/PR refs rewritten to M6 scope, M5 history preserved + linked)
  - "add integration guide for the SDK" → SDK section (task [1]) + getting-started (task [3])
  - deliverable "doc of the public part of InterstellarSdk" → task [1] (done)
  - deliverable "testing guide: hello-world getterRootAccount" → task [3] (next)
  - "iOS keystore NOT reset on uninstall" → documented in `developers/SDK/ios/index.md`
    (Keystore persistence info box)
  - "builds with placeholder/blank API keys but fails at runtime; contact us for test keys;
    or get your own (MoonPay dashboard / Reown lab)" → warning box in M6 local-demo
    (Install the app section)
  - "MoonPay sandbox: good practice to return the funds (ETH only, address built-in)" →
    new section 2.1 bis in M6 local-demo
  - "SOL tx / pending tx TTL < 30s: complete the pinpad quickly" → warning in M6 local-demo
    (2.2) + both SDK pinpad guides (android/ios)
  - "publish new containers" / "publish new wallet-app" → NOT a docs task: these are the
    release/CI deliverables that accompany this docs update; docs point at the accompanying
    `testnet-m6` tag in Interstellar-Network/containers (release to be published with this issue)

### [3] "Getting started" per platform (Android AND iOS)
- fresh new app in Android Studio / Xcode → integrate SDK the most basic way
- end with a screen showing the root account ID (`getterRootAccount` / `getRootAccount`) and stop there
- status: **FIXED** → `developers/SDK/android/getting-started.md` + `developers/SDK/ios/getting-started.md`
  (sidebar positions reshuffled: getting-started=1, api-reference=2, pinpad=3; index "Next steps",
  M6 quick-start and interstellar_sdk.md table now link to them)
- integration recipes verified against wallet-app-internal: Android = copy `shared/` + the Rust
  workspace files (Cargo.toml, Cargo.lock, rust-toolchain.toml, .cargo/config.toml) because the
  module's cargo build runs at the Gradle rootDir; iOS = sibling wallet-app-internal checkout +
  Run Script phase `:shared:embedAndSignAppleFrameworkForXcode` + reference-app build settings
  (FRAMEWORK/LIBRARY_SEARCH_PATHS, OTHER_LDFLAGS, bridging header, Generated/)

## Screenshot placeholders (to be replaced with real captures)

All placeholders are visible blockquotes in the pages (`📷 [SCREENSHOT PLACEHOLDER] — …`):

- [ ] `developers/SDK/android/getting-started.md`:
  1. Android Studio "New Project" dialog (Empty Views Activity selected)
  2. Project view showing `app/` + `shared/` + copied Rust workspace files
  3. Running app (emulator/device) showing "Root account ID:" + 64-char hex
- [ ] `developers/SDK/ios/getting-started.md`:
  1. Xcode "Choose a template" dialog (iOS App selected)
  2. Workspace layout: Xcode project + sibling `wallet-app-internal` checkout
  3. Xcode Build Settings pane (FRAMEWORK/LIBRARY_SEARCH_PATHS, OTHER_LDFLAGS)
  4. iOS Simulator running the app showing "Root account ID:" + 64-char hex
