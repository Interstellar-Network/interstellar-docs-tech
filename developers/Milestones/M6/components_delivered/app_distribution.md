---
sidebar_label: 'App Distribution'
sidebar_position: 2
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";

# App Distribution — Android & iOS

## Overview

Milestone 6 also delivers the **distribution channels** of the wallet app: a reviewer or tester
must be able to **install** the app and exercise the flows of the
[local demo](../local-demo-with-docker.md) **without building it from source**.

:::info Two repositories, two kinds of artifacts
- the **stack** (the `docker-compose.yml`, the IPFS init script) is released in
  [`Interstellar-Network/containers`](https://github.com/Interstellar-Network/containers/releases);
- the **app artifacts** (the Android APK, the iOS `.app`) and the **SDK package** (the Swift
  package zip) are released in
  [`Interstellar-Network/wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal/releases),
  under the [`m6-v1` tag](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1).
:::

:::warning The **same** build on every channel — and it needs the **local** stack
The APK you get from the **GitHub release**, from **Firebase App Distribution** or the `.ipa`
you get from **TestFlight** (or from the direct download) are **the very same builds**: they
are configured for the **local dev stack** (`wss://127.0.0.1:2090`, `ws://127.0.0.1:9944`, IPFS
`127.0.0.1:5001`), **not** for a hosted testnet.

So the **local stack must be running** before you can use any of them (see the
[local demo](../local-demo-with-docker.md#1-launch-the-interstellar-stack)), and on Android the
three ports must be exposed to the device/emulator (`adb reverse tcp:2090 tcp:2090`, …). An iOS
Simulator reaches `127.0.0.1` natively.
:::

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Platform</TableCell>
      <TableCell>Channel</TableCell>
      <TableCell>Target</TableCell>
      <TableCell>Status</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Android</TableCell>
      <TableCell>GitHub release (<code>m6-v1</code>)</TableCell>
      <TableCell>Emulator (x86_64) &amp; devices (arm64)</TableCell>
      <TableCell>the tag exists, the assets are added at the release</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Android</TableCell>
      <TableCell>Firebase App Distribution</TableCell>
      <TableCell>Emulator &amp; devices</TableCell>
      <TableCell>the group exists, the builds are added at the release</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS</TableCell>
      <TableCell>Direct <code>.ipa</code> download</TableCell>
      <TableCell><strong>Simulator</strong> (TestFlight does not deliver to simulators)</TableCell>
      <TableCell>the tag exists, the assets are added at the release</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS</TableCell>
      <TableCell>TestFlight (App Store Connect)</TableCell>
      <TableCell>Real devices</TableCell>
      <TableCell>the group exists, the builds are added at the release</TableCell>
    </TableRow>
  </TableBody>
</Table>


## Android — Firebase App Distribution

The Android app is distributed through
[Firebase App Distribution](https://firebase.google.com/docs/app-distribution/android/distribute-gradle),
the official channel for handing a build to a group of testers without going through the
Play Store.

### Get access to the testing group

The tester group is a **Firebase tester group**: ask Interstellar to add you, or request access
through the tester-group link:

[appdistribution.firebase.dev/i/71f8c7de02bcbcdc](https://appdistribution.firebase.dev/i/71f8c7de02bcbcdc)

Once you are in the group, the app is installed **straight from the browser** (the Firebase
tester page) or from the **Firebase tester app** on the device — no adb, no sideloading.

The official documentation is the reference for the whole flow:
[distribute-gradle](https://firebase.google.com/docs/app-distribution/android/distribute-gradle).

:::note The other Android channel
The same build is also published directly as an APK
there [`m6-v1` release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1)
— see the [local demo](../local-demo-with-docker.md#2-install-the-android-demo-app).

This is mostly useful if you want to test using an Emulator and want to avoid the whole Google signin there.
:::

## iOS — a direct `.app` (simulator) **and** TestFlight (real devices)

iOS does **not** use Firebase: the app is built with `xcodebuild archive`, exported and uploaded
to **App Store Connect**, where the build shows up in **TestFlight**.

:::info Why two channels?
**TestFlight only delivers to real devices** — Apple does not distribute simulator builds
through it. So the M6 release offers both:

- a **direct `.app` download** for the **iOS Simulator** (the build compiles the Rust libraries
  for the simulator slice, so the app runs locally — exactly like the Android APK in the
  emulator);
- **TestFlight** for the **real devices** (signed and distributed by Apple).
:::

### For the testers

| What you want | Channel | What you do |
| --- | --- | --- |
| Run the app in the **Simulator** | direct `.app` download | download the zipped `.app` from the [`m6-v1` release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1) eg "iosApp-Simulator.app.zip", unzip it, then in Xcode *Device > Install Simulated Package…* (or `xcrun simctl install booted <app>.app`) |
| Run the app on a **real device** | **TestFlight** | install the **TestFlight** app, accept the invitation, then install the build |

:::note Before you can install anything
A **TestFlight** build needs an **Apple Developer Program** membership (a free personal team
cannot upload to TestFlight). The internal tester groups (up to 100 App Store Connect users)
need no beta review; the external ones (up to 10.000 testers) do.
:::

Official documentation:
[upload builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/) ·
[distributing for beta testing](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases).

## See also

- [Local Demo with Docker](../local-demo-with-docker.md) — run the stack and drive the app.
- [Interstellar SDK — Integration Delivered in Milestone 6](./interstellar_sdk.md) — the SDK itself.
- [iOS Port](./ios_port.md) — the iOS app and the iOS SDK.
