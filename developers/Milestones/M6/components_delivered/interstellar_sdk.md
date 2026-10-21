---
sidebar_label: 'Interstellar SDK'
sidebar_position: 1
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";

# Interstellar SDK — Integration Delivered in Milestone 6

## Overview

Milestone 6 delivers the **first version of the (semi) public Interstellar SDK** for Android and iOS: the mobile wallet technology — secure accounts, policy-gated signing with VCA/PoHI, and secure recovery — packaged as a component that **third-party wallet providers and dApps can embed in their own mobile apps**.

This delivery covers three inseparable parts:

1. **The SDK itself** — the `InterstellarSdk` public API on Android (Kotlin, `gg.interstellar.wallet`) and iOS (Swift, `InterstellarSdk`), both speaking the **same uniffi FFI surface** to the shared Rust core (Android via committed uniffi-Kotlin bindings; iOS via uniffi-Swift bindings). The two platforms expose the **same function names**, so an app ports from one to the other without renaming anything.
2. **The documentation** — a complete public API reference (every public member documented) plus per-platform pinpad/VCA integration guides.
3. **The integration guide** — per-platform getting-started walkthroughs that start from a fresh app in Android Studio / Xcode and end with a screen displaying the **root account ID**.

The wallet application shipped for this milestone is the **reference integration** of that SDK: every documented feature is exercised by the app on both platforms.

## Documentation map

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Deliverable part</TableCell>
      <TableCell>Where</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>SDK overview, architecture and scope</TableCell>
      <TableCell><a href="/developers/SDK/intro">Interstellar SDK — Overview</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Android — integration overview &amp; entry point</TableCell>
      <TableCell><a href="/developers/SDK/android/index">Android SDK — Overview &amp; Integration</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Android — full public API reference</TableCell>
      <TableCell><a href="/developers/SDK/android/api-reference">Android SDK — API Reference</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Android — VCA pinpad integration</TableCell>
      <TableCell><a href="/developers/SDK/android/pinpad">Android — VCA Pinpad Integration</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS — integration overview &amp; entry point</TableCell>
      <TableCell><a href="/developers/SDK/ios/index">iOS SDK — Overview &amp; Integration</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS — full public API reference</TableCell>
      <TableCell><a href="/developers/SDK/ios/api-reference">iOS SDK — API Reference</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS — VCA pinpad integration</TableCell>
      <TableCell><a href="/developers/SDK/ios/pinpad">iOS — VCA Pinpad Integration</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Getting started — Android (fresh app → root account ID screen)</TableCell>
      <TableCell><a href="/developers/SDK/android/getting-started">Android — Getting Started</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Getting started — iOS (fresh app → root account ID screen)</TableCell>
      <TableCell><a href="/developers/SDK/ios/getting-started">iOS — Getting Started</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>iOS port — the wallet app &amp; the iOS SDK</TableCell>
      <TableCell><a href="/developers/Milestones/M6/components_delivered/ios_port">iOS Port</a></TableCell>
    </TableRow>
    <TableRow>
      <TableCell>App distribution — Android (Firebase) &amp; iOS (ipa / TestFlight)</TableCell>
      <TableCell><a href="/developers/Milestones/M6/components_delivered/app_distribution">App Distribution</a></TableCell>
    </TableRow>
  </TableBody>
</Table>

## What the SDK exposes

- **One entry point per platform** (`InterstellarSdk.create(...)`), producing a fully initialized, registered SDK — no half-initialized state possible.
- **Accounts**: root account ID + per-coin client accounts (DOT/SOL/BTC/ETH) with deposit addresses and prefixed display forms.
- **Balances**: per-coin and total-USD cached views, refresh APIs with server-reset detection.
- **Transactions**: initialization, pending-tx inspection (VCA-required vs auto-sent), pinpad-validated transfer, broadcasted tx hash retrieval, and non-VCA message signing.
- **Recovery**: NFC and VCA-token methods, threshold configuration, vouch → ~10-block delay → claim flow.
- **Airdrop campaigns**: organizer (create/fund) and user (register/claim, VCA-protected) flows.
- **MoonPay URL signing** for on/off-ramp integrations.

The pinpad/VCA orchestration is **SDK-owned**: the host app only renders the provided pad view when `navigateToPinpad` fires and keys its "transaction failed" UI on the SDK's explicit `showTxFailed` flag — the full contract is documented in the pinpad guides above.

## Scope & status

:::note
The SDK is delivered as a **technical preview** on top of the private `wallet-app-internal` repository, pending the final-testnet open-sourcing. It is **not public at this time**: reviewers/integrators get **read access to that repository**, and the SDK is published from it as a **private artifact** — a **Maven package on GitHub Packages** (Android, roadmap [#230](https://github.com/Interstellar-Network/roadmap/issues/230)) and a **GitHub Release asset** (iOS, roadmap [#231](https://github.com/Interstellar-Network/roadmap/issues/231)). Both publishing pipelines are implemented and CI-tested; the artifacts are attached when the M6 release is cut (the version in the guides is the planned one). Public API surface may still evolve; shared testnet endpoints and test keys are provided on request. See the [SDK overview](/developers/SDK/intro#status--scope-please-read) for the complete scope statement.
:::

## See also

- [iOS Port](./ios_port.md) — the iOS wallet app and the iOS SDK.
- [App Distribution — Android & iOS](./app_distribution.md) — how to install the app.

The WalletConnect/Reown interoperability delivered in **M5** remains testable through the same app and flows — see the [M5 documentation](/developers/Milestones/M5/local-demo-with-docker) and the running tutorial in [Local Demo with Docker](../local-demo-with-docker.md).
