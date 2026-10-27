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

## iOS test VM notes (double tunnel: ssh mac-scaleway → ssh admin@$(tart ip test-run-02))

- the tart VM (`test-run-02`) holds the iOS project in `~/Documents/interstellargettingstarted`
- the VM's `ContentView.swift` previously contained the **offline pinpad test** (the "bad idea"
  old hidden Step 6) — it was **RESET to the Step 5 hello-world** (`InterstellarSdk.create` +
  `getterRootAccount`) BEFORE starting the Step 6 rewrite, as required
- build there: `xcodebuild -project ~/Documents/interstellargettingstarted/InterstellarGettingStarted.xcodeproj \
  -scheme InterstellarGettingStarted -destination 'platform=iOS Simulator,name=iPhone 17e' build`

## Tasks

### [20] iOS getting-started: pivot hidden "Step 6" from the offline internal test to the all-in-one "full basic app" (mirror of the Android hidden Step 6)

The old hidden Step 6 ("*(advanced, NOT supported)* Test the pinpad offline with the internal
`ContentView.swift`" — offline circuits blob, SCALE encoding, python generator) is REPLACED by the
iOS mirror of the Android hidden Step 6 (`developers/SDK/android/getting-started.md#step-6--advanced-not-production-ready-test-the-vca-pinpad-with-an-all-in-one-mainactivitykt`):

- [x] heading style matched: `## Step 6 — *(advanced, not production-ready)* Test the VCA pinpad
  with an all-in-one \`ContentView.swift\`` + `<details><summary>▶ Show the hidden step 6</summary>`
- [x] all-in-one `ContentView.swift`: creates the SOL keypair if it does not exist
  (`extrinsicClientAddKeypair(coinTypeIdx:)` — idempotent), displays the SOL address BOTH in a
  `Text` AND the Xcode console (iOS counterpart of Logcat), tap-to-copy with the same
  "Address copied" toast as the main app (`UIPasteboard` + a minimal local `ToastView`,
  cf the reference app's `Components/CommonUI.swift` + `PortfolioScreen.swift`)
- [x] "Send test transaction" button: SOL self-send, hardcoded 0.03 SOL — above the VCA
  threshold (0.025 SOL, double-checked in `shared/.../tests/CoinTransferSdkTest.kt:
  "SOL 0.025 (auto-send below, pinpad above)"`). iOS API differences documented in the code:
  `TxAmount.fixed(amountInAtomicUnits:)` is ATOMIC units (use `convertCoinToAtomic` — Android's
  `JniTxAmount.fixed` takes a Double), `getterClientGetAccount` is cache-only (refresh via
  `updateBalance` first — Android's getter falls back to the network itself),
  `extrinsicClientInitializeTransaction` returns `""` on failure (no throw), and the
  `requiresVca`/`autoSent` result is a Swift enum (`PendingTxResult`)
- [x] displays and handles the VCA pinpad: `prepareCoinTransfer(coinTypeIdx:)` arms it
  (`navigateToPinpad = true` + `pendingCircuitsPackage`), the overlay presents the REAL
  `TxPinpadScreen(circuits:sdk:onTxDone:)` (Metal/WGPU renderer) — same `PinpadContent` pattern
  as the reference app's `TabBarView.swift`; tx actually broadcasting is NOT the goal, testing
  the pad is (hash handling + `showTxFailed` documented, mirroring the [pinpad guide](developers/SDK/ios/pinpad.md))
- [x] screenshot placeholders added (2, in `What it should look like`) + listed below
- [x] the Android hidden Step 6's code comment that pointed at the OLD iOS step updated
  ("the iOS equivalent lives in the iOS guide's hidden Step 6")
- [x] BUILD confirmed on the tart VM (`test-run-02`, Xcode 27.1 / Swift 6.4,
  `xcodebuild … -destination 'platform=iOS Simulator,name=iPhone 17e' build`) → **BUILD SUCCEEDED**
  with the EXACT docs file content (md5 match). One compile error found & fixed during that
  build: the first draft showed the toast via `if let toastText { ToastView(…: Binding(get:set:))
  }` — inside the `if let` the `@State` property is SHADOWED by an immutable local, and the
  Binding's escaping `set` closure failed with "'toastText' is a 'let' constant" /
  "nil cannot be assigned to type String" (a swift-frontend assertion crash on top). Fix:
  SEPARATE `showToast: Bool` + `toastText: String` @State vars + a `presentToast(_:)` helper,
  and a WARNING comment in the code so nobody reintroduces the optional-binding shadowing.

## Screenshot placeholders (to be replaced with real captures)

All placeholders are visible blockquotes in the pages (`📷 [SCREENSHOT PLACEHOLDER] — …`).

1. `developers/SDK/ios/getting-started.md` hidden Step 6 — `static/img/ios_full_basic_app.png`:
   the all-in-one "full basic app" in the iOS Simulator (SOL address + "Send test transaction" button)
2. `developers/SDK/ios/getting-started.md` hidden Step 6 — `static/img/ios_pinpad_full.png`:
   the real VCA pinpad (`TxPinpadScreen`) rendered full-screen by the Metal renderer

