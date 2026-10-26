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
| SDK access | read access to the private [`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) repo — **the repo that hosts the SDK's release** — the SDK is published as an asset of its **private** release (see [SDK access](../intro.md#status--scope-please-read)) |

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

Why this repository? The SDK package could be distributed from **anywhere** (any release host, any Maven-style registry); for simplicity we chose **GitHub's built-in release mechanism** on the same repository as the SDK sources. GitHub Releases are **scoped to the repository they live on**, and the repo is private → the release (and its asset) is private too, only visible to accounts that have read access to `wallet-app-internal`. The read access is needed **for the release** — being able to read the sources with the same access is a side effect, not the reason.

:::info The release is live
The asset is **published and verified end-to-end**: the [`m6-v1` release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1)
ships the SDK zip, which the CI consumer smoke test downloads, unzips, builds and
**runs in the simulator**. The current version is **`0.1.0`** (`InterstellarSdk-0.1.0.zip`);
new versions follow each SDK release — check the
[releases page](https://github.com/Interstellar-Network/wallet-app-internal/releases) for the
latest and use its zip below.
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

   ::::important Docker stack and Xcode on different machines
   The Simulator reaches host `127.0.0.1` ports **of the machine running Xcode** only. If you run
   the compose stack on a **different machine**, you **MUST handle port forwarding yourself**
   (e.g. `ssh -L` tunnels from the Xcode machine to the stack machine, or any equivalent) so that
   `127.0.0.1:2090/9944/5001` on the Xcode machine actually reach the stack.
   ::::

2. Pick an **iOS Simulator** and **Run ▶** — simulators reach host `127.0.0.1` ports natively (no `adb reverse` needed).

> **What to expect:** While the app starts, watch the **Xcode console** — you will see logs for the connection to the worker, key generation/registration in the Keychain, and the initial balance/account fetches. If everything works, the app shows the **64-character hex root account ID** after about **10–20 seconds**.

![iOS Simulator running the hello-world app, showing the root account ID](/img/ios-simulator-root-account.png)

## Step 6 — *(advanced, NOT supported)* Test the pinpad offline with the internal `ContentView.swift`

:::warning ⚠️ Not an officially supported use case

This hidden step is **NOT an officially supported use case**. The file below is the
**all-in-one offline pinpad test** `ContentView.swift` taken from the **internal**
[`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal/blob/main/ContentView.swift)
repo (repo root). Using it requires **knowledge of the internal file structures** — the
test circuits `.bin` files, the SCALE-encoded `offline_circuits_package.bin` blob format,
how the reference app wires the pinpad, etc. **Do not expect any support if you use it.**

:::

<details>
<summary>▶ Show the hidden step 6</summary>

Replace your hello-world `ContentView.swift` with the file below — it is self-documented:
the Swift code, the full workflow, and the embedded Python generator script that produces
the `offline_circuits_package.bin` blob are all in this single file. Follow the
`WORKFLOW FOR AN LLM / DEVELOPER` comment at the top of the file.

