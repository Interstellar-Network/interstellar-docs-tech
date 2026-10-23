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
- status: **FIXED** (implementation done — pending UI screenshots) → `developers/SDK/android/getting-started.md` + `developers/SDK/ios/getting-started.md`
  (sidebar positions reshuffled: getting-started=1, api-reference=2, pinpad=3; index "Next steps",
  M6 quick-start and interstellar_sdk.md table now link to them)
  - note: the iOS "Step 4" hello-world sample was updated to match the actual `iosApp/InterstellarSdk/ContentView.swift` template app (simpler `@State` string + globe icon; `onServerResetDetected: {}` inline); the display text was then simplified to `Text("Account: \(rootAccountHex)").font(.headline)`.
- integration recipes verified against wallet-app-internal: Android = copy `shared/` + the Rust
  workspace files (Cargo.toml, Cargo.lock, rust-toolchain.toml, .cargo/config.toml) because the
  module's cargo build runs at the Gradle rootDir; iOS = sibling wallet-app-internal checkout +
  Run Script phase `:shared:embedAndSignAppleFrameworkForXcode` + reference-app build settings
  (FRAMEWORK/LIBRARY_SEARCH_PATHS, OTHER_LDFLAGS, bridging header, Generated/)

### [7] Android SDK: consume the **published** Maven artifact (GitHub Packages) — rewrite the getting-started
- source of truth: `../wallet-app-internal` PR **#52** ("Android Firebase App Distribution + SDK publishing")
- facts (from the PR):
  - `:shared` applies `maven-publish` → group `gg.interstellar.wallet`, artifact `shared`,
    published test version **`0.1.0`** (KMP root metadata + the Android AAR `shared-android`)
  - distribution = **GitHub Packages** (private, repository-scoped) →
    `https://maven.pkg.github.com/interstellar-network/wallet-app-internal` (**lowercase owner!**)
  - auth = **classic** PAT (`read:packages` for consumers) + read access to the private repo;
    fine-grained PATs are NOT supported by GitHub Packages
  - the published AAR already contains the prebuilt native libs (`arm64-v8a` **and** `x86_64`)
    → a consumer needs **no Rust, no NDK, no cargo, no `:shared` module copy**
  - the consumer build needs `org.gradle.jvmargs=-Xmx2048M` (else D8 dex merging OOMs)
  - a local alternative exists: `./gradlew :shared:publishSdkToLocalTest -Psdk.version=0.1.0-local`
    → `shared/build/local-maven` (this is what the `sdk-consumer/` smoke test resolves)
- TODO when picked up:
  - rewrite `developers/SDK/android/getting-started.md` around the **published artifact**
    (no more "copy `shared/` + the Rust workspace files")
  - document the tester auth path end-to-end: classic PAT + `~/.gradle/gradle.properties`
    (`gpr.user` / `gpr.key`) + the `settings.gradle.kts` repository block
  - keep the local-maven variant as a documented alternative
  - drop the now-unneeded `jitpack.io` repository and the ABI `missingDimensionStrategy`
  - align the SDK levels with the source of truth (`compileSdk 37`, `minSdk 24`, JDK 17)
- status: **FIXED** → `developers/SDK/android/getting-started.md` rewritten around
  `gg.interstellar.wallet:shared:0.1.0` from GitHub Packages: prerequisites (no Rust/NDK
  needed — the AAR ships the prebuilt `arm64-v8a` + `x86_64` libs), a new "Step 2 — Get access
  to the SDK" (repo read access + **classic** PAT with `read:packages` + org SSO authorization +
  `~/.gradle/gradle.properties` `gpr.user`/`gpr.key`), the `settings.gradle.kts` repository
  block (lowercase owner!), the `app/build.gradle.kts` dependency, `org.gradle.jvmargs=-Xmx2048M`,
  the (unchanged) hello-world `MainActivity` using `InterstellarSdk.create(...)` +
  `getterRootAccount()`, a "build it from source instead" alternative (`:shared` module +
  `publishSdkToLocalTest` local Maven repo) and a troubleshooting table.
  `jitpack.io` and the ABI `missingDimensionStrategy` dropped. Production build passes.

