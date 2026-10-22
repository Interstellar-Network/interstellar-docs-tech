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
| Xcode | 15+ (the SDK package targets **iOS 17**) — see [Step 0](#step-0--install-xcode-and-a-simulator) |
| **Rust / KMP / Gradle / linker flags** | **not needed** — the published package ships the compiled frameworks |
| Interstellar stack | the local Docker stack from the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md) (defaults: `wss://127.0.0.1:2090` / `ws://127.0.0.1:9944` / IPFS `5001`) |
| SDK access | read access to the private [`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) repo — the SDK is published as an asset of its **private** release (see [SDK access](../intro.md#status--scope-please-read)) |

## Step 0 — Install Xcode and a Simulator

:::warning Step 0 has not been tested end-to-end
The steps below describe a fresh-machine setup. The subsequent steps (creating the project, adding the SDK, running the app) have been tested on a VM based on the image [`ghcr.io/cirruslabs/macos-tahoe-xcode:latest`](https://github.com/cirruslabs/macos-image-templates), which itself is based on the [macOS 26 image from `actions/runner-images`](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-Readme.md). That image ships **many dependencies pre-built**, so your mileage on a clean Mac may vary (the commands and links below are the canonical way).
:::

The Android guide starts from "install Android Studio + the SDK"; the iOS equivalent is **Xcode + a simulator runtime**.

### 0.1 — Install Xcode

1. Open the **Mac App Store** and install [Xcode](https://apps.apple.com/us/app/xcode/id497799835) (or download it from the [Apple Developer website](https://developer.apple.com/xcode/) — the App Store build is the one that keeps itself up to date).
2. Launch it once. Xcode asks to **install additional components** (the platform support files) — accept, and let it finish (it is a large download).
3. If you skipped the prompt, add them later from *Xcode → Settings → Components* — cf [Downloading and installing additional Xcode components](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components).

:::note Check the command line tools
`xcode-select --install` installs the (smaller) **command line tools** — useful for `xcrun simctl`, but **not** a replacement for the full Xcode: you need the full IDE to create the project, and the **simulator runtime** below.
:::

### 0.2 — Install a Simulator runtime

A **simulator runtime** (the iOS OS itself) is a separate, large download:

- *Xcode → Settings → **Components** → **Platforms*** → pick the iOS version (17 or later) and download it; or
- let Xcode prompt you when you pick a run destination for the first time.

### 0.3 — Create a simulator device

1. *Xcode → Window → **Devices and Simulators*** (or the **Device Hub** in Xcode 16+) → the **Simulators** tab.
2. **＋** → pick a device type (e.g. *iPhone 16*) and the iOS runtime you installed → **Create**.

You can also do it from the command line:

```bash
xcrun simctl list devices available     # what is already there
xcrun simctl create "iPhone 16" com.apple.CoreSimulator.SimRuntime.iOS-17-0
```

### 0.4 — Sanity check

```bash
xcodebuild -version        # the Xcode version
xcodebuild -showsdks       # the installed iOS SDKs
```

:::info Apple Silicon only
The Interstellar iOS SDK is **arm64 only** (the device slice + the arm64 simulator slice). On an
Apple Silicon Mac the simulator is arm64 by default; on an Intel Mac set
`EXCLUDED_ARCHS[sdk=iphonesimulator*] = x86_64` in your app target.
:::

## Step 1 — Create a fresh project

1. **Xcode → File → New → Project** — the *"Choose a template"* dialog opens. Pick the **iOS App** template and click *Next*.

<figure>
  <img src="/img/Xcode_ChooseTemplate.png" alt="Xcode choose a template dialog" width="350"/>
  <figcaption>Select the iOS App template</figcaption>
</figure>

2. On the **template options** screen choose **SwiftUI** as the interface and **Swift** as the language.

<figure>
  <img src="/img/Xcode_iOSAppTemplate.png" alt="Xcode iOS App template options" width="500"/>
  <figcaption>SwiftUI interface, Swift language</figcaption>
</figure>

3. Fill in the **new project form**: Product Name (e.g. `MyFirstInterstellarApp`), Organization Identifier, etc. Set the minimum deployment target to **iOS 17.0** (the SDK package declares `platforms: [.iOS(.v17)]`).

<figure>
  <img src="/img/Xcode_NewProjectForm.png" alt="Xcode new project form" width="500"/>
  <figcaption>Name your project and set the deployment target</figcaption>
</figure>

## Step 2 — Download the SDK

The iOS SDK is published as a **ready-to-use Swift package**: one zip, `InterstellarSdk-<version>.zip`, that contains the whole package (the Swift sources, the uniffi bindings and the two `.xcframework`s).

Because the repository is private, the release is private too: the download needs your repository access.

:::warning ⚠️ The release exists, the asset is not there yet
The publishing pipeline is implemented and CI-tested, but the asset is attached only when the
M6 release is cut — the [`m6-v1` release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1)
exists but is **empty for now**. The version in the file name (`<version>`) is the **planned**
one — ask Interstellar for the current version and for the access to the private repository.
:::

**In the browser** — open the release and download the asset:
[github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1)

**Or with the GitHub CLI** (handy if you already have a token with the `repo` scope):

```bash
gh release download m6-v1 \
  --repo Interstellar-Network/wallet-app-internal \
  --pattern "InterstellarSdk-*.zip"
unzip InterstellarSdk-<version>.zip
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

### Why not a "remote" (hosted) Swift package?

:::note
The release also attaches the two `.xcframework`s **individually**, with their SPM checksums,
so a `.binaryTarget(url:checksum:)` package *could* be written — but for a **private**
repository that path is not worth it:

- **SwiftPM downloads binary targets anonymously.** A private release asset needs
  authentication and SwiftPM has nowhere to put a token, so the resolution simply fails
  (404/403). The usual workarounds (`~/.netrc`, a custom URL scheme) are fragile.
- **Every new build invalidates the checksum.** The checksum lives in `Package.swift`, so
  each SDK release means: upload → recompute the checksum → edit `Package.swift` →
  re-publish. If the checksum does not match, the resolution fails hard.
- The **local** package (download the zip → *Add Local…*) needs none of that: no
  authentication, no checksum, no re-publish loop — Xcode resolves it from the folder on
  disk.

For more details, cf
[Publishing a private Swift package on GitHub with a privately hosted xcframework](https://medium.com/@p.nasirimehr/publishing-a-private-swift-package-on-github-with-a-privately-hosted-xcframework-827b8f515a98).
:::

## Step 3 — Add the package to your project

:::warning Unzip the SDK before importing
Xcode **cannot import the `.zip` directly**. You must **unzip** it first — the **Add Local…** dialog needs a folder that contains `Package.swift`.
:::

1. In Xcode, open **File → Add Package Dependencies…**

<figure>
  <img src="/img/Xcode_AddPackageDependenciesButton.png" alt="Xcode Add Package Dependencies menu item" width="500"/>
  <figcaption>The "Add Package Dependencies…" menu item</figcaption>
</figure>

2. In the dialog, click **Add Local…** — it is **at the bottom** of the dialog.

<figure>
  <img src="/img/Xcode_AddLocalBottom.png" alt="Xcode Add Local button at the bottom of the dialog" width="500"/>
  <figcaption>"Add Local…" is at the bottom</figcaption>
</figure>

3. Pick the unzipped **`InterstellarSdk`** folder (the one containing `Package.swift`). The dialog fills in the package details.

<figure>
  <img src="/img/Xcode_AddPackageLocalSelected.png" alt="Xcode Add Package dialog with the InterstellarSdk folder selected" width="500"/>
  <figcaption>The InterstellarSdk folder is selected</figcaption>
</figure>

4. Click **Add Package** to confirm. Xcode resolves the package.

<figure>
  <img src="/img/Xcode_AddPackageProgressPopup.png" alt="Xcode package resolution progress popup" width="350"/>
  <figcaption>Resolving the package</figcaption>
</figure>

5. In the **Choose Package Products** dialog, add the `InterstellarSdk` library to your app target and click **Add Package**.

<figure>
  <img src="/img/Xcode_ChoosePackageProducts.png" alt="Xcode Choose Package Products dialog" width="500"/>
  <figcaption>Add the InterstellarSdk library to the app target</figcaption>
</figure>

That is the whole installation: Xcode **links and embeds** the two dynamic frameworks by itself — there is **no** "Embed & Sign" build phase, **no** bridging header and **no** linker flag to add.

## Step 4 — Initialize the SDK and show the root account ID

Replace `ContentView.swift` with:

```swift
import SwiftUI
import InterstellarSdk

struct ContentView: View {
    @State private var rootAccountHex: String = "Initializing..."

    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Account: \(rootAccountHex)")
                .font(.headline)
                .textSelection(.enabled)
        }
        .padding()
        .task {
            do {
                let sdk = try await InterstellarSdk.create(onServerResetDetected: {})
                let rootData = await sdk.getterRootAccount()
                rootAccountHex = rootData.map { String(format: "%02hhx", $0) }.joined()
            } catch {
                rootAccountHex = "Error: \(error.localizedDescription)"
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

:::warning Keystore persistence — **contrary to Android**
The Keychain key is **NOT deleted when the app is uninstalled** — reinstalling keeps the same identity and root account. **On Android the opposite is true**: the key lives in the Android Keystore, which is wiped together with the app, so an uninstall + reinstall gives you a **brand-new** account. Delete the app's Keychain item or call `resetKeyPairAndRegister()` for a fresh identity (see [Overview](./index.md)).
:::

## Step 5 — Run it against the local stack

1. Start the Docker stack (node `9944`, worker `2090`, IPFS `5001`) — see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md).
2. Pick an **iOS Simulator** and **Run ▶** — simulators reach host `127.0.0.1` ports natively (no `adb reverse` needed).

> **What to expect:** While the app starts, watch the **Xcode console** — you will see logs for the connection to the worker, key generation/registration in the Keychain, and the initial balance/account fetches. If everything works, the app shows the **64-character hex root account ID** after about **10–20 seconds**.

![iOS Simulator running the hello-world app, showing the root account ID](/img/ios-simulator-root-account.png)

## Alternative — build the SDK from source

:::warning ⚠️ Not a supported use case at this stage
Building the SDK from source is **not supported** at this stage. It is a complex setup that
requires **many dependencies** to be installed and configured: **Android Studio**, a **JVM**,
**Rust** (nightly), the **Android NDK**, and the full build toolchain. Use the published zip
package as described in [Step 2](#step-2--download-the-sdk) unless you have a specific reason
to build from source.
:::

If you have the `wallet-app-internal` repository checked out, you can consume the SDK **from the
checkout** instead of from the published zip.

### A. Use the local `iosSdk/` package

The SDK is a Swift package in the repository (`iosSdk/`), so you can add **that folder** as a
local Swift package (*File > Add Package Dependencies… > Add Local…* → `wallet-app-internal/iosSdk`).

Its two binary targets point at the **local build outputs**, so the Rust libraries must be built
once first:

```bash
# in the wallet-app-internal checkout
./iosApp/scripts/publish-ios-sdk.sh --version <version> --no-publish
# → iosApp/build/sdk/{substrate_clientFFI,rendererFFI}.xcframework
```

After that, the package resolves like the published one — Xcode links **and embeds** the
frameworks, no linker flags.

### B. Build the SDK into your app target (what the reference app does)

The wallet app does not use the package at all: it compiles the **Rust static libraries** and
links them directly, through a **Run Script** build phase (`:shared:embedAndSignAppleFrameworkForXcode`)
plus the `FRAMEWORK_SEARCH_PATHS` / `LIBRARY_SEARCH_PATHS` / `OTHER_LDFLAGS` build settings —
that is the "heavy" path the published package exists to avoid.

:::tip Which one?
**A** is enough to *patch* the SDK (edit the Swift sources and rebuild). **B** is what the
reference app does — use it only if you need the Rust libraries compiled into your own binary.
:::

:::note
The iOS SDK is **arm64 only** (the device slice and the arm64 simulator slice) — see [Step 0.4](#step-0--install-xcode-and-a-simulator).
:::

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `no such module 'InterstellarSdk'` | the package was not added to the **target** (not only to the project) — check *Frameworks, Libraries, and Embedded Content* |
| `Failed to build the package` / "binary target … could not be found" | you added the **zip** instead of the unzipped folder — point Xcode at the `InterstellarSdk/` directory that contains `Package.swift` |
| The app links but crashes on launch with a missing symbol | the frameworks were not embedded — make sure the SDK product is set to **Embed & Sign** in *Frameworks, Libraries, and Embedded Content* |
| App stuck on "Initializing…" | the local stack isn't reachable — check Docker is up and the URLs match |
| Init throws `Keychain init failed` | rare Keychain entitlement issue on device — try the simulator first, then check signing team/entitlements |
| The QR scanner shows nothing in the Simulator | the iOS Simulator has **no camera** — feed it one with [FauxCam](https://github.com/mkemalgokce/fauxcam) (paste the URI in its **QR** tab), see [the M6 demo notes](../../Milestones/M6/local-demo-with-docker#31--ios-simulator-scanning-the-walletconnect-qr) |
| "save to files" opens a **white window** instead of the file explorer | a transient Simulator issue: *Device → Erase All Content and Settings*, then reinstall the app — see [Overview](./index.md) |

Next: [**API Reference**](./api-reference.md) and the [**VCA pinpad guide**](./pinpad.md).