~~~swift title="ContentView.swift" collapse
/*
 * ============================================================================
 * ALL-IN-ONE OFFLINE PINPAD TEST — ContentView.swift
 * ============================================================================
 *
 * This single file contains EVERYTHING needed to test the full VCA pinpad
 * screen offline (no network/IPFS/worker required for the pinpad itself).
 *
 * It is self-contained: the Swift app code + the workflow instructions + the
 * Python generator script that produces the `offline_circuits_package.bin`
 * blob are all in this file.
 *
 * ============================================================================
 * WORKFLOW FOR AN LLM / DEVELOPER
 * ============================================================================
 *
 * STEP 1 — GET THE SOURCE .bin FILES
 *   From the wallet-app-internal repo:
 *     shared/rust/circuit_evaluate/tests/data/display_message_640x360_2digits.garbled.pb.bin  (~15.8 MB)
 *     shared/rust/circuit_evaluate/tests/data/display_pinpad_590x50.garbled.pb.bin            (~4.2 MB)
 *
 * STEP 2 — RUN THE PYTHON GENERATOR (embedded below)
 *   Copy the script between the "BEGIN PYTHON GENERATOR SCRIPT" and "END PYTHON
 *   GENERATOR SCRIPT" markers to a file named `gen_circuits.py`, then run:
 *
 *     python3 gen_circuits.py \
 *       <path>/display_message_640x360_2digits.garbled.pb.bin \
 *       <path>/display_pinpad_590x50.garbled.pb.bin \
 *       offline_circuits_package.bin \
 *       2
 *
 *   Expected output:
 *     Wrote 20027832 bytes to offline_circuits_package.bin
 *       msg: 15855080 bytes, pinpad: 4172674 bytes, nb_digits: 2
 *
 * STEP 3 — PLACE THE OUTPUT IN THE APP SOURCE DIRECTORY
 *   Copy `offline_circuits_package.bin` next to this ContentView.swift.
 *   The Xcode project uses PBXFileSystemSynchronizedRootGroup, so the file is
 *   automatically bundled — no manual "Copy Bundle Resources" step needed.
 *
 * STEP 4 — BUILD AND RUN
 *     xcodebuild -project InterstellarGettingStarted.xcodeproj \
 *       -scheme InterstellarGettingStarted \
 *       -destination "platform=iOS Simulator,name=iPhone 17e" build
 *
 *   The app shows the root account, loads the offline circuits from the
 *   bundle, and auto-triggers the pinpad after 2 seconds. Tap
 *   "Trigger Offline Pinpad Test" to re-trigger it manually.
 *
 * ============================================================================
 * WHAT THE BLOB IS
 * ============================================================================
 *
 * `offline_circuits_package.bin` is a SCALE-encoded
 * `DisplayStrippedCircuitsPackageBuffers` struct (the same wire format the Rust
 * worker uses when it sends a `CircuitsPackage` to the client). It is NOT a
 * protobuf or raw binary.
 *
 * SCALE layout:
 *   [compact_u32 len][message_pgarbled_buf bytes]
 *   [compact_u32 len][pinpad_pgarbled_buf bytes]
 *   [compact_u32 len][message_pgarbled_cid bytes]   (dummy 32-byte zeros)
 *   [compact_u32 len][pinpad_pgarbled_cid bytes]    (dummy 32-byte zeros)
 *   [u32 LE][message_nb_digits]                     (2 for "2digits" circuit)
 *
 * The CIDs are tx identifiers only — dummy zeros are fine for offline
 * rendering. The resulting blob is ~20 MB.
 */

/* ============================================================================
  * BEGIN PYTHON GENERATOR SCRIPT (gen_circuits.py)
  * ============================================================================
 #!/usr/bin/env python3
 """Generate a SCALE-encoded DisplayStrippedCircuitsPackageBuffers blob."""
 import struct
 import sys

 def compact_u32(n):
     """Parity SCALE compact encoding for u32."""
     if n < 64:
         return bytes([n << 2])
     elif n < 16384:
         v = (n << 2) | 0b01
         return struct.pack('<H', v)
     elif n < 2**30:
         v = (n << 2) | 0b10
         return struct.pack('<I', v)
     else:
         # Big-integer mode: first byte lower 2 bits = 0b11,
         # upper 6 bits = number of bytes - 4
         b = n.to_bytes((n.bit_length() + 7) // 8, 'little')
         nb = len(b)
         first = ((nb - 4) << 2) | 0b11
         return bytes([first]) + b

 def read_bin(path):
     with open(path, 'rb') as f:
         return f.read()

 def main():
     msg_path = sys.argv[1]
     pinpad_path = sys.argv[2]
     out_path = sys.argv[3]
     nb_digits = int(sys.argv[4]) if len(sys.argv) > 4 else 2

     msg = read_bin(msg_path)
     pinpad = read_bin(pinpad_path)

     # Dummy CIDs (32 bytes each) - fine for offline rendering
     msg_cid = b'\x00' * 32
     pinpad_cid = b'\x00' * 32

     # Encode DisplayStrippedCircuitsPackageBuffers
     blob = b''
     # 1. message_pgarbled_buf: Vec<u8>
     blob += compact_u32(len(msg)) + msg
     # 2. pinpad_pgarbled_buf: Vec<u8>
     blob += compact_u32(len(pinpad)) + pinpad
     # 3. package: DisplayStrippedCircuitsPackage
     #    a. message_pgarbled_cid: BoundedVec<u8, 64>
     blob += compact_u32(len(msg_cid)) + msg_cid
     #    b. pinpad_pgarbled_cid: BoundedVec<u8, 64>
     blob += compact_u32(len(pinpad_cid)) + pinpad_cid
     #    c. message_nb_digits: u32 LE
     blob += struct.pack('<I', nb_digits)

     with open(out_path, 'wb') as f:
         f.write(blob)

     print(f"Wrote {len(blob)} bytes to {out_path}")
     print(f"  msg: {len(msg)} bytes, pinpad: {len(pinpad)} bytes, nb_digits: {nb_digits}")

 if __name__ == '__main__':
     main()
  * ============================================================================
  * END PYTHON GENERATOR SCRIPT
  * ============================================================================
  */