### [8] iOS SDK: consume the **published** Swift package (GitHub Release zip) — rewrite the getting-started
- source of truth: `../wallet-app-internal` PR **#53** ("iOS TestFlight publishing + iOS SDK publishing")
- facts (from the PR):
  - the iOS SDK moved to **`iosSdk/`** (repo root) and is a **Swift Package Manager package**
    (`Package.swift`, `Sources/InterstellarSdk/`, `platforms: [.iOS(.v17)]`)
  - the published asset is **ONE ready-to-use zip** (`InterstellarSdk-0.1.0.zip`) containing the
    package + the two `.xcframework`s (`substrate_clientFFI`, `rendererFFI`)
  - a consumer needs **nothing but Xcode/SPM**: no Rust, no uniffi, no KMP, no Gradle,
    **no linker flags**, no "Embed & Sign" phase (the frameworks are dynamic)
  - distribution = **GitHub Releases** (the repo is private → the release is private too;
    reviewers download the asset through their repo access)
  - the SDK is **arm64 only** (device slice + arm64 simulator slice)
- TODO when picked up:
  - rewrite `developers/SDK/ios/getting-started.md` around the **published package**
    (no more "copy the Swift sources + Gradle Run Script phase + linker flags")
  - document the download (`gh release download` / browser) + "Add Local…" package step
  - keep the "build it from source" (the reference app) as a documented alternative
- status: **FIXED** → `developers/SDK/ios/getting-started.md` rewritten around the published
  `InterstellarSdk-0.1.0.zip` local Swift package: prerequisites (Xcode only — no Rust/KMP/
  Gradle), a new "Step 2 — Download the SDK" (private release + `gh release download`),
  "Step 3 — Add the package to your project" (*Add Package Dependencies… > Add Local…*;
  Xcode links **and embeds** the frameworks — no linker flags, no "Embed & Sign" phase),
  the hello-world `ContentView` (now using the Android-parity `getterRootAccount()`), an
  "Alternative — build the SDK from source" section (the reference-app path) and a
  troubleshooting table. Production build passes.
- reorganized the guide for better flow: moved the "Unzip the SDK before importing" warning
  to the start of "Step 3 — Add the package to your project" (where it is actually needed),
  and moved the "Why not a 'remote' (hosted) Swift package?" explanatory note to the end of
  "Step 2 — Download the SDK" (right after the folder structure).
- added a prominent warning to the "Alternative — build the SDK from source" section: **not a
  supported use case at this stage** — it requires many dependencies (Android Studio, a JVM,
  Rust nightly, the Android NDK) to compile, and users should stick to the published zip package.
### [9] iOS API is now **name-identical** to Android (PR #53) — sweep the iOS docs
- source of truth: `../wallet-app-internal` PR **#53** — "the API is now the SAME as the Android SDK"
- the iOS SDK exposes the **same function names** as Android (the `_`-prefixed uniffi wrappers
  are internal again): `getterRootAccount` (was `getRootAccount`), `getterCampaigns` (was
  `getCampaignIds`), `getterCampaignInfo`, `getterUserCampaigns`, `getterClientGetAccount`,
  `getterClientGetPendingTx`, `getterLatestBroadcastedTxHash`, `extrinsicClient*`, …
- TODO when picked up:
  - rewrite `developers/SDK/ios/api-reference.md` with the real signatures
  - fix `developers/SDK/ios/index.md`, `developers/SDK/ios/pinpad.md` and
    `developers/SDK/intro.md` (the "signatures are intentionally close but not identical" claim)
  - keep the **real** differences (amount units, `BigDecimal` vs `Decimal`, `StateFlow` vs
    `@Published`, `InterstellarFileSharer` vs returned `Data`) in an explicit table
