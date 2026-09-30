---
sidebar_label: 'API Reference'
sidebar_position: 2
---

# iOS API Reference

Complete reference of the **public** iOS SDK surface. All members live on `InterstellarSdk: ObservableObject` unless noted otherwise. The API mirrors the Android SDK ([Android reference](../android/api-reference.md)) but is **not** name-identical — this page is authoritative for Swift.

:::tip Conventions
- `@Published` state is mutated **on the main thread only** (the SDK hops internally) — bind it directly in SwiftUI.
- Methods prefixed with `prepare…` arm a pinpad/VCA flow; `_getter…`/`_extrinsic…` methods are thin FFI wrappers kept public for advanced use; **`getRootAccount`/`getCampaignIds`/`getCampaignInfo`** differ from Android only because uniffi generates global functions with the same names.
- Errors are **not thrown** in most paths (Swift lacks the Kotlin suspend ergonomics): failures are logged (`[InterstellarSdk]`) and surfaced as `nil`/`false`. `prepareCoinTransfer` and `create` are the notable `throws` exceptions.
:::

## Observable state (`@Published`)

| Member | Type | Description |
| --- | --- | --- |
| `coinBalances` | `[SdkCoinBalance]` | **[cached]** One entry per supported coin: raw atomic balance, USD value and deposit address (see below). |
| `totalBalanceUsd` | `String` | **[cached]** Total portfolio in USD, 2 decimals (`"12.34"`). |
| `vcaCount` / `nfcCount` | `Int` | Recovery methods (VCA token / NFC) registered **by this device**. |
| `recoveryThreshold` | `Int` | Configured recovery threshold (default `1`). |
| `recoveryVouchSubmitted` | `Bool` | `true` once this device has **vouched** to recover a lost account (Claim enabled after the ~10-block delay). Persisted. **Gate the Claim button on this.** |
| `pendingCircuitsPackage` | `CircuitsPackage?` | Non-null while a pinpad flow is armed and its circuits are ready to render. |
| `pendingCampaignId` | `String?` | Campaign id of the armed airdrop flow (nil otherwise). |
| `navigateToPinpad` | `Bool` | `true` when your app must **show the pinpad now** ([pinpad page](./pinpad.md)). |
| `showTxFailed` | `Bool` | `true` **only** when a *coin-transfer* pad input was rejected. Never infer failure from a `nil` pinpad result alone. |
| `airdropPinpadCompleted` | `Bool` | Set when an airdrop registration/claim pad completed (reference app uses it to navigate back). |

### Value objects

- **`SdkCoinBalance(coinIdx: Int32, rawBalance: Int64, usdBalance: Double, address: String?)`** — `Identifiable` by `coinIdx`. `SdkCoinBalance.supportedCoins` holds the coin table: DOT (10 decimals, $3.79), SOL (9, $177.9), BTC (8, $113796), ETH (18, $4192).
- **Coin indexing** — coins are addressed by `Int32` index matching `CoinType`: `0=DOT`, `1=SOL`, `2=BTC`, `3=ETH`. The KMP `shared` framework also exports the `CoinType` enum + `CurrencyMath` for conversions (`convertToUsd` uses it internally).
- **`TxAmount`** (uniffi) — amount spec: `.fixed(amountInAtomicUnits: UInt64)` **in atomic units**, or `.drainAccount()`.
- **`PendingTxResult`** (uniffi) — result of `_getterClientGetPendingTx()`: `.requiresVca(circuits: CircuitsPackage)` or `.autoSent(txHash: String)`.
- **`CircuitsPackage(circuitsPackage: Data, txId: Data, nbMessageDigits: UInt32)`** (uniffi) — opaque VCA package; render via `TxPinpadScreen`, never inspect.
- **`CampaignInfo` / `UserCampaign`** (uniffi records) — same fields as Android (`campaignId`, `status`, `chain`, `amountPerClaim`, `claimLimit`, `totalFunds`, `registrationCount`, `claimCount`, `fundingAddress` / `campaignId`, `state`).

