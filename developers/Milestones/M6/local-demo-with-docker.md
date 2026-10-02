---
sidebar_label: 'Android App with Local Node'
sidebar_position: 1
---

# Android App with Local Nodes

:::note Milestone 6 Scope


Milestone 6 turns the Interstellar wallet technology into an **integrable component**: it delivers the first version of the (semi) public **Interstellar Android/iOS SDK** together with its **documentation and integration guides**, plus refreshed **containers and wallet-app releases** for testing the whole stack locally.

The WalletConnect/Reown integration delivered in [Milestone 5](../M5/local-demo-with-docker.md) remains fully testable through the same flows (session handling, signing, transaction broadcasting and transaction-hash feedback to the requesting dApp). Its scope and implementation references — the wallet-side Reown integration (wallet-app-internal PR #32), the pallet-side “Sign in with Reown” adaptations (pallets-internal PR #73) and the broadcasted-transaction-hash feedback (pallets-internal PR #72) — are documented in the [M5 tutorial](../M5/local-demo-with-docker.md) and reviewed in the [M5 Review follow-up](../M5/m5-walletconnect-reown-review-follow-up.md).

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

### Step 2: Download the stack config (links for M6)
```bash
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh
```

## 2. Install the Android Demo App

### Download the APK (links for M6)

From the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/containers/releases/tag/testnet-m6) (specific APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices and Apple Silicon(M1/M2/M3/M4)
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

> **Latest version recommended**

::::note
This M6 release includes the fixes from the **M5 external review** follow-up: the critical issues **C1, C2, C3 and C4** plus the additional fixes/improvements **H2** and **M7** — see the [M5 Review follow-up](/developers/Milestones/M5/m5-walletconnect-reown-review-follow-up.md) for the point-by-point remediation.

For **M5 history** (initial release and v2 hotfix), the previous links are kept for transparency:

**Docker compose file (M5 v2):**
```bash
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m5-v2/docker-compose.yml
```
**Previous app download (M5 v2):** https://github.com/Interstellar-Network/containers/releases/tag/testnet-m5-v2
::::

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
This Android application is provided as a technical demonstration of Interstellar’s secure Web3 account infrastructure. It serves as a foundation for the forthcoming Android and iOS SDKs, which are still under active development.  

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
