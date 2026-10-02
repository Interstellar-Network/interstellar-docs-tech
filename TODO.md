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

### [4] SDK intro: Android/iOS architecture is the SAME (uniffi on both) — fix intro.md
- user quote (current `developers/SDK/intro.md` architecture section, which is WRONG/misleading):
  > "Android: the SDK ships as the Gradle module :shared (package gg.interstellar.wallet) — Kotlin +
  > the Rust .so libraries, integrated with the Android Keystore (P-256 ECDSA). iOS: the SDK is the
  > InterstellarSdk.swift layer (Keychain-backed P-256 signer) on top of the Kotlin Multiplatform
  > shared framework and uniffi-generated Swift bindings to the same Rust core."
- CONFIRMED (user asked YES/NO): **YES — same architecture.** The `substrate-client` FFI is
  **uniffi on BOTH platforms**:
  - Android: committed uniffi-Kotlin bindings (`shared/src/androidMain/kotlin/uniffi/uniffi/
    substrate_client/substrate_client.kt`, JNA) + thin adapter `RustWrapper.kt` (imports
    `uniffi.substrate_client.*` for every call) + `System.loadLibrary("substrate_client")`
  - iOS: committed uniffi-Swift bindings (`iosApp/InterstellarSdk/Generated/substrate_client.swift`)
    + `InterstellarSdk.swift` calling the same Rust `substrate-client` crate
  - ONLY exception = the pinpad **renderer** seam: Android hand-written JNI
    (`external fun initSurface`, needs the Android `Surface` object) vs iOS extern "C"
    (`init_surface_with_view` via bridging header, CAMetalLayer) — same Rust `renderer` crate,
    per-platform glue by nature (platform surface objects don't cross uniffi)
- TODO when picked up:
  - rewrite `intro.md` architecture text + mermaid diagram (uniffi on both, renderer exception)
  - sweep the platform pages for the same claim (android/index, ios/index, getting-starteds,
    M6 components_delivered/interstellar_sdk.md mention "KMP shared framework + uniffi" for iOS only)
  - double-check the KMP `shared` framework's actual role on iOS (what `import shared` provides:
    CoinType/enums from commonMain; iOS has its own CurrencyMath.swift — Android uses
    androidMain CurrencyMath) and document it accurately
- status: **FIXED** → `intro.md` architecture rewritten (same uniffi FFI on both + renderer-seam
  note + updated mermaid: RustWrapper adapter, per-platform glue dashed); `android/index.md`
  ".so/uniffi-Kotlin/JNA vs renderer-JNI" fixed; `ios/index.md` `import shared` role fixed;
  `ios/api-reference.md` CurrencyMath provenance fixed (SDK's own CurrencyMath.swift, not KMP);
  `M6/components_delivered/interstellar_sdk.md` deliverable #1 reworded. Production build passes.

### [5] M6 local-demo-with-docker: deduplicate vs M5 — link instead of copy
- problem: `developers/Milestones/M6/local-demo-with-docker.md` is ~99% a copy-paste of the M5
  tutorial (incl. the whole "WalletConnect — Tutorial" walkthrough + logs) = waste of time/space
- TODO when picked up:
  - reduce M6 local-demo to what CHANGED vs M5 (release tag testnet-m6, M6 scope note, new #305
    items: API-keys box, MoonPay sandbox, SOL TTL) and **link** to
    `developers/Milestones/M5/local-demo-with-docker` for everything shared — the user suggests
    the whole `#walletconnect--tutorial` section (and likely the logs section) should just be a
    link to the M5 equivalent
  - keep the M6-only content: stack config download (testnet-m6), APK links, scope note, the
    issue#305-derived warnings, reviewer follow-up links
  - watch the anchor links (M6 pages cross-referencing sections that moved to M5)
- status: **FIXED** → `local-demo-with-docker.md` 1001 → 156 lines: kept M6-specific content
  (scope note, testnet-m6 stack download, APK links + M5-history note, API-keys warning,
  closing notes) + new "## 3. Drive the wallet app — WalletConnect tutorial (unchanged from M5)"
  with an anchor-verified link table to the M5 tutorial (scope/prereqs/connect/tx/other dapps/
  production dapps/interpreting logs) + preserved as "M6-specific notes": MoonPay sandbox
  return-funds, SOL pending-TTL <30s, M3 funding-guide link. All M5 anchors verified against
  the built HTML; production build passes.

### [6] SDK access story: reviewer-facing "getting started" must make SDK access work & be documented
- context: http://127.0.0.1:3456/developers/SDK/intro#status--scope-please-read — "The SDK will not
  be public at this time" must be **clearer** (who can get it, how, what they may do with it)
- facts: the reviewer **WILL have access to the `wallet-app-internal` repo** → at the very least
  plain `git clone` works; ideally document a proper distribution (maven/gradle coordinate or
  similar) — placeholder if that doesn't exist yet
- TODO when picked up:
  - clarify the "Status & scope" box in `developers/SDK/intro.md`: access = private repo access
    (git), public release later; no mystery "contact us" without an actionable path
  - in BOTH getting-started guides (`developers/SDK/android/getting-started.md`,
    `developers/SDK/ios/getting-started.md`) the "Prerequisites → SDK access" row + "Bring in the
    SDK" step must be made to actually WORK for a reviewer with repo access: exact clone command,
    where the files come from, what to copy — git-level instructions verified end-to-end
  - document the ideal distribution (published artifact / maven coordinate / SPM) — **USE A
    PLACEHOLDER** (clearly marked "TBD/coming") if no artifact publication exists yet
  - make sure the intro.md warning box links to that access documentation
- status: **FIXED** → `intro.md` "Status & scope" box rewritten: "not public (yet)" is explicit;
  reviewer/integrator access = read access to `wallet-app-internal` with the exact `git clone`
  command (linked from both getting-started guides); artifact publication (Maven coordinate /
  SPM package) documented as a clearly-marked **"TBD (placeholder)"** note in the scope box AND
  both getting-started guides; M6 interstellar_sdk.md scope note aligned. Anchor
  `#status--scope-please-read` verified in built HTML; production build passes.

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

All placeholders are visible blockquotes in the pages (`📷 [SCREENSHOT PLACEHOLDER] — …`).
**BLOCKED on the User** (cannot be captured from the dev jail — needs real Android Studio/Xcode
GUI sessions; a local hello-world build is also possible but heavy, ask first):

- [ ] `developers/SDK/android/getting-started.md`:
  1. Android Studio "New Project" dialog (Empty Views Activity selected)
  2. Project view showing `app/` + `shared/` + copied Rust workspace files
  3. Running app (emulator/device) showing "Root account ID:" + 64-char hex
- [ ] `developers/SDK/ios/getting-started.md`:
  1. Xcode "Choose a template" dialog (iOS App selected)
  2. Workspace layout: Xcode project + sibling `wallet-app-internal` checkout
  3. Xcode Build Settings pane (FRAMEWORK/LIBRARY_SEARCH_PATHS, OTHER_LDFLAGS)
  4. iOS Simulator running the app showing "Root account ID:" + 64-char hex
