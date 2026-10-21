---
sidebar_label: 'Local Demo with Docker'
sidebar_position: 1
---

# Local Demo with Docker — Stack, Demo App & SDK

:::note Milestone 6 Scope


Milestone 6 turns the Interstellar wallet technology into an **integrable component**: it delivers the first version of the (semi) public **Interstellar Android/iOS SDK** together with its **documentation and integration guides**, plus refreshed **containers and wallet-app releases** for testing the whole stack locally.

The WalletConnect/Reown integration delivered in [Milestone 5](../M5/local-demo-with-docker.md) remains fully testable through the same flows (session handling, signing, transaction broadcasting and transaction-hash feedback to the requesting dApp). Its scope and implementation references — the wallet-side Reown integration (wallet-app-internal PR #32), the pallet-side “Sign in with Reown” adaptations (pallets-internal PR #73) and the broadcasted-transaction-hash feedback (pallets-internal PR #72) — are documented in the [M5 tutorial](../M5/local-demo-with-docker.md).

What is **new in M6**:

- the **`InterstellarSdk`** public API on Android and iOS, documented end-to-end in the [**Interstellar SDK section**](/developers/SDK/intro) (every public API explained, including the VCA/pinpad contract and server-reset semantics);
- a **getting-started integration guide** per platform, showing how to embed the SDK into a fresh app from Android Studio / Xcode;
- updated demo website, containers and wallet-app builds aligned with this SDK-first delivery.

Although the system is **not yet production-ready**, it provides a robust foundation. Broader edge case coverage, interoperability and resilience guarantees remain the focus of upcoming milestones. Reviewers are encouraged to **focus on the functional flow and experience** of the key features in this milestone: running the stack locally, driving the wallet app, and integrating the SDK into their own app.
:::

The following guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar Android demo app**.

[Launch Interstellar Stack with android demo app setup](/developers/Milestones/android_app_local_node_launch.md)

This setup enables full offline testing without relying on a hosted VPS.


## 1. Launch the Interstellar Stack 

:::info Two repositories, two kinds of artifacts
The **stack** (the `docker-compose.yml` + the IPFS init script) lives in the
[`containers`](https://github.com/Interstellar-Network/containers) repository; the **app
artifacts** (the APKs, the iOS `.ipa`) and the **SDK package** live in the
[`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) repository,
under the [`m6-v1` tag](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1).
:::

### Step 2: Download the stack config (links for M6)
```bash
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh
```

## 2. Install the Android Demo App

:::warning The **same** build everywhere — and it needs the **local** stack
The APK you get from the **GitHub release**, from **Firebase App Distribution** (below) or the
`.ipa` you get from **TestFlight** (section 2.b) are **the very same builds**: they are
configured for the **local dev stack** (`wss://127.0.0.1:2090`, `ws://127.0.0.1:9944`, IPFS
`127.0.0.1:5001`), **not** for a hosted testnet.

So: **start the stack first** (section 1) and, on Android, expose the three ports to the
device/emulator:

```bash
adb reverse tcp:2090 tcp:2090
adb reverse tcp:9944 tcp:9944
adb reverse tcp:5001 tcp:5001
```

An iOS Simulator reaches `127.0.0.1` natively — no `adb reverse` needed.
:::

### Download the APK (links for M6)

From the official [Interstellar GitHub Release — M6 v1](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1) (specific APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices and Apple Silicon(M1/M2/M3/M4)
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

> **Latest version recommended** — the `m6-v1` release exists but is **empty for now**: the APKs are attached when the M6 release is cut.

### Or: install it from Firebase App Distribution

The Android app is also distributed through
[Firebase App Distribution](https://firebase.google.com/docs/app-distribution/android/distribute-gradle) —
the official channel for handing a build to a group of testers.

**Get access to the testing group** (ask Interstellar to add you, or request access here):

[appdistribution.firebase.dev/i/71f8c7de02bcbcdc](https://appdistribution.firebase.dev/i/71f8c7de02bcbcdc)

:::note
The group exists but is **empty for now** — the builds are attached when the M6 release is cut.
:::

Once you are in the group, the app installs **straight from the browser** (the Firebase tester
page) or from the **Firebase tester app** on the device — no adb, no sideloading.

Full details (and what the maintainer does to publish): [App Distribution — Android & iOS](./components_delivered/app_distribution.md).

## 2.b Install the iOS Demo App

iOS does **not** use Firebase: the app is archived with `xcodebuild`, exported and uploaded to
**App Store Connect**, where it shows up in **TestFlight**. Since **TestFlight only delivers to
real devices**, the M6 release offers **two** channels:

| What you want | Channel | What you do |
| --- | --- | --- |
| Run the app in the **iOS Simulator** | direct `.ipa` download | download the `.ipa` from the [M6 v1 release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1), then in Xcode *Device > Install Simulated Package…* (or `xcrun simctl install <device> <app>.ipa`) |
| Run the app on a **real device** | **TestFlight** | install the **TestFlight** app, accept the invitation, then install the build |

> 📷 **[SCREENSHOT PLACEHOLDER]** — *the iOS simulator running the wallet app (to be captured)*

Full details: [App Distribution — Android & iOS](./components_delivered/app_distribution.md).

::::warning Building the app from source? API keys
The wallet app **builds fine with placeholder/blank API keys** for third-party services such as **MoonPay** and **Reown (WalletConnect)** — but those features **will fail at runtime** until real test keys are provided.

- **Contact us** to get working **test keys** for the shared test environment, then add them to `local.properties` (Android: `moonpay.api.key`, `WALLET_CONNECT_PROJECT_ID`) and/or `Secrets.local.xcconfig` (iOS: `MOONPAY_API_KEY`).
- Alternatively, get your own keys from the [MoonPay dashboard](https://dashboard.moonpay.com/developers) and [Reown](https://lab.reown.com/).
- The prebuilt **M6 release APKs** above already embed working test keys — this note only matters when building from source.
::::


:::info Milestone 6 Scope Clarification

During **Milestone 6**, the primary objective is to deliver the **Interstellar SDK** (Android/iOS) and its integration documentation on top of the M5-proven WalletConnect interoperability. The WalletConnect/Reown flows below are validated exactly as in M5 (not an exhaustive test of the full WalletConnect/Reown feature surface).

Validate the connection to different Dapps through QR code URI, as well as the signing and execution of transactions generated by the Dapps across different chains.

At this stage, the focus is on ensuring correctness and robustness of the transaction pipeline at the infrastructure level — now packaged as a reusable SDK. User-facing aspects such as **application UI/UX**, **visual polish**, or **cosmetic design** are not yet part of the milestone scope. Especially because our focus is the delivery of a mobile SDK.
:::  



---

## 3. Drive the wallet app — WalletConnect tutorial (unchanged from M5)

The **entire WalletConnect walkthrough is identical to M5** — the M6 wallet app ships the same validated flows — so instead of duplicating it here, follow the **M5 tutorial** directly:

| Step | Where |
| --- | --- |
| Tutorial overview & validated scope (Solana Devnet, Ethereum Sepolia, Bitcoin connect-only) | [WalletConnect — Tutorial](/developers/Milestones/M5/local-demo-with-docker#walletconnect--tutorial) |
| Prerequisites (Reown test Dapp, funded accounts) | [Prerequisites](/developers/Milestones/M5/local-demo-with-docker#prerequisites) |
| 1 — Connect to a Dapp (URI / QR) | [Connect to a Dapp](/developers/Milestones/M5/local-demo-with-docker#1--connect-to-a-dapp) |
| 2 — Transactions signing without / with approval (incl. VCA threshold behavior) | [Dapp transactions signing](/developers/Milestones/M5/local-demo-with-docker#2--dapp-transactions-signing-without-approval) |
| 3 — Other Reown Lab Dapps (optional) | [Other reown lab Dapps](/developers/Milestones/M5/local-demo-with-docker#3--other-reown-lab-dapps-not-mandatory-for-the-tests) |
| 4 — Connectivity with production Dapps (Aave, Uniswap, Jupiter) | [Test WalletConnect connectivity with production Dapps](/developers/Milestones/M5/local-demo-with-docker#4--test-walletconnect-connectivity-with-production-dapps) |
| 🛠️ Interpreting logs (connect / below-threshold / VCA flows) | [Interpreting Logs](/developers/Milestones/M5/local-demo-with-docker#%EF%B8%8F-interpreting-logs) |

:::info
The M5 page documents the validated end-to-end reference flow (Ethereum Sepolia with the PoHI / VCA approval screen), the expected reviewer logs, and the funded-account example (0.5 SOL) — all of it applies as-is to the M6 release.
:::

### 3.1 — iOS Simulator: scanning the WalletConnect QR

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

### M6-specific notes while driving the app

**Funding & MoonPay sandbox** — the wallet app integrates **MoonPay** for fiat on/off-ramp. In the sandbox you can "buy" testnet crypto with the play-money balance:

- when using MoonPay in the sandbox, it is **good practice to return the funds** once you are done testing — see [MoonPay: Returning testnet tokens](https://moonpay.readme.io/docs/faq-sandbox-testing#returning-testnet-tokens);
- note this return flow is **only applicable to ETH**, and the return address is **built into the wallet app** — you do not need to configure anything.

**SOL: complete the pinpad quickly** — some coins have a **short-lived "pending tx TTL"**: a prepared SOL transaction is only valid for a short window, so the pinpad should be completed **quickly** (e.g. **SOL < 30s** or so on devnet). If you take too long, the transaction fails — simply re-initiate it.

**Funding the accounts** — use the existing guide: [Fund your wallet (M3 tutorial)](https://interstellar-docs-tech.pages.dev/developers/Milestones/M3/local-demo-with-docker/#step-2-fund-your-wallet).

## Optional: Front-End Access

You can inspect chain state and transactions via:

- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)
- Or your preferred Substrate front-end UI

## Notes

- All services run in Docker containers and use local ports `9944`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs











---
:::note Technical Preview – Foundation for Secure Mobile SDKs  
This Android application is provided as a technical demonstration of Interstellar’s secure Web3 account infrastructure. It is the **reference integration** of the mobile SDKs delivered in Milestone 6 (see the [Interstellar SDK section](/developers/SDK/intro)).

Please note that the current user interface and experience are not representative of the final product. Both UI and UX will be significantly refined to align with Interstellar’s core mission: delivering the highest levels of simplicity and security in mobile self-custody.  
:::


:::info Follow-Up – Selective Docs Exploration

If you've jumped straight into the evaluation, we recommend consulting the **[Milestone 1 documentation](/Milestones/M1/Summary.md)** for key context. It outlines the core architecture, backend logic, and trusted execution flows implemented in this milestone.

The documentation is modular—feel free to explore only the sections most relevant to your review or interest.  
You can also use the **search bar** (top right corner) to locate specific topics quickly. Helpful keywords include:

- `VHDL`, `circuits`, `garbled`, `TEE`, `integritee`,`SE attestation`  
- `NFC`, `VCA`,`recovery`, `threshold`, `trusted UX`  
- `comparison`, `passkey`, `ledger`, `authentication`, `compliance`, `security`, `ATT&CK`

:::