## Initialization & lifecycle

| API | Signature | Description |
| --- | --- | --- |
| `create` | `static func create(onServerResetDetected: @escaping () async -> Void) async throws -> InterstellarSdk` | **[network]** Only entry point. Registers the device, handles server reset, warms balances. `throws` on Keychain/FFI init failure. |
| `create` | `static func create(wsURL: String, nodeURL: String, ipfsAddr: String, onServerResetDetected: @escaping () async -> Void) async throws -> InterstellarSdk` | Same, with endpoint overrides (dev/test). |
| `checkServerReset` | `func checkServerReset(onServerResetDetected: @escaping () async -> Void) async -> Bool` | **[network]** Server-reset detection for app resume. `true` = detected & handled (re-registered, balances refreshed). |
| `resetKeyPairAndRegister` | `func resetKeyPairAndRegister() async` | **[network]** Delete the Keychain key, wipe cache, register a new identity. User-initiated only. |
| `updateWorkerEndpointForTest` | `func updateWorkerEndpointForTest(wsURL: String) throws` | **Test-only**: retarget the worker cli mid-session (Rust `update_worker_cli_endpoint`). |

## Root & coin accounts

| API | Signature | Description |
| --- | --- | --- |
| `getRootAccount` | `func getRootAccount() async -> Data` | **[cached → network]** 32-byte root account id (hex-cached in `UserDefaults` suite `gg.interstellar.sdk.preferences`). Android equivalent: `getterRootAccount()`. |
| `_getterClientGetAccount` | `func _getterClientGetAccount(coinTypeIdx: Int32) -> String?` | **[cached]** Coin client deposit address (usable as-is for transfers/faucets). Refresh via `updateBalance`. |
| `_getterClientGetAccountWithPrefix` | `func _getterClientGetAccountWithPrefix(coinTypeIdx: Int32) -> String?` | **[cached → network]** Prefixed address form (e.g. SS58) for display. |

## Balances

| API | Signature | Description |
| --- | --- | --- |
| `updateBalances` | `func updateBalances(onServerResetDetected: (() async -> Void)? = nil) async` | **[network]** Refresh **all** coins (balance + address + prefixed address), then republish `coinBalances`/`totalBalanceUsd`. Optional server-reset check first. |
| `updateBalance` | `func updateBalance(coinTypeIdx: Int32, onServerResetDetected: (() async -> Void)? = nil) async` | **[network]** Refresh a **single** coin. |
| `_getterClientGetBalance` | `func _getterClientGetBalance(coinTypeIdx: Int32) -> Int64` | **[cached]** Raw atomic balance (no network). |
| `convertToUsd` | `func convertToUsd(coin: CoinType, amount: Double) -> Double` | Display helper: USD value of a user-entered amount (2 decimals). |

`coinBalances[i].usdBalance` and `totalBalanceUsd` give the cached USD views directly.

## Transactions (coin transfer)

Supported end-to-end flow — all steps are **[network]**:

```swift
// 1. Prepare the transaction (note: TxAmount is in ATOMIC units on iOS).
let _ = await sdk._extrinsicClientInitializeTransaction(
    recipient: "9WzDX…",
    txAmount: .fixed(amountInAtomicUnits: 500_000_000),  // 0.5 SOL
    coinTypeIdx: 1)

// 2. Ask the SDK what to do next.
if let pending = await sdk._getterClientGetPendingTx() {
    switch pending {
    case .autoSent(let txHash):
        // No VCA required for this policy — already broadcast.
        break
    case .requiresVca:
        // Arm the pinpad in one call:
        try await sdk.prepareCoinTransfer(coinTypeIdx: 1)   // → navigateToPinpad = true
    }
}
```