- status: **FIXED** → the iOS SDK now exposes the **same function names** as Android
  (PR #53), so the whole iOS documentation was re-verified against
  `iosSdk/Sources/InterstellarSdk/InterstellarSdk.swift`:
  - `developers/SDK/ios/api-reference.md` rewritten — every public member with its real
    signature (`getterRootAccount`, `getterCampaigns`, `getterCampaignInfo`,
    `getterUserCampaigns`, `getterClientGetAccount(WithPrefix)`, `getterClientGetBalanceInCoin`
    (2 overloads), `getterClientGetBalanceInUsd`, `getterClientGetTotalBalanceInUsd`,
    `getterClientGetPendingTx`, `getterLatestBroadcastedTxHash`, `getterSignMessage`,
    `getterAirdropVca`, `extrinsicClient*`, `prepare*`, `processPinpadInputs`, …), the
    value objects (`CoinType`, `SdkCoinBalance`, `CoinBalanceBuilder`, `WalletBalances`,
    `CurrencyMath`, `SdkVcaFlowType`), the pinpad UI types, the re-exported Rust API and
    a "Differences from Android" table reduced to the **real** ones.
  - `developers/SDK/ios/index.md` rewritten: the SDK is the `iosSdk/` **Swift package**
    (the KMP `shared` framework is **not** part of the iOS SDK), iOS 17 / arm64-only,
    the published-package integration.
  - `developers/SDK/ios/pinpad.md`: `HeaderWithBrand`/`ConfirmMessageBar` now ship **with**
    the SDK (only the logo asset is app-side).
  - `developers/SDK/intro.md`: the "signatures are intentionally close but not identical"
    claim replaced by "the **names** are identical, only the signatures differ" + the
    architecture diagram fixed (no more "import shared" on iOS).
  - `developers/Milestones/M6/components_delivered/interstellar_sdk.md` aligned.
  Production build passes.
### [10] iOS: install **Xcode + a Simulator** (the Android-structuhttp://127.0.0.1:3456/developers/Milestones/M6/local-demo-with-dockerre equivalent)
- the Android getting-started starts with an explicit "install the toolchain" step; the iOS one
  must have the same shape (Xcode from the App Store, the simulator runtime, creating a device)
- TODO when picked up:
  - add an "Install Xcode and a Simulator" step to `developers/SDK/ios/getting-started.md`
  - link to Apple's official docs instead of copy-pasting them
- status: **FIXED** → both getting-started guides now have the same shape:
  - `developers/SDK/ios/getting-started.md` gained a "Step 0 — Install Xcode and a Simulator"
    (install Xcode from the App Store + the extra components, download a **simulator
    runtime** from *Settings → Components*, create a device in *Devices and Simulators* /
    the Device Hub, `xcrun simctl` + `xcodebuild -showsdks` sanity checks) — Apple's own
    pages are **linked**, not copy-pasted.
  - `developers/SDK/android/getting-started.md` gained the symmetric "Step 0 — Install
    Android Studio and the Android SDK" (setup wizard, SDK Manager, emulator creation,
    `adb devices`) — with the explicit note that the **NDK is not needed** for the
    published AAR.
  - added a `:::warning` note in `developers/SDK/ios/getting-started.md` explaining that
    Step 0 itself has not been tested end-to-end, but that the subsequent steps were tested
    on a VM image (`ghcr.io/cirruslabs/macos-tahoe-xcode:latest`, based on the `macos-26`
    image from actions/runner-images) which ships many dependencies pre-built.
  - added the **symmetric** `:::warning` note in `developers/SDK/android/getting-started.md`
    (Step 0 not tested end-to-end; subsequent steps tested on a **fresh Ubuntu 26.04 VM**
    with Android Studio installed through the **App Manager** — the Ubuntu **snap** package,
    `sudo snap install android-studio --classic`). Fixed the admonition colons
    (must be `::::` both sides, like the iOS note — the initial `:::` closing
    colon count leaked the rest of the page into the warning box).
  - the Android Studio install link in `developers/SDK/android/getting-started.md` now
    points at the official **install guide** `https://developer.android.com/studio/install`
    (instead of the generic `/studio` landing page). The older milestone docs (M1–M4,
    `android_app_local_node_launch.md`) still use the generic link — left untouched on purpose
    (out of the current SDK task scope).
  Production build passes.
### [11] iOS Simulator has **no camera** → FauxCam (WalletConnect QR)
- the iOS Simulator cannot scan the WalletConnect QR code; the workaround is
  <https://github.com/mkemalgokce/fauxcam> (FauxCamApp menu-bar app)
- the simplest flow: **copy/paste the WalletConnect URI in FauxCam's "QR" tab** (it encodes the
  text as a QR code that the simulator then "scans") — no screenshot needed
- TODO when picked up:
  - document the FauxCam install + usage (link to the upstream README)
  - wire it into the M6 local demo (WalletConnect section) and the iOS getting-started
