---
sidebar_label: 'iOS Port'
sidebar_position: 3
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";

# iOS Port — the Wallet App **and** the SDK

## Overview

Milestone 6 delivers the **iOS port** of the Interstellar wallet technology. It is not only the
SDK: the **whole wallet app** exists on iOS, with the same features, the same flows and the same
VCA/pinpad guarantee as on Android.

The port was done in steps, each one a pull request in the `wallet-app-internal` repository:

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>PR</TableCell>
      <TableCell>What it delivered</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>#41</TableCell>
      <TableCell>The iOS <strong>POC app</strong>: the project, the SwiftUI skeleton, the SDK wiring</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#43</TableCell>
      <TableCell>The <strong>deployment target</strong> bump</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#44</TableCell>
      <TableCell>Port of the Android <strong>UI/UX</strong>: theme, components, navigation, <strong>all the screens</strong></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#46</TableCell>
      <TableCell><strong>Feature parity</strong>, step 2: the flows the screens drive (transfers, recovery, airdrops…)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#47</TableCell>
      <TableCell>The <strong>MoonPay</strong> (fiat on/off-ramp) integration</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#48</TableCell>
      <TableCell>The <strong>Reown (WalletConnect)</strong> integration</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#49</TableCell>
      <TableCell>The toolchain alignment (NDK r30, Gradle 9.8, AGP 9.4, Kotlin 2.4.21, API 37, minSdk 24, <strong>iOS 17</strong>)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#50</TableCell>
      <TableCell>The <strong>cloud-token recovery</strong> fixes: the token lands on disk, the count is instant, the share escape hatch</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>#53</TableCell>
      <TableCell>The <strong>iOS SDK</strong> published as a Swift package + the <strong>TestFlight</strong> publishing</TableCell>
    </TableRow>
  </TableBody>
</Table>

## The app

The iOS app (`iosApp/`) is a **SwiftUI** application with the same tab structure as the Android
one:

| Tab | What it does |
| --- | --- |
| **Portfolio** | the balances of the supported coins, the per-coin detail screen, the WalletConnect entry point |
| **Send** | the transfer flow (recipient, amount, the VCA confirmation) |
| **Buy/Sell** | the MoonPay fiat on/off-ramp (sandbox) |
| **Airdrop** | the campaign list + the campaign detail (registration & claim) |
| **Backup** | the recovery methods (VCA token / NFC) and the **cloud-token** recovery |
| **Settings** | the server-reset handling, the account identity, the app settings |

:::note Same guarantees, same names
The app is the **reference integration** of the iOS SDK: it consumes the very same
`InterstellarSdk` API that is published to third parties — same function names as Android, so a
flow implemented on one platform maps one-to-one onto the other.
:::

## The SDK

The iOS SDK is the `InterstellarSdk` **Swift package** (`iosSdk/`), published as one ready-to-use
zip (the Swift sources + the two `.xcframework`s). A consumer needs **nothing but Xcode/SPM**:
no Rust, no uniffi, no Kotlin/Native, no linker flags and no "Embed & Sign" phase.

- Full reference: [iOS SDK — Overview & Integration](../../../SDK/ios/index.md) ·
  [API Reference](../../../SDK/ios/api-reference.md) ·
  [VCA Pinpad](../../../SDK/ios/pinpad.md) ·
  [Getting Started](../../../SDK/ios/getting-started.md).

## The device key

The iOS device key is a **P-256 (secp256r1) ECDSA** key stored in the **iOS Keychain**
(`MobileKeychainSigner`) — the counterpart of the Android Keystore key.

:::warning Not the same as Android
**Contrary to Android**, the Keychain key is **NOT deleted when the app is uninstalled**: a
reinstall keeps the same identity and the same root account. On Android the key lives in the
Android Keystore, which is wiped together with the app — an uninstall + reinstall gives a
**brand-new** account.
:::

## The VCA pinpad

The pinpad is rendered by the same **Rust renderer** as on Android, through the
`rendererFFI` framework and the `TxPinpadScreen` SwiftUI view: 12 digit slots + the message bar,
painted with the garbled-circuit pixel stream. The contract is identical on both platforms
(`navigateToPinpad` → render `pendingCircuitsPackage` → `processPinpadInputs` → read
`showTxFailed`) — cf the [iOS pinpad guide](../../../SDK/ios/pinpad.md).

## Running it

The app runs in the **iOS Simulator** (the Rust libraries are compiled for the simulator slice
as well) and on real devices through **TestFlight** (⚠️ pending setup — not available yet,
see [App Distribution — Android & iOS](./app_distribution.md)) and the
[local stack + demo app guide](/developers/Milestones/android_app_local_node_launch).

### Scanning the WalletConnect QR in the Simulator (FauxCam)

The **iOS Simulator has no camera**: any app that opens an `AVCaptureSession` gets nothing, so
the wallet app's QR scanner cannot work in the simulator. (The Android emulator is fine — it has
a virtual camera.)

The workaround is [**FauxCam**](https://github.com/mkemalgokce/fauxcam) — a macOS **menu-bar app**
that feeds a fake camera (a still image, a video, your Mac's webcam or **a QR code you type**)
into the apps running in the simulator.

**Install it**

1. Download the latest `FauxCam.dmg` from the [FauxCam releases](https://github.com/mkemalgokce/fauxcam/releases).
2. Open the DMG, drag **FauxCam.app** into `/Applications`, then launch it.
3. It is a **menu-bar app**: no Dock icon, no main window — click the menu-bar icon to open the viewfinder.

> The upstream README documents the whole feature set (the *Media* / *Camera* / *QR* sources, the `faux` CLI, the requirements): [FauxCamApp — menu-bar app](https://github.com/mkemalgokce/fauxcam#fauxcamapp-menu-bar-app).

**Use it — paste the WalletConnect URI**

1. In the Reown lab Dapp, **copy the WalletConnect URI** (the M5 tutorial, [step 1.2](/developers/Milestones/M5/local-demo-with-docker#step-12--get-the-walletconnect-uri), shows how).
2. In the FauxCam panel, switch to the **QR** tab and **paste the URI** — FauxCam encodes it as a QR code and streams it to the simulator.
3. In the wallet app (on the simulator), open the **QR scanner** (Portfolio or Send → the QR icon at the top left) and point it at the FauxCam viewfinder: the URI is "scanned" and the session starts.

This is the shortest path: **no screenshot of the QR code to take, re-encode and import** — the
URI is copied once and everything else happens inside the simulator.

:::note
The fake camera is injected **when the app launches**, so restart the wallet app (or re-run it
from Xcode) after starting FauxCam. The CLI can do the same in one command:
`faux run <bundle-id> --source qr:<the-walletconnect-uri>`.
:::

:::warning Known issue (transient, Simulator only)
When adding a **cloud-token** recovery, tapping **"save to files"** can show a **white window**
instead of the file explorer. It is a **transient Simulator issue**, **not** a bug of the
Interstellar app: *Device → Erase All Content and Settings*, then reinstall the app.
:::

## See also

- [Interstellar SDK — Integration Delivered in Milestone 6](./interstellar_sdk.md) — the SDK itself.
- [App Distribution — Android & iOS](./app_distribution.md) — how to install the app.
- [Launch the Interstellar Stack with the Demo App](/developers/Milestones/android_app_local_node_launch) — run the stack and drive the app.
