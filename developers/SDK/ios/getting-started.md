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
| Xcode | 15+ (the SDK package targets **iOS 17**) |
| **Rust / KMP / Gradle / linker flags** | **not needed** — the published package ships the compiled frameworks |
| Interstellar stack | the local Docker stack from the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md) (defaults: `wss://127.0.0.1:2090` / `ws://127.0.0.1:9944` / IPFS `5001`) |
| SDK access | read access to the private [`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) repo — the SDK is published as an asset of its **private** release (see [SDK access](../intro.md#status--scope-please-read)) |

## Step 1 — Create a fresh project

1. **Xcode → File → New → Project → iOS → App** (Interface: **SwiftUI**, Language: **Swift**).
2. Name it anything (e.g. `MyFirstInterstellarApp`).
3. **Minimum deployment target: iOS 17.0** (the SDK package declares `platforms: [.iOS(.v17)]`).

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Xcode "Choose a template" dialog with the iOS App template selected (to be captured)*

## Step 2 — Download the SDK

The iOS SDK is published as a **ready-to-use Swift package**: one zip, `InterstellarSdk-0.1.0.zip`, that contains the whole package (the Swift sources, the uniffi bindings and the two `.xcframework`s).

Because the repository is private, the release is private too: the download needs your repository access.

**In the browser** — open the release and download the asset:
[github.com/Interstellar-Network/wallet-app-internal/releases/tag/v0.1.0](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/v0.1.0)

**Or with the GitHub CLI** (handy if you already have a token with `repo` scope):

```bash
gh release download v0.1.0 \
  --repo Interstellar-Network/wallet-app-internal \
  --pattern "InterstellarSdk-*.zip"
unzip InterstellarSdk-0.1.0.zip
```

You now have a single folder, `InterstellarSdk/`, that looks like this:

```
InterstellarSdk/
├── Package.swift                    ← ready to use (nothing to edit)
├── README.md
├── substrate_clientFFI.xcframework/ ← the uniffi FFI of the Rust substrate-client
├── rendererFFI.xcframework/         ← the C FFI of the Rust renderer (Bevy/Metal)
└── Sources/InterstellarSdk/         ← the SDK layer + the pre-generated uniffi bindings
```

## Step 3 — Add the package to your project

1. In Xcode: **File → Add Package Dependencies… → Add Local…**
2. Pick the unzipped **`InterstellarSdk`** folder (the one containing `Package.swift`).
3. Add the `InterstellarSdk` library to your app target (**Add Product** in the dialog, or *Frameworks, Libraries, and Embedded Content* in the target's *General* tab).

That is the whole installation: Xcode **links and embeds** the two dynamic frameworks by itself — there is **no** "Embed & Sign" build phase, **no** bridging header and **no** linker flag to add.

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Xcode "Add Package Dependencies… > Add Local…" dialog with the unzipped InterstellarSdk folder selected (to be captured)*

:::info Alternatively: the remote `.binaryTarget` form
The release also publishes the two frameworks individually (with their SPM checksums) if you prefer a remote package over a local one — see [SDK access](../intro.md#status--scope-please-read).
:::

## Step 4 — Initialize the SDK and show the root account ID

Replace `ContentView.swift` with:

```swift
import SwiftUI
import InterstellarSdk

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
                let rootData = await sdk.getterRootAccount()
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
4. `getterRootAccount()` returns the **32-byte root account id**, displayed in hex.

:::warning Keystore persistence
The Keychain key is **NOT deleted when the app is uninstalled** — reinstalling keeps the same identity and root account. Delete the app's Keychain item or call `resetKeyPairAndRegister()` for a fresh identity (see [Overview](./index.md)).
:::

## Step 5 — Run it against the local stack

1. Start the Docker stack (node `9944`, worker `2090`, IPFS `5001`) — see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md).
2. Pick an **iOS Simulator** and **Run ▶** — simulators reach host `127.0.0.1` ports natively (no `adb reverse` needed).

> 📷 **[SCREENSHOT PLACEHOLDER]** — *iOS Simulator running the hello-world app, screen showing "Root account ID:" followed by the 64-char hex id (to be captured)*

## Alternative — build the SDK from source

The reference wallet app builds the SDK from source instead of consuming the published package. If you need to patch the SDK (or read its internals), check out the repository and follow `iosSdk/README.md` — the package then needs the Rust libraries to be built first:

```bash
./iosApp/scripts/publish-ios-sdk.sh --version 0.1.0 --no-publish
```

The app target then links the Rust static libraries through a **Run Script** build phase (`:shared:embedAndSignAppleFrameworkForXcode`) plus the `FRAMEWORK_SEARCH_PATHS` / `LIBRARY_SEARCH_PATHS` / `OTHER_LDFLAGS` build settings — that is the "heavy" path the published package exists to avoid.

:::note
The iOS SDK is **arm64 only** (the device slice and the arm64 simulator slice). On an Apple Silicon Mac the simulator is arm64 by default; on an Intel Mac set `EXCLUDED_ARCHS[sdk=iphonesimulator*] = x86_64` in your app target.
:::

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `no such module 'InterstellarSdk'` | the package was not added to the **target** (not only to the project) — check *Frameworks, Libraries, and Embedded Content* |
| `Failed to build the package` / "binary target … could not be found" | you added the **zip** instead of the unzipped folder — point Xcode at the `InterstellarSdk/` directory that contains `Package.swift` |
| The app links but crashes on launch with a missing symbol | the frameworks were not embedded — make sure the SDK product is set to **Embed & Sign** in *Frameworks, Libraries, and Embedded Content* |
| App stuck on "Initializing…" | the local stack isn't reachable — check Docker is up and the URLs match |
| Init throws `Keychain init failed` | rare Keychain entitlement issue on device — try the simulator first, then check signing team/entitlements |
| "save to files" opens a **white window** instead of the file explorer | a transient Simulator issue: *Device → Erase All Content and Settings*, then reinstall the app — see [Overview](./index.md) |

Next: [**API Reference**](./api-reference.md) and the [**VCA pinpad guide**](./pinpad.md).
