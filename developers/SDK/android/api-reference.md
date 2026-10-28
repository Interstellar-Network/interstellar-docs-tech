---
sidebar_label: 'API Reference'
sidebar_position: 2
---

# Android API Reference

Complete reference of the **public** Android SDK surface (`gg.interstellar.wallet`). All methods live on `InterstellarSdk` unless noted otherwise. `suspend` functions do network work on `Dispatchers.IO` and are safe to call from the main thread. Cached values are marked **[cached]**; live network calls are marked **[network]**.

:::tip Naming
The API mirrors the underlying Rust calls: **`getter…`** functions read state, **`extrinsic…`** functions submit on-chain actions, and **`prepare…`** functions arm a pinpad/VCA flow.
:::

## Observable state

| Member | Type | Description |
| --- | --- | --- |
| `balances` | `StateFlow<WalletBalances>` | **[cached]** per-coin balances in base units (`BigDecimal`). Updated by `updateBalances`/`updateBalance`. |
| `totalBalanceUsd` | `StateFlow<String>` | **[cached]** total portfolio value in USD, 2 decimals (e.g. `"12.34"`). |
| `vcaCount` / `nfcCount` | `StateFlow<Int>` | Number of VCA-token / NFC recovery methods registered **by this device**. |
| `recoveryThreshold` | `StateFlow<Int>` | Configured recovery threshold (default `1`). |
| `recoveryVouchSubmitted` | `StateFlow<Boolean>` | `true` when this device has **vouched** to recover a lost account and is waiting the ~10-block delay before it can `recoveryClaim()`. Persisted across restarts. **Gate your "Claim" button on this**, not on the counts. |
| `pendingCircuitsPackage` | `StateFlow<JniCircuitsPackage?>` | Non-null while a VCA/pinpad flow is armed and its circuits are ready to render. |
| `pendingCampaignId` | `StateFlow<String?>` | Campaign id of the armed airdrop flow (null for other flows). |
| `navigateToPinpad` | `StateFlow<Boolean>` | `true` when the SDK wants your app to **show the pinpad overlay now** (see [Pinpad integration](./pinpad.md)). |
| `showTxFailed` | `StateFlow<Boolean>` | `true` **only** when a *coin-transfer* pinpad input was rejected (wrong code). See the pinpad page — never infer failure from a `null` pinpad result alone. |
| `toastListener` | `SdkToastListener?` | Set this to receive the SDK's toast feedback (always delivered on the main thread). |

### Value objects