- status: **FIXED** → new section "3.1 — iOS Simulator: scanning the WalletConnect QR" in
  `developers/Milestones/M6/local-demo-with-docker.md`: the Simulator has **no camera**, so
  the wallet app's QR scanner needs a fake camera — [FauxCam](https://github.com/mkemalgokce/fauxcam)
  (a macOS menu-bar app). Install (the `FauxCam.dmg` from the releases → `/Applications`),
  then **paste the WalletConnect URI in its "QR" tab**: FauxCam encodes it as a QR code and
  the simulator "scans" it — no screenshot to take, re-encode and import. The upstream README
  is linked, not copied. A pointer was added to the iOS getting-started troubleshooting.
  Production build passes.
### [12] iOS: "save to files" shows a **white window** (Cloud Token recovery)
- when adding a **Cloud Token** recovery, tapping "save to files" can show a **white window**
  instead of the file explorer → the fix is **Erase All Content and Settings** on the simulator
  + reinstall the app
- it is a **transient simulator issue**, *not* a bug of the Interstellar app
- TODO when picked up:
  - document the symptom + the fix in the iOS pages (recovery / troubleshooting)
- status: **FIXED** → the symptom + the fix are documented in three places:
  - `developers/SDK/ios/getting-started.md` (troubleshooting table),
  - `developers/SDK/ios/index.md` (warning box),
  - `developers/Milestones/M6/components_delivered/ios_port.md` ("Known issue").
  Symptom: adding a **Cloud Token** recovery and tapping **"save to files"** shows a **white
  window** instead of the file explorer. Fix: *Device → Erase All Content and Settings* on
  the simulator, then reinstall the app. It is explicitly stated to be a **transient Simulator
  issue, not a bug of the Interstellar app**. Production build passes.
