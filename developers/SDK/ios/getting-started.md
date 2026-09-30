---
sidebar_label: 'Getting Started'
sidebar_position: 1
---

# Getting Started — iOS

This guide creates a **brand-new iOS app** in Xcode, integrates the Interstellar SDK the most basic way, and ends with a single screen showing the **root account ID** — nothing else.

:::note What "basic" means here
One SwiftUI `View`, one `InterstellarSdk.create(...)` call. No pinpad, no balances UI — those are covered by the [API Reference](./api-reference.md) and [pinpad guide](./pinpad.md).
:::

## Prerequisites

| Tool | Version / notes |
| --- | --- |
| macOS | Apple Silicon (M1/M2/M3/M4) |
| Xcode | 15+ |
| Android Studio | needed **once** — the KMP/Gradle toolchain that compiles the shared framework |
| Rust nightly | pinned by the workspace `rust-toolchain.toml` once cloned |
| Rust targets | `rustup target add aarch64-apple-ios aarch64-apple-ios-sim` |
| Xcode `PATH` | Xcode build phases use a minimal `PATH`: `sudo ln -sfn ~/.cargo/bin/cargo /usr/local/bin/cargo && sudo ln -sfn ~/.cargo/bin/rustc /usr/local/bin/rustc` |
| Interstellar stack | the local Docker stack from the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md) (defaults: `wss://127.0.0.1:2090` / `ws://127.0.0.1:9944` / IPFS `5001`) |
| SDK access | `wallet-app-internal` is currently private — **contact us** to get access to the SDK sources/checkout used below |

## Step 1 — Create a fresh project

1. **Xcode → File → New → Project → iOS → App** (Interface: **SwiftUI**, Language: **Swift**).
2. Name it anything (e.g. `MyFirstInterstellarApp`).
3. **Minimum deployment target: iOS 16.0**.

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Xcode "Choose a template" dialog with the iOS App template selected (to be captured)*

## Step 2 — Bring in the SDK

The iOS SDK is a set of Swift sources over two compiled pieces (the KMP `shared` framework and the Rust static libraries) that **Gradle builds for you**. The simplest layout is the one the reference app uses — put your Xcode project **next to** a checkout of `wallet-app-internal`:

```
workspace/
├── MyFirstInterstellarApp/          ← your Xcode project
│   ├── MyFirstInterstellarApp.xcodeproj
│   └── MyFirstInterstellarApp/      ← sources (ContentView.swift …)
└── wallet-app-internal/             ← cloned from the private repo (contact us)
    ├── shared/                      ← KMP module + Rust sources (built by Gradle)
    ├── iosApp/InterstellarSdk/      ← the iOS SDK Swift sources (copied in step 3)
    ├── Cargo.toml                   ← Rust workspace (built for iOS by the Gradle task)
    └── …
```

Clone it once:

```bash
cd workspace
git clone ssh://git@github.com/Interstellar-Network/wallet-app-internal.git
```

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Finder/Xcode showing your project and the sibling `wallet-app-internal` checkout (to be captured)*

:::info One-time Gradle warm-up
Open `wallet-app-internal` in Android Studio **once** (or run `./gradlew` in it) so Gradle syncs and caches the toolchain. Also set Xcode's `JAVA_HOME` build setting later if prompted (typically `/Applications/Android Studio.app/Contents/jbr/Contents/Home`).
:::

## Step 3 — Add the SDK sources to your app

From `wallet-app-internal/iosApp/InterstellarSdk/`, copy into your app target:

| File(s) | Role |
| --- | --- |
| `InterstellarSdk.swift` | the public SDK API ([reference](./api-reference.md)) |
| `MobileKeychainSigner.swift` | the P-256 Keychain signer |
| `Generated/` (whole folder) | uniffi-generated bindings + C header + modulemap |
| `HeaderRustWrapper.h` | bridging header (uniffi FFI + renderer C FFI) |

You do **not** need `CircuitSurfaceView.swift`, `PinpadView.swift`, `TxPinpadScreen.swift` or `CurrencyMath.swift` for this hello-world (the pinpad files come later, from the [pinpad guide](./pinpad.md)).

In Xcode: **File → Add Files to "MyFirstInterstellarApp"…** → select the copied files, check your app target.

## Step 4 — Wire the build

Add a **Run Script build phase** (target → Build Phases → ＋ → New Run Script Phase), placed **before** "Compile Sources" — it builds the KMP framework + Rust static libraries:

```sh
PATH=$HOME/.cargo/bin:$PATH
cd "$SRCROOT/../wallet-app-internal"
cargo --version
rustc --version
./gradlew --info :shared:embedAndSignAppleFrameworkForXcode
```