- **`WalletBalances(dot, sol, btc, eth: BigDecimal)`** — standard base units (planck/lamport/satoshi/wei). Public DTO: what your UI displays.
- **`enum class CoinType(id: Int)`** — `Dot(0)`, `Sol(1)`, `Btc(2)`, `Eth(3)`. **Ordinal/id is wire-compatible with the Rust core — do not reorder.**
- **`enum class VcaFlowType`** — the flow the SDK is currently armed for: `DEMO_TX`, `RECOVERY_VCA_VOUCH`, `AIRDROP_REGISTRATION`, `AIRDROP_CLAIM`, `COIN_TRANSFER`.
- **`JniTxAmount`** — amount spec for `extrinsicClientInitializeTransaction`: `JniTxAmount.fixed(amount)` for a fixed amount in **display** units (e.g. `0.1` ETH), or `JniTxAmount.drainAccount()` to send the whole balance. (⚠️ iOS takes **atomic** units — see the [differences table](../ios/api-reference.md#differences-from-android-quick-map).)
- **`JniPendingTxResult(status: Int, circuitsPackage: JniCircuitsPackage?, txHash: String?)`** — result of `getterClientGetPendingTx()`: `status == 0` → `RequiresVca` (a `JniCircuitsPackage` needs user confirmation), `status == 1` → `AutoSent` (`txHash` already broadcast, no VCA required). `null` → the transaction could not be prepared (e.g. insufficient funds).
- **`JniCircuitsPackage`** — opaque handle for a rendered VCA package (the garbled circuits, the tx id and the number of message digits): pass it to `TxPinpadView` / `importRecoveryToken` / the pinpad-consuming calls; **never** inspect it.
- **`CampaignInfo(campaignId, status, chain, amountPerClaim: String, claimLimit: Int, totalFunds: String, registrationCount: Int, claimCount: Int, fundingAddress)`** — full campaign details. ⚠️ `amountPerClaim` and `totalFunds` are **strings** (they are decimal amounts).
- **`UserCampaign(campaignId, state)`** — this account's registration state in a campaign.
- **`SdkInitListener`** — `suspend fun onServerResetDetected()`; **`SdkToastListener`** — `onToast(message: String, duration: Int)`.
- **`InterstellarFileSharer`** — `shareData(data: ByteArray, fileName: String, mimeType: String, shareTitle: String)`; used to export the recovery token.
- **`InterstellarSigningException`** — thrown when the Android Keystore signing fails.
- Price constants `DOTUSD`, `SOLUSD`, `BTCUSD`, `ETHUSD` (`BigDecimal`; demo-grade values).

### Constants

| Constant | Value | Description |
| --- | --- | --- |
| `DEFAULT_WS_URL` | `wss://127.0.0.1:2090` | The Interstellar worker (L2) endpoint the SDK talks to by default. |
| `DEFAULT_NODE_URL` | `ws://127.0.0.1:9944` | The Integritee node (L1) endpoint. |
| `DEFAULT_IPFS_ADDR` | `/ip4/127.0.0.1/tcp/5001` | The IPFS endpoint (the garbled circuits). |
| `TOAST_LENGTH_SHORT` / `TOAST_LENGTH_LONG` | `0` / `1` | The `duration` values for `SdkToastListener.onToast`. |

:::note
The three `DEFAULT_*` constants point at the **local dev stack**: each port needs an
`adb reverse tcp:PORT tcp:PORT` to be reachable from a device or an emulator. Changing the
environment is done at integration time by Interstellar — **contact us** for the other values.
:::

## Initialization & lifecycle

| API | Signature | Description |
| --- | --- | --- |
| `create` | `suspend fun create(context: Context, fileSharer: InterstellarFileSharer, listener: SdkInitListener? = null): InterstellarSdk` | **[network]** The only entry point. Registers the device if needed, handles server-reset via `listener`, warms the balance cache, returns a ready SDK. |
| `checkServerReset` | `suspend fun checkServerReset(listener: SdkInitListener?): Boolean` | **[network]** Re-run the server-reset detection (call on app resume). Returns `true` if a reset was detected and handled (your `listener` was awaited, then re-registration + balance refresh happened). |
| `resetKeyPairAndRegister` | `suspend fun resetKeyPairAndRegister()` | **[network]** Delete the Android-Keystore key, wipe cached state and register a **new** identity. User-initiated only. |
| `toastListener` | property | See [Overview](./index.md#server-reset-semantics). |

## Root & coin accounts

| API | Signature | Description |
| --- | --- | --- |
| `getterRootAccount` | `suspend fun getterRootAccount(): ByteArray` | **[cached → network]** The 32-byte root account id of this device. Served from the local cache when available. |
| `getterClientGetAccount` | `suspend fun getterClientGetAccount(coinType: CoinType): String?` | **[cached → network]** Deposit address of the coin client (e.g. base58 SOL, hex ETH). Usable **as-is** as a transfer recipient or faucet target. |
| `getterClientGetAccountWithPrefix` | `suspend fun getterClientGetAccountWithPrefix(coinType: CoinType): String?` | **[cached → network]** Same, prefixed form (e.g. SS58 for DOT) for display. |

## Balances

| API | Signature | Description |
| --- | --- | --- |
| `updateBalances` | `suspend fun updateBalances(context: Context, listener: SdkInitListener? = null)` | **[network]** Refresh **all** coin balances and update `balances`/`totalBalanceUsd`. If `listener` is given, a server-reset check runs first (pull-to-refresh pattern). |
| `updateBalance` | `suspend fun updateBalance(context: Context, coinType: CoinType, listener: SdkInitListener? = null)` | **[network]** Same, for a **single** coin. |
| `getterClientGetBalanceInCoin` | `fun getterClientGetBalanceInCoin(coinType: CoinType): BigDecimal` | **[cached]** Balance in base units — **no network call**. |
| `getterClientGetBalanceInUsd` | `fun getterClientGetBalanceInUsd(coinType: CoinType): Double` | **[cached]** Balance converted to USD (2 decimals, hardcoded price table). |
| `getterClientGetTotalBalanceInUsd` | `fun getterClientGetTotalBalanceInUsd(): Double` | **[cached]** Sum over all coins. |
| `convertToUsd` | `fun convertToUsd(coinType: CoinType, amount: Double): Double` | Helper to display a user-entered amount in USD. |
| `convertCoinToAtomic` | `fun convertCoinToAtomic(coinType: CoinType, amount: Double): Long` | Convert a display amount (e.g. `0.1` ETH) to atomic units (Wei). |

## Transactions (coin transfer)

The supported end-to-end flow — all steps are **[network]**:

```kotlin
// 1. Prepare the transaction on-chain-side.
sdk.extrinsicClientInitializeTransaction(
    recipient = "9WzDX…",                       // recipient address
    txAmount = JniTxAmount.fixed(0.5),          // or JniTxAmount.drainAccount()
    coinType = CoinType.Sol,
)

// 2. Ask the SDK what to do next.
when (val pending = sdk.getterClientGetPendingTx()) {
    null -> { /* failed: e.g. insufficient balance */ }
    else -> if (pending.status == 1) {
        // AutoSent: no VCA required for this policy — tx already broadcast.
        val hash = pending.txHash
    } else {
        // RequiresVca: arm the pinpad (recommended shortcut below),
        // or render it yourself from pending.circuitsPackage.
        sdk.prepareCoinTransfer(CoinType.Sol)   // → navigateToPinpad=true
    }
}
```

Prefer the high-level shortcut in one call — `prepareCoinTransfer` does steps 1–2 internally:

```kotlin
sdk.prepareCoinTransfer(CoinType.Sol)   // arms pinpad if VCA needed; no-ops if AutoSent
```

| API | Signature | Description |
| --- | --- | --- |
| `extrinsicClientInitializeTransaction` | `suspend fun extrinsicClientInitializeTransaction(recipient: String, txAmount: JniTxAmount, coinType: CoinType): String` | Initialize a transaction to `recipient`. Returns a tx hash. |
| `getterClientGetPendingTx` | `suspend fun getterClientGetPendingTx(): JniPendingTxResult?` | Inspect the pending transaction: `RequiresVca` (needs pinpad) or `AutoSent` (already broadcast). `null` on failure. |
| `prepareCoinTransfer` | `fun prepareCoinTransfer(coinType: CoinType)` | High-level: initializes the pinpad state for the pending coin transfer **only if** a VCA is required (`navigateToPinpad=true`). Toasts on failure. |
| `extrinsicClientTransfer` | `suspend fun extrinsicClientTransfer(jniCircuitsPackage: JniCircuitsPackage, inputDigits: ByteArray, coinType: CoinType, onTxDone: () -> Unit)` | Low-level: submit the pinpad digits to validate & broadcast. **You normally do not call this** — `TxPinpadView` does it for you via `processPinpadInputs`. |
| `getterLatestBroadcastedTxHash` | `suspend fun getterLatestBroadcastedTxHash(): String?` | Latest broadcasted tx hash for this account — call after a transfer to show the receipt. |
| `clearPinpad` | `fun clearPinpad()` | Reset all pinpad state (`navigateToPinpad=false`, package/campaign cleared). Call when you hide your pinpad overlay. |

:::warning Reading the transfer result
Only for a **coin transfer** a rejected pinpad means failure: the SDK sets `showTxFailed=true` and `processPinpadInputs` (invoked internally by `TxPinpadView`) delivers `null`. For every other flow (recovery vouch, airdrop) a `null` result is **not** a failure — key your "Transaction failed" UI off `showTxFailed`, never off `null`.
:::

### Keypairs & message signing

| API | Signature | Description |
| --- | --- | --- |
| `extrinsicClientAddKeypair` | `suspend fun extrinsicClientAddKeypair(coinType: CoinType)` | Create a new keypair for the coin client (usually done automatically at registration). |
| `extrinsicClientSignMessage` | `suspend fun extrinsicClientSignMessage(message: ByteArray, coinType: CoinType)` | **[network]** Sign an arbitrary message (e.g. `eth_sign`) with the coin key. **Does NOT use a VCA** — no user pinpad. |
| `getterSignMessage` | `suspend fun getterSignMessage(): ByteArray?` | Retrieve the signature produced above. |

## Recovery

Registration-time APIs (device **has** its account) and restore-time APIs (device **lost** its account) both live here.

| API | Signature | Description |
| --- | --- | --- |
| `recoverySetThreshold` | `suspend fun recoverySetThreshold(threshold: Int): Boolean` | **[network]** Set how many methods are required to recover. Returns `false` if the chain rejected it (e.g. threshold > registered methods); local value unchanged then. |
| `recoveryAddNfc` | `suspend fun recoveryAddNfc(nfcSerialNumber: ByteArray): Boolean` | **[network]** Register an NFC card as recovery method. `true` on success (increments `nfcCount`). |
| `recoveryAddVcaToken` | `suspend fun recoveryAddVcaToken()` | **[network]** Generate a **VCA token file** and hand it to your `InterstellarFileSharer` (export/save/send). Increments `vcaCount` on success. |
| `importRecoveryToken` | `suspend fun importRecoveryToken(encryptedVca: ByteArray): JniCircuitsPackage` | Decrypt an imported token file into a VCA package (restore flow). Throws on corrupt data. |
| `prepareRecoveryVcaVouch` | `fun prepareRecoveryVcaVouch(fileBytes: ByteArray)` | High-level restore: import the token file **and** arm the vouch pinpad in one call (`navigateToPinpad=true` when ready). A corrupt/undecryptable token only toasts (`"Invalid recovery token"`) and resets pinpad state — it does not crash. |
| `recoveryVouchVca` | `suspend fun recoveryVouchVca(jniCircuitsPackage: JniCircuitsPackage, inputs: ByteArray, onTxDone: () -> Unit)` | **[network]** Complete the VCA-token vouch (pinpad digits via `TxPinpadView` / `processPinpadInputs` internally). |
| `recoveryVouchNfc` | `suspend fun recoveryVouchNfc(nfcSerialNumber: ByteArray): Boolean` | **[network]** Vouch with an NFC card. On success sets `recoveryVouchSubmitted=true`. |
| `recoveryClaim` | `suspend fun recoveryClaim()` | **[network]** Claim the recovered account **after** the ~10-block delay. Clears cached accounts/root and zeroes balances until refresh. |

:::note Vouch → Claim flow
Recovering a **lost** account: the helping device (with its own or the imported token/NFC) vouches — `recoveryVouchVca` or `recoveryVouchNfc` — then the *same* device waits for the ~10-block delay (watch `recoveryVouchSubmitted=true`) and finally calls `recoveryClaim()`.
:::

## Airdrop campaigns

| API | Signature | Description |
| --- | --- | --- |
| `getterCampaigns` | `suspend fun getterCampaigns(): List<String>` | **[network]** All campaign ids. |
| `getterCampaignInfo` | `suspend fun getterCampaignInfo(campaignId: String): CampaignInfo?` | **[network]** Full campaign details (status, funding address, counts…). |
| `getterUserCampaigns` | `suspend fun getterUserCampaigns(): List<UserCampaign>` | **[network]** This account's campaign registrations/states. |
| `extrinsicCreateCampaign` | `suspend fun extrinsicCreateCampaign(coinType: CoinType, amountPerClaim: Long, claimLimit: Int, freezePeriod: Int, registrationPeriod: Int, claimPeriod: Int)` | **[network]** Create a campaign (organizer flow). The funding address comes back in `getterCampaignInfo`. |
| `extrinsicFundCampaign` | `suspend fun extrinsicFundCampaign(campaignId: String)` | **[network]** Fund & activate a campaign (after transferring funds to its funding address). |
| `prepareAirdropRegistration` | `fun prepareAirdropRegistration(campaignId: String)` | **[network]** High-level: arm the **registration** VCA pinpad for a campaign (`navigateToPinpad=true` when ready). |
| `prepareAirdropClaim` | `fun prepareAirdropClaim(campaignId: String)` | **[network]** High-level: arm the **claim** VCA pinpad. |
| `extrinsicPrepareRegistration` / `extrinsicCompleteRegistration` | `suspend fun …(campaignId: String, inputIndices: ByteArray)` | Low-level 2-step registration (VCA #1 created, then validated by pinpad digits). Prefer `prepareAirdropRegistration`. |
| `extrinsicPrepareClaim` / `extrinsicClaimAirdrop` | `suspend fun …(campaignId: String, inputIndices: ByteArray, onTxDone: () -> Unit)` | Low-level 2-step claim (VCA #2 created, then validated). Prefer `prepareAirdropClaim`. |
| `getterAirdropVca` | `suspend fun getterAirdropVca(campaignId: String): JniCircuitsPackage?` | Fetch the campaign's VCA package directly (used by the `prepare…` helpers). |

## On/off-ramp (MoonPay)

| API | Signature | Description |
| --- | --- | --- |
| `signMoonpayUrl` | `suspend fun signMoonpayUrl(queryString: String): String?` | **[network]** Server-signs a MoonPay query string so your app can build a trusted MoonPay URL. |

## Demo transaction (visual cryptography sandbox) — *not part of the public API*

The SDK code still carries a `createDemoTx` / `demoTxCheckInputs` pair: it garbles a display
circuits package for a free-form message so the VCA renderer can be exercised without a real
transaction. **These are internal sandbox helpers, not public API** — they are not documented
as a contract, they may change or disappear, and they are not covered by the parity promise
with iOS. Do not build on them; use the real flows (`prepareCoinTransfer`,
`prepareAirdropRegistration`, `prepareAirdropClaim`, `prepareRecoveryVcaVouch`) instead.

## Thread-safety & threading guarantees

- Suspend functions hop to `Dispatchers.IO`; SDK-internal toasts are re-posted to the main thread.
- `StateFlow`s are safe to collect from the UI thread.
- On iOS the equivalent published-state mutations are serialized on the main thread — see the [iOS reference](../ios/api-reference.md).

## What is **not** public API

The SDK module contains a few more classes; they are `internal` and are **not** part of the
contract — do not use them (and do not expect them to exist in a future release):

| Symbol | What it is |
| --- | --- |
| `processPinpadInputs(inputs)` | the SDK's internal pinpad entry point (it is called by `TxPinpadView` for you). ⚠️ it **is** public on iOS — an asymmetry, not a contract. |
| `RustWrapper` | the thin adapter over the uniffi-Kotlin bindings. |
| `CurrencyMath` | the internal currency helpers (the public entry points are `convertToUsd`, `convertCoinToAtomic`, `getterClientGetBalanceInUsd`, …). |
| `MobileKeySigner` / `AndroidKeyStoreSigner` / `AndroidMobileSigner` | the internal signing seam over the Android Keystore (it is injectable **in the tests only**). |
| `PreferencesManager` / `KeysManager` | the internal persistence and key-management helpers. |
| `updateWorkerEndpointForTest(wsUrl)` | test-only endpoint switch. |

The **public** Rust surface is reachable through the same uniffi bindings, but the supported
entry point is the `InterstellarSdk` API documented above.