### [13] Android app testing: **Firebase App Distribution** (tester group)
- source of truth: `../wallet-app-internal` PR **#52** — the Android app is distributed through
  [Firebase App Distribution](https://firebase.google.com/docs/app-distribution/android/distribute-gradle)
- a tester can request access to the testing group here:
  <https://appdistribution.firebase.dev/i/71f8c7de02bcbcdc>
- TODO when picked up:
  - document it in the M6 local demo (Android app install section) + link to the official docs
  - do NOT copy-paste the official docs — link to them
- status: **FIXED** → `developers/Milestones/M6/local-demo-with-docker.md` "Install the
  app" now documents the **Firebase App Distribution** route (the tester-group request link
  `https://appdistribution.firebase.dev/i/71f8c7de02bcbcdc`, what the tester gets — install
  from the browser / the Firebase tester app) with a link to the official
  [distribute-gradle](https://firebase.google.com/docs/app-distribution/android/distribute-gradle)
  documentation (linked, not copy-pasted), and
  `developers/Milestones/M6/components_delivered/app_distribution.md` documents the channel in
  full. Production build passes.
### [14] SDK access for a **tester**: Maven registry auth + iOS SDK download
- the SDK is now **published** (PR #52 for Android, #53 for iOS) → the "Artifact publication —
  TBD (placeholder)" boxes must be replaced by the **real** access story
- TODO when picked up:
  - `developers/SDK/intro.md` "Status & scope" → the real distribution story for both platforms
  - the two getting-started guides must be consistent with it
- status: **FIXED** → `developers/SDK/intro.md` "Status & scope" rewritten: the SDK is
  published but **private** and the artifacts are **not live yet** — the Android
  (GitHub Packages / Maven) and iOS (GitHub Release → one zip with the Swift package)
  coordinates are marked ⚠️ **PLACEHOLDER**, the roadmap deliverables (#230 / #231) are
  linked, the **tester access story** is spelled out (repo read access + classic PAT with
  `read:packages` + org SSO for Android; the private release asset + `gh release download`
  for iOS) and the **CI consumer smoke tests** (Android `sdk-consumer/`, iOS
  `sdk-consumer-ios/`) are documented as the proof that a consumer needs nothing but
  Android Studio / Xcode. The same placeholders were applied to both getting-started
  guides, and the M6 `interstellar_sdk.md` scope note was aligned. Production build passes.
### [15] SDK coverage sweep: the **whole** SDK must be documented on both platforms
- "DO make sure the docs for each SDK are complete and expose/explain the whole SDKs for each
  Android and iOS"
- TODO when picked up:
  - re-check the Android API reference against `InterstellarSdk.kt` (every public member)
  - re-check the iOS API reference against `iosSdk/Sources/InterstellarSdk/InterstellarSdk.swift`
    (done in [9], re-verify)
  - make sure the **value objects / helpers** (the pinpad view, the currency math, the
    `InterstellarFileSharer` / file-saving contract, the `CoinType` enum) are documented too
- status: **FIXED** → both API references re-verified **member by member** against the
  source of truth (`shared/src/androidMain/kotlin/gg/interstellar/wallet/InterstellarSdk.kt`
  and `iosSdk/Sources/InterstellarSdk/InterstellarSdk.swift`):
  - **Android**: the `DEFAULT_WS_URL` / `DEFAULT_NODE_URL` / `DEFAULT_IPFS_ADDR` /
    `TOAST_LENGTH_*` constants added; the value objects fixed to their **exact** definitions
    (`CoinType(id)`, `VcaFlowType`, `JniTxAmount` — display units, `JniPendingTxResult(status,
    …)` with 0 = RequiresVca / 1 = AutoSent, `JniCircuitsPackage`, `CampaignInfo` — where
    `amountPerClaim`/`totalFunds` are **strings**, `UserCampaign`, `InterstellarSigningException`);
    a new "What is **not** public API" section (`processPinpadInputs` is internal on Android
    but public on iOS, `RustWrapper`, `CurrencyMath`, `MobileKeySigner`,
    `PreferencesManager`/`KeysManager`, `updateWorkerEndpointForTest`).
  - **iOS**: the `MobileKeychainSigner` documented, the "What is **not** public API" section
    added (the `_getter…`/`_extrinsic…` internal wrappers, the `rust…` wrappers, the failable
    `init?`, `SdkVcaFlowType`).
  - `developers/SDK/android/index.md`: the requirements aligned with the source of truth
    (`minSdk 24`, `compileSdk 37`), the published AAR mentioned, the endpoint constants named.
  - the "build from source" alternatives are now **two** routes on both platforms
    (Android: a Gradle **composite build** of the local clone — no publish at all — or the
    local Maven repo; iOS: the local `iosSdk/` package, or the reference app's static-link
    build).
  Production build passes.
## Screenshot placeholders (to be replaced with real captures)

All placeholders are visible blockquotes in the pages (`📷 [SCREENSHOT PLACEHOLDER] — …`).
**BLOCKED on the User** (cannot be captured from the dev jail — needs real Android Studio/Xcode
GUI sessions; a local hello-world build is also possible but heavy, ask first):

- [ ] `developers/SDK/android/getting-started.md`:
  1. Android Studio "New Project" dialog (Empty Views Activity selected)
  2. Running app (emulator/device) showing "Root account ID:" + 64-char hex
- [x] `developers/SDK/ios/getting-started.md`:
  1. ~Xcode "Choose a template" dialog (iOS App selected)~ → **done** (images: `Xcode_ChooseTemplate.png`,
     `Xcode_iOSAppTemplate.png`, `Xcode_NewProjectForm.png` added to `static/img/` and embedded in the guide)
  2. ~Xcode "Add Package Dependencies… > Add Local…" dialog with the unzipped `InterstellarSdk`
     folder selected~ → **done** (images: `Xcode_AddPackageDependenciesButton.png`,
     `Xcode_AddLocalBottom.png`, `Xcode_AddPackageLocalSelected.png`,
     `Xcode_AddPackageProgressPopup.png`, `Xcode_ChoosePackageProducts.png` added to `static/img/`
     and embedded in the guide)
  3. [x] iOS Simulator running the app showing "Root account ID:" + 64-char hex (provided by user as `static/img/ios-simulator-root-account.png`; the docs now explain the Xcode logs and the expected 10–20 s wait time)
  4. [x] iOS Simulator running the **offline pinpad test** (provided by user as `static/img/ios-offline-pinpad-test.png`; embedded in the hidden "Step 6" `<details>` block, inside the collapsed section)
- [ ] `developers/Milestones/M6/local-demo-with-docker.md`:
  1. the iOS simulator running the wallet app

(removed in the meantime: the "Project view with the copied Rust workspace files" — the guide
now consumes the **published** artifact, so there is nothing to copy; and the "Xcode Build
Settings pane" — the published package needs no linker flags.)