| API | Signature | Description |
| --- | --- | --- |
| `_extrinsicClientInitializeTransaction` | `func _extrinsicClientInitializeTransaction(recipient: String, txAmount: TxAmount, coinTypeIdx: Int32) async -> String` | Initialize a transaction to `recipient`. Returns a tx hash (or `""` on failure). |
| `_getterClientGetPendingTx` | `func _getterClientGetPendingTx() async -> PendingTxResult?` | Inspect the pending tx: `.requiresVca` / `.autoSent`. `nil` on failure (e.g. insufficient funds). |
| `prepareCoinTransfer` | `func prepareCoinTransfer(coinTypeIdx: Int32) async throws -> String?` | High-level: runs the pending-tx dance for you. **Throws** if no pending tx. If the flow was `.autoSent`, returns the broadcasted tx hash directly; otherwise arms the pinpad and returns `nil`. |
| `_extrinsicClientTransfer` | `func _extrinsicClientTransfer(inputDigits: Data, coinTypeIdx: Int32) -> String` | Low-level: submit pad digits. **You normally do not call this** — `CircuitSurfaceView` (inside `TxPinpadScreen`) does it via `processPinpadInputs`. |
| `processPinpadInputs` | `func processPinpadInputs(inputs: Data) -> String?` | The single entry the pad uses for **all** flows (transfer, recovery vouch, airdrop, demo). Returns the **new** broadcasted hash only when a coin transfer was accepted; otherwise `nil`. Clears the pinpad state afterwards. |
| `_getterLatestBroadcastedTxHash` | `func _getterLatestBroadcastedTxHash() -> String?` | Latest broadcasted tx hash for this account (receipt display). |
| `clearPinpad` | `func clearPinpad()` | Reset pinpad state (`navigateToPinpad=false`, package/campaign cleared). |

:::warning Reading the transfer result
`processPinpadInputs` returns `nil` **on success** for non-transfer flows (recovery vouch, airdrop, demo). The only reliable failure signal for a **coin transfer** is `showTxFailed == true` (set when the returned hash did not change). Mirror of Android's contract.
:::

### Keypairs & message signing

| API | Signature | Description |
| --- | --- | --- |
| `_extrinsicClientAddKeypair` | `func _extrinsicClientAddKeypair(coinTypeIdx: Int32) async` | Create a new coin keypair (automatic at registration). |
| `_extrinsicClientSignMessage` | `func _extrinsicClientSignMessage(message: Data, coinTypeIdx: Int32) -> String` | **[network]** Sign an arbitrary message (e.g. `eth_sign`). **Does NOT use a VCA.** |
| `_getterSignMessage` | `func _getterSignMessage() -> Data?` | Retrieve the signature produced above. |

## Recovery

| API | Signature | Description |
| --- | --- | --- |
| `recoverySetThreshold` | `func recoverySetThreshold(_ threshold: Int32) async -> Bool` | **[network]** Set the recovery threshold. `false` = rejected by the chain (local value unchanged). |
| `recoveryAddNfc` | `func recoveryAddNfc(nfcSerialNumber: Data) async -> Bool` | **[network]** Register an NFC card as recovery method (increments `nfcCount` on success). |
| `recoveryAddVcaToken` | `func recoveryAddVcaToken() async -> Data` | **[network]** Generate a **VCA token file** (`Data`, file `recovery-token.interstellar.enc`) — your app handles saving/sharing it (on Android the SDK shares via `InterstellarFileSharer`). Increments `vcaCount`. |
| `importRecoveryToken` | `func importRecoveryToken(encryptedVca: Data) async -> CircuitsPackage?` | Decrypt an imported token file into a VCA package (`nil` on corrupt data). |
| `prepareRecoveryVcaVouch` | `func prepareRecoveryVcaVouch(fileBytes: Data) async throws` | High-level restore: import the token **and** arm the vouch pinpad. **Throws** on undecryptable token. |
| `recoveryVouchVca` | `func recoveryVouchVca(txId: Data, inputs: Data)` | **[network]** Complete the VCA-token vouch (pad digits normally delivered through `processPinpadInputs`). Sets `recoveryVouchSubmitted=true`. |
| `recoveryVouchNfc` | `func recoveryVouchNfc(nfcSerialNumber: Data) async -> Bool` | **[network]** Vouch with an NFC card. Sets `recoveryVouchSubmitted=true` on success. |
| `recoveryClaim` | `func recoveryClaim() async` | **[network]** Claim the recovered account after the ~10-block delay; clears cached accounts/root and zeroes balances until refresh. |