Then in **Build Settings** of your app target (mirror of the reference app):

| Setting | Value |
| --- | --- |
| `FRAMEWORK_SEARCH_PATHS` | `$(SRCROOT)/../wallet-app-internal/shared/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)` |
| `LIBRARY_SEARCH_PATHS[sdk=*]` | `$(SRCROOT)/../wallet-app-internal/target/aarch64-apple-ios/$(CONFIGURATION)/` |
| `LIBRARY_SEARCH_PATHS[sdk=iphonesimulator*]` | `$(SRCROOT)/../wallet-app-internal/target/aarch64-apple-ios-sim/$(CONFIGURATION)/` |
| `OTHER_LDFLAGS` | `-framework shared -lsubstrate_client -lrenderer` |
| `SWIFT_INCLUDE_PATHS` | `$(SRCROOT)/…/path to the copied Generated folder` |
| `SWIFT_OBJC_BRIDGING_HEADER` | `$(PROJECT_DIR)/…/path to HeaderRustWrapper.h` |
| `JAVA_HOME` | `/Applications/Android Studio.app/Contents/jbr/Contents/Home` |

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Xcode Build Settings inspector showing FRAMEWORK_SEARCH_PATHS / LIBRARY_SEARCH_PATHS / OTHER_LDFLAGS (to be captured)*

:::info
`embeddedAndSignAppleFrameworkForXcode` transitively builds the Rust static libs (`libsubstrate_client.a`, `librenderer.a`) for the selected iOS destination, then the linker flags above pull them in. First build takes several minutes; later builds are incremental.
:::

## Step 5 — Initialize the SDK and show the root account ID

Replace `ContentView.swift` with:

```swift
import SwiftUI

struct ContentView: View {
    @State private var rootAccountHex: String?
    @State private var errorText: String?

    var body: some View {
        VStack(spacing: 12) {
            if let rootAccountHex {
                Text("Root account ID:").font(.headline)
                Text(rootAccountHex)
                    .font(.system(.footnote, design: .monospaced))
                    .textSelection(.enabled)
            } else if let errorText {
                Text("SDK init failed: \(errorText)").foregroundColor(.red)
            } else {
                ProgressView("Initializing Interstellar SDK…")
            }
        }
        .padding()
        .task {
            do {
                let sdk = try await InterstellarSdk.create(onServerResetDetected: {
                    // Server reset detected: returning here lets the SDK re-register.
                    // A real app shows a blocking confirmation dialog first.
                })
                let rootData = await sdk.getRootAccount()
                rootAccountHex = rootData.map { String(format: "%02hhx", $0) }.joined()
            } catch {
                errorText = error.localizedDescription
            }
        }
    }
}

#Preview {
    ContentView()
}
```

What happens on first launch:

1. `create` generates a P-256 key in the **iOS Keychain**,
2. registers the device/account on the Interstellar worker,
3. caches balances and the root account,
4. `getRootAccount()` returns the **32-byte root account id**, displayed in hex.

:::warning Keystore persistence
The Keychain key is **NOT deleted when the app is uninstalled** — reinstalling keeps the same identity and root account. Delete the app's Keychain item or call `resetKeyPairAndRegister()` for a fresh identity (see [Overview](./index.md)).
:::

## Step 6 — Run it against the local stack

1. Start the Docker stack (node `9944`, worker `2090`, IPFS `5001`) — see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md).
2. Pick an **iOS Simulator** and **Run ▶** — simulators reach host `127.0.0.1` ports natively (no `adb reverse` needed).

> 📷 **[SCREENSHOT PLACEHOLDER]** — *iOS Simulator running the hello-world app, screen showing "Root account ID:" followed by the 64-char hex id (to be captured)*

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `library not found for -lsubstrate_client` | the Run Script phase didn't build the Rust libs — check its log; ensure the rust targets are installed and `cargo` is on Xcode's `PATH` (symlinks above) |
| `No such module 'shared'` | check `FRAMEWORK_SEARCH_PATHS`; run the Gradle task manually once to confirm `shared/build/xcode-frameworks/…` exists |
| Gradle/JAVA_HOME errors in the Run Script phase | set `JAVA_HOME` in Build Settings (see [SDK overview](./index.md#framework-integration)) |
| App stuck on "Initializing…" | the local stack isn't reachable — check Docker is up and the URLs match |
| Init throws `Keychain init failed` | rare Keychain entitlement issue on device — try the simulator first, then check signing team/entitlements |

Next: [**API Reference**](./api-reference.md) and the [**VCA pinpad guide**](./pinpad.md).