import InterstellarSdk
import SwiftUI

struct ContentView: View {
    @State private var rootAccountHex: String = "Initializing..."
    @State private var sdk: InterstellarSdk?
    @State private var errorText: String?
    @State private var offlineCircuits: CircuitsPackage?
    @State private var showPinpad = false
    @State private var rendererKey = 0
    @State private var autoTriggered = false

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)

            Text("Account: \(rootAccountHex)")
                .font(.headline)
                .textSelection(.enabled)

            if let errorText {
                Text("Error: \(errorText)")
                    .foregroundColor(.red)
                    .font(.caption)
            }

            Button("Trigger Offline Pinpad Test") {
                Task { await triggerOfflinePinpad() }
            }
            .disabled(sdk == nil)
        }
        .padding()
        // Use fullScreenCover driven by a local @State boolean, mirroring the
        // reference app's `.fullScreenCover(isPresented: $viewModel.navigateToPinpad)`.
        // The parent view does NOT observe the SDK, so checking sdk.navigateToPinpad
        // directly in .overlay would never re-evaluate when the SDK mutates it.
        .fullScreenCover(isPresented: $showPinpad, onDismiss: {
            rendererKey += 1
        }) {
            if let sdk {
                PinpadOverlay(sdk: sdk, rendererKey: rendererKey)
            }
        }
        .task {
            // Load the hardcoded offline circuits from the app bundle.
            // This blob is a SCALE-encoded DisplayStrippedCircuitsPackageBuffers
            // generated from the Rust desktop_offline example's .bin files.
            if let url = Bundle.main.url(forResource: "offline_circuits_package", withExtension: "bin"),
               let blobData = try? Data(contentsOf: url)
            {
                offlineCircuits = CircuitsPackage(
                    circuitsPackage: blobData,
                    txId: Data(repeating: 0, count: 32),
                    nbMessageDigits: 2
                )
                print("[ContentView] Loaded offline circuits: \(blobData.count) bytes")
            } else {
                print("[ContentView] WARNING: offline_circuits_package.bin not found in bundle")
            }

            do {
                let newSdk = try await InterstellarSdk.create(onServerResetDetected: {})
                sdk = newSdk
                let rootData = await newSdk.getterRootAccount()
                rootAccountHex = rootData.map { String(format: "%02hhx", $0) }.joined()
                print("[ContentView] SDK ready, root account loaded")

                // Auto-trigger the offline pinpad after a short delay so the
                // full pinpad screen appears without a manual tap.
                if !autoTriggered, offlineCircuits != nil {
                    autoTriggered = true
                    try? await Task.sleep(nanoseconds: 2_000_000_000)
                    print("[ContentView] Auto-triggering offline pinpad")
                    await triggerOfflinePinpad()
                }
            } catch {
                rootAccountHex = "Error"
                errorText = error.localizedDescription
                print("[ContentView] SDK init failed: \(error.localizedDescription)")
            }
        }
    }

    private func triggerOfflinePinpad() async {
        guard let sdk, let offlineCircuits else {
            print("[ContentView] Cannot trigger pinpad: sdk or offlineCircuits is nil")
            return
        }
        print("[ContentView] Injecting offline circuits into SDK state")
        await MainActor.run {
            sdk.pendingCircuitsPackage = offlineCircuits
            sdk.navigateToPinpad = true
            showPinpad = true
        }
    }
}

/// Overlay shown when the SDK has armed the pinpad.
struct PinpadOverlay: View {
    @ObservedObject var sdk: InterstellarSdk
    let rendererKey: Int

    var body: some View {
        ZStack {
            Color.black.opacity(0.9).ignoresSafeArea()

            if let circuits = sdk.pendingCircuitsPackage {
                TxPinpadScreen(
                    circuits: circuits,
                    sdk: sdk,
                    onTxDone: { hash in
                        if sdk.showTxFailed {
                            // Coin transfer rejected
                        } else if let hash {
                            // Coin transfer accepted — `hash` is the tx hash
                            _ = hash
                        }
                        // SDK clears navigateToPinpad/pendingCircuitsPackage
                    }
                )
                .id(rendererKey)
            } else {
                VStack {
                    Spacer()
                    ProgressView()
                        .tint(.white)
                    Text("Preparing Transaction...")
                        .foregroundColor(.white)
                        .padding(.top, 8)
                    Spacer()
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
~~~

### What it should look like

![iOS Simulator running the offline pinpad test, showing the root account and the trigger button](/img/ios-offline-pinpad-test.png)

</details>

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