## Airdrop campaigns

| API | Signature | Description |
| --- | --- | --- |
| `getCampaignIds` | `func getCampaignIds() async -> [String]` | **[network]** All campaign ids (Android: `getterCampaigns`). |
| `getCampaignInfo` | `func getCampaignInfo(_ campaignId: String) async -> CampaignInfo?` | **[network]** Full campaign details. |
| `getUserCampaigns` | `func getUserCampaigns() async -> [UserCampaign]` | **[network]** This account's registrations/states. |
| `_extrinsicCreateCampaign` | `func _extrinsicCreateCampaign(coinTypeIdx: Int32, amountPerClaim: Int64, claimLimit: Int32, freezePeriod: Int32, registrationPeriod: Int32, claimPeriod: Int32) async` | **[network]** Create a campaign (organizer flow). |
| `_extrinsicFundCampaign` | `func _extrinsicFundCampaign(campaignId: String) async` | **[network]** Fund & activate a campaign. |
| `prepareAirdropRegistration` | `func prepareAirdropRegistration(campaignId: String) async` | **[network]** High-level: arm the **registration** VCA pinpad. |
| `prepareAirdropClaim` | `func prepareAirdropClaim(campaignId: String) async` | **[network]** High-level: arm the **claim** VCA pinpad. |
| `_extrinsicPrepareRegistration` / `_extrinsicCompleteRegistration` | `func …(campaignId: String, inputIndices: Data)` | Low-level 2-step registration. Prefer `prepareAirdropRegistration`. |
| `_extrinsicPrepareClaim` / `_extrinsicClaimAirdrop` | `func …(campaignId: String, inputIndices: Data)` | Low-level 2-step claim. Prefer `prepareAirdropClaim`. |
| `_getterAirdropVca` | `func _getterAirdropVca(campaignId: String) -> CircuitsPackage?` | Fetch the campaign's VCA package directly. |

## On/off-ramp (MoonPay)

| API | Signature | Description |
| --- | --- | --- |
| `signMoonpayUrl` | `func signMoonpayUrl(queryString: String) async -> String?` | **[network]** Server-signs a MoonPay query string so your app can build a trusted MoonPay URL. |

## Demo transaction (visual cryptography sandbox)

| API | Signature | Description |
| --- | --- | --- |
| `createDemoTx` | `func createDemoTx(txMessage: String) -> CircuitsPackage?` | Garble & strip a display circuits package for `txMessage` — render it with `TxPinpadScreen` to demo the renderer without a real transaction. |
| `demoTxCheckInputs` | `func demoTxCheckInputs(txId: Data, inputs: Data)` | Validate demo pad inputs. |

## Differences from Android (quick map)

| Android | iOS | Note |
| --- | --- | --- |
| `getterRootAccount()` | `getRootAccount()` | iOS name differs (uniffi shadowing). |
| `getterCampaigns()` / `getterCampaignInfo()` | `getCampaignIds()` / `getCampaignInfo(_:)` | Same reason. |
| `JniTxAmount.fixed(0.5)` — display units | `TxAmount.fixed(amountInAtomicUnits:)` — **atomic** units | ⚠️ convert before calling on iOS. |
| `JniPendingTxResult(status, …)` | `PendingTxResult` `.requiresVca`/`.autoSent` | Swift is an enum. |
| `WalletBalances(dot:, sol:, …)` | `[SdkCoinBalance]` keyed by `coinIdx` | iOS addresses ride along in the same DTO. |
| SDK shares recovery tokens via `InterstellarFileSharer` | `recoveryAddVcaToken()` returns `Data` | Your iOS app owns save/share. |
| Endpoint override at build time | `create(wsURL:nodeURL:ipfsAddr:)` | iOS factory takes overrides. |
