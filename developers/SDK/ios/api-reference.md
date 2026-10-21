---
sidebar_label: 'API Reference'
sidebar_position: 2
---

# iOS API Reference

Complete reference of the **public** iOS SDK surface (`iosSdk/Sources/InterstellarSdk/`). All members live on `InterstellarSdk: ObservableObject` unless noted otherwise.

:::tip Android parity
Since the iOS SDK was published as a standalone package, its API is **name-identical to the Android SDK** — the same function names (`getterRootAccount`, `getterCampaigns`, `extrinsicClientTransfer`, …), only the **signatures** differ (Swift vs Kotlin). You can port an app from one platform to the other without renaming anything; see the [differences table](#differences-from-android-quick-map) at the bottom.
:::

:::tip Conventions
- `@Published` state is mutated **on the main thread only** (the SDK hops internally) — bind it directly in SwiftUI.
- Methods prefixed with `prepare…` arm a pinpad/VCA flow; `getter…` read state; `extrinsic…` submit on-chain actions.
- Errors are **not thrown** in most paths: failures are logged (`[InterstellarSdk]`) and surfaced as `nil`/`false`. `create`, `prepareCoinTransfer` and `prepareRecoveryVcaVouch` are the notable `throws` exceptions.
- `import InterstellarSdk` also re-exports the **raw Rust API** (the uniffi bindings + the renderer C FFI) — see [Exports](#the-raw-rust-api-is-re-exported).
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
| `airdropPinpadCompleted` | `Bool` | Set when an airdrop registration/claim pad completed (the reference app uses it to navigate back). |

### Other public properties

| Member | Type | Description |
| --- | --- | --- |
| `wsURL` / `nodeURL` / `ipfsAddr` | `String` | The backend endpoints the SDK talks to (defaults = the local dev stack). Set them at `create` time. |
| `workerCliPtr` | `UInt64` | The raw pointer to the Rust worker client. Exposed for advanced/debug use — you normally never touch it. |
| `pubKeyCompressed` | `Data` (read-only) | The SEC1-compressed public key (33 bytes) of the device key. |

### Value objects

- **`SdkCoinBalance(coinIdx: Int32, rawBalance: Int64, usdBalance: Double, address: String?)`** — `Identifiable` by `coinIdx`. `SdkCoinBalance.supportedCoins` holds the coin table: DOT (10 decimals, $3.79), SOL (9, $177.9), BTC (8, $113796), ETH (18, $4192). `SdkCoinBalance.usdPrice(for:)` returns the price of a coin index.
- **`CoinBalanceBuilder(coinIdx:decimals:usdPrice:)`** — the coin table entry; `convertToUsd(rawBalance:)` converts atomic units to USD.
- **`CoinType`** (`enum CoinType: Int, CaseIterable, Identifiable`) — `.dot = 0`, `.sol = 1`, `.btc = 2`, `.eth = 3`. **The order is wire-compatible with the Rust core and with Android's `CoinType` — do not reorder.** Each case exposes `intIndex` (`Int32`) and `name`.
- **`CurrencyMath`** (enum, static helpers) — `priceUsd(_:)`, `divisor(for:)`, `coinToUsd(_:coinAmount:)`, `coinToAtomic(_:amount:)`, `amountToUsd(_:amount:)`, `atomicToBase(_:divisor:)`, `totalBalanceInUsd(_:)`, `computeTotalUsd(_:)`. The price table is **hardcoded** (demo-grade values).
- **`WalletBalances`** (struct) — `dot`/`sol`/`btc`/`eth` in base units (`Decimal`), the iOS mirror of Android's `WalletBalances`.
- **`TxAmount`** (uniffi) — amount spec: `.fixed(amountInAtomicUnits: UInt64)` **in atomic units**, or `.drainAccount()`.
- **`PendingTxResult`** (uniffi) — result of `getterClientGetPendingTx()`: `.requiresVca(circuits: CircuitsPackage)` or `.autoSent(txHash: String)`.
- **`CircuitsPackage(circuitsPackage: Data, txId: Data, nbMessageDigits: UInt32)`** (uniffi) — opaque VCA package; render via `TxPinpadScreen`, never inspect.
- **`CampaignInfo` / `UserCampaign`** (uniffi records) — same fields as Android (`campaignId`, `status`, `chain`, `amountPerClaim`, `claimLimit`, `totalFunds`, `registrationCount`, `claimCount`, `fundingAddress` / `campaignId`, `state`).
- **`MobileKeychainSigner`** — the P-256 (secp256r1) ECDSA device key stored in the **iOS Keychain** (tag `interstellar_mobile_proxy_v1`); `publicKeySec1Compressed` is the 33-byte SEC1-compressed public key. It is the counterpart of the (internal) Android Keystore signer.

## Initialization & lifecycle

| API | Signature | Description |
| --- | --- | --- |
| `create` | `static func create(onServerResetDetected: @escaping () async -> Void) async throws -> InterstellarSdk` | **[network]** Only entry point. Registers the device, handles server reset, warms balances. `throws` on Keychain/FFI init failure. |
| `create` | `static func create(wsURL: String, nodeURL: String, ipfsAddr: String, onServerResetDetected: @escaping () async -> Void) async throws -> InterstellarSdk` | Same, with endpoint overrides (dev/test). |
| `checkServerReset` | `func checkServerReset(onServerResetDetected: @escaping () async -> Void) async -> Bool` | **[network]** Server-reset detection for app resume. `true` = detected & handled (re-registered, balances refreshed). |
| `resetKeyPairAndRegister` | `func resetKeyPairAndRegister() async` | **[network]** Delete the Keychain key, wipe cache, register a new identity. User-initiated only. |
| `updateWorkerEndpointForTest` | `func updateWorkerEndpointForTest(wsURL: String) throws` | **Test-only**: retarget the worker cli mid-session (Rust `update_worker_cli_endpoint`). |

:::note The `init?` is public but the factory is the way in
`InterstellarSdk.init?(wsURL:nodeURL:ipfsAddr:)` is public (it returns `nil` when the Keychain is unavailable), but `create` is the supported entry point: it is the only one that performs the registration, the server-reset check and the first balance pull.
:::

## Root & coin accounts

| API | Signature | Description |
| --- | --- | --- |
| `getterRootAccount` | `func getterRootAccount() async -> Data` | **[cached → network]** The 32-byte root account id (hex-cached in the `UserDefaults` suite `gg.interstellar.sdk.preferences`). |
| `getterClientGetAccount` | `func getterClientGetAccount(coinTypeIdx: Int32) -> String?` | **[cached → network]** Coin client deposit address (usable as-is for transfers/faucets). Refresh via `updateBalance`. |
| `getterClientGetAccountWithPrefix` | `func getterClientGetAccountWithPrefix(coinTypeIdx: Int32) -> String?` | **[cached → network]** Prefixed address form (e.g. SS58 for DOT) for display. |

## Balances

| API | Signature | Description |
| --- | --- | --- |
| `updateBalances` | `func updateBalances(onServerResetDetected: (() async -> Void)? = nil) async` | **[network]** Refresh **all** coins (balance + address + prefixed address), then republish `coinBalances`/`totalBalanceUsd`. Optional server-reset check first. |
| `updateBalance` | `func updateBalance(coinTypeIdx: Int32, onServerResetDetected: (() async -> Void)? = nil) async` | **[network]** Refresh a **single** coin. |
| `getterClientGetBalanceInCoin` | `func getterClientGetBalanceInCoin(coinTypeIdx: Int32) -> Int64` **and** `func getterClientGetBalanceInCoin(coinType: CoinType) -> Int64` | **[cached]** Raw **atomic** balance (no network). Two overloads: by index or by `CoinType`. |
| `getterClientGetBalanceInUsd` | `func getterClientGetBalanceInUsd(coinType: CoinType) -> Double` | **[cached]** Balance converted to USD (2 decimals, hardcoded price table). |
| `getterClientGetTotalBalanceInUsd` | `func getterClientGetTotalBalanceInUsd() -> Double` | **[cached]** Sum over all coins. |
| `convertToUsd` | `func convertToUsd(coin: CoinType, amount: Double) -> Double` | Display helper: USD value of a user-entered amount (2 decimals). |
| `convertCoinToAtomic` | `func convertCoinToAtomic(coinType: CoinType, amount: Double) -> Int64` | Convert a display amount (e.g. `0.1` ETH) to atomic units (Wei). |

`coinBalances[i].usdBalance` and `totalBalanceUsd` give the cached USD views directly.

## Transactions (coin transfer)

Supported end-to-end flow — all steps are **[network]**:

```swift
// 1. Prepare the transaction (note: TxAmount is in ATOMIC units on iOS).
let _ = await sdk.extrinsicClientInitializeTransaction(
    recipient: "9WzDX…",
    txAmount: .fixed(amountInAtomicUnits: 500_000_000),  // 0.5 SOL
    coinTypeIdx: 1)

// 2. Ask the SDK what to do next.
if let pending = await sdk.getterClientGetPendingTx() {
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
| `extrinsicClientInitializeTransaction` | `func extrinsicClientInitializeTransaction(recipient: String, txAmount: TxAmount, coinTypeIdx: Int32) async -> String` | Initialize a transaction to `recipient`. Returns a tx hash (or `""` on failure). |
| `getterClientGetPendingTx` | `func getterClientGetPendingTx() async -> PendingTxResult?` | Inspect the pending tx: `.requiresVca` / `.autoSent`. `nil` on failure (e.g. insufficient funds). |
| `prepareCoinTransfer` | `func prepareCoinTransfer(coinTypeIdx: Int32) async throws -> String?` | High-level: runs the pending-tx dance for you. **Throws** if there is no pending tx. If the flow was `.autoSent`, returns the broadcasted tx hash directly; otherwise arms the pinpad (`navigateToPinpad = true`) and returns `nil`. |
| `extrinsicClientTransfer` | `func extrinsicClientTransfer(inputDigits: Data, coinTypeIdx: Int32) -> String` | Low-level: submit pad digits. **You normally do not call this** — `CircuitSurfaceView` (inside `TxPinpadScreen`) does it via `processPinpadInputs`. |
| `processPinpadInputs` | `func processPinpadInputs(inputs: Data) -> String?` | The single entry the pad uses for **all** flows (transfer, recovery vouch, airdrop, demo). Returns the **new** broadcasted hash only when a coin transfer was accepted; otherwise `nil`. Clears the pinpad state afterwards. |
| `getterLatestBroadcastedTxHash` | `func getterLatestBroadcastedTxHash() -> String?` | Latest broadcasted tx hash for this account (receipt display). |
| `clearPinpad` | `func clearPinpad()` | Reset pinpad state (`navigateToPinpad=false`, package/campaign cleared). |

:::warning Reading the transfer result
`processPinpadInputs` returns `nil` **on success** for non-transfer flows (recovery vouch, airdrop, demo). The only reliable failure signal for a **coin transfer** is `showTxFailed == true` (set when the returned hash did not change). Mirror of Android's contract.
:::

### Keypairs & message signing

| API | Signature | Description |
| --- | --- | --- |
| `extrinsicClientAddKeypair` | `func extrinsicClientAddKeypair(coinTypeIdx: Int32) async` | Create a new coin keypair (automatic at registration). |
| `extrinsicClientSignMessage` | `func extrinsicClientSignMessage(message: Data, coinTypeIdx: Int32) -> String` | **[network]** Sign an arbitrary message (e.g. `eth_sign`). **Does NOT use a VCA.** |
| `getterSignMessage` | `func getterSignMessage() -> Data?` | Retrieve the signature produced above. |

## Recovery

| API | Signature | Description |
| --- | --- | --- |
| `recoverySetThreshold` | `func recoverySetThreshold(_ threshold: Int32) async -> Bool` | **[network]** Set the recovery threshold. `false` = rejected by the chain (local value unchanged). |
| `recoveryAddNfc` | `func recoveryAddNfc(nfcSerialNumber: Data) async -> Bool` | **[network]** Register an NFC card as recovery method (increments `nfcCount` on success). |
| `recoveryAddVcaToken` | `func recoveryAddVcaToken() async -> Data` | **[network]** Generate a **VCA token file** (`Data`, file `recovery-token.interstellar.enc`) — **your app** handles saving/sharing it (on Android the SDK shares via `InterstellarFileSharer`). Increments `vcaCount`. |
| `importRecoveryToken` | `func importRecoveryToken(encryptedVca: Data) async -> CircuitsPackage?` | Decrypt an imported token file into a VCA package (`nil` on corrupt data). |
| `prepareRecoveryVcaVouch` | `func prepareRecoveryVcaVouch(fileBytes: Data) async throws` | High-level restore: import the token **and** arm the vouch pinpad. **Throws** on an undecryptable token. |
| `recoveryVouchVca` | `func recoveryVouchVca(txId: Data, inputs: Data)` | **[network]** Complete the VCA-token vouch (pad digits normally delivered through `processPinpadInputs`). Sets `recoveryVouchSubmitted = true`. |
| `recoveryVouchNfc` | `func recoveryVouchNfc(nfcSerialNumber: Data) async -> Bool` | **[network]** Vouch with an NFC card. Sets `recoveryVouchSubmitted = true` on success. |
| `recoveryClaim` | `func recoveryClaim() async` | **[network]** Claim the recovered account after the ~10-block delay; clears cached accounts/root and zeroes balances until refresh. |

:::note Vouch → Claim flow
Recovering a **lost** account: the helping device (with its own or the imported token/NFC) vouches — `recoveryVouchVca` or `recoveryVouchNfc` — then the *same* device waits for the ~10-block delay (watch `recoveryVouchSubmitted == true`) and finally calls `recoveryClaim()`.
:::

## Airdrop campaigns

| API | Signature | Description |
| --- | --- | --- |
| `getterCampaigns` | `func getterCampaigns() async -> [String]` | **[network]** All campaign ids. |
| `getterCampaignInfo` | `func getterCampaignInfo(_ campaignId: String) async -> CampaignInfo?` | **[network]** Full campaign details. |
| `getterUserCampaigns` | `func getterUserCampaigns() async -> [UserCampaign]` | **[network]** This account's registrations/states. |
| `extrinsicCreateCampaign` | `func extrinsicCreateCampaign(coinTypeIdx: Int32, amountPerClaim: Int64, claimLimit: Int32, freezePeriod: Int32, registrationPeriod: Int32, claimPeriod: Int32) async` | **[network]** Create a campaign (organizer flow). The funding address comes back in `getterCampaignInfo`. |
| `extrinsicFundCampaign` | `func extrinsicFundCampaign(campaignId: String) async` | **[network]** Fund & activate a campaign. |
| `prepareAirdropRegistration` | `func prepareAirdropRegistration(campaignId: String) async` | **[network]** High-level: arm the **registration** VCA pinpad. |
| `prepareAirdropClaim` | `func prepareAirdropClaim(campaignId: String) async` | **[network]** High-level: arm the **claim** VCA pinpad. |
| `extrinsicPrepareRegistration` / `extrinsicCompleteRegistration` | `func extrinsicPrepareRegistration(campaignId: String)` / `func extrinsicCompleteRegistration(campaignId: String, inputIndices: Data)` | Low-level 2-step registration (VCA #1 created, then validated by the pad digits). Prefer `prepareAirdropRegistration`. |
| `extrinsicPrepareClaim` / `extrinsicClaimAirdrop` | `func extrinsicPrepareClaim(campaignId: String)` / `func extrinsicClaimAirdrop(campaignId: String, inputIndices: Data)` | Low-level 2-step claim (VCA #2 created, then validated). Prefer `prepareAirdropClaim`. |
| `getterAirdropVca` | `func getterAirdropVca(campaignId: String) -> CircuitsPackage?` | Fetch the campaign's VCA package directly. |

## On/off-ramp (MoonPay)

| API | Signature | Description |
| --- | --- | --- |
| `signMoonpayUrl` | `func signMoonpayUrl(queryString: String) async -> String?` | **[network]** Server-signs a MoonPay query string so your app can build a trusted MoonPay URL. |

## Demo transaction (visual cryptography sandbox) — *not part of the public API*

The SDK code still carries a `createDemoTx` / `demoTxCheckInputs` pair: it garbles a display
circuits package for a free-form message so the VCA renderer can be exercised without a real
transaction. **These are internal sandbox helpers, not public API** — they are not documented
as a contract, they may change or disappear, and they are not covered by the parity promise
with Android. Do not build on them; use the real flows (`prepareCoinTransfer`,
`prepareAirdropRegistration`, `prepareAirdropClaim`, `prepareRecoveryVcaVouch`) instead.

## The pinpad UI (shipped with the SDK)

| Type | Description |
| --- | --- |
| `TxPinpadScreen(circuits:sdk:onTxDone:)` | The SwiftUI pad: 12 digit slots + the message bar, rendered through the garbled-circuit surface. See the [pinpad guide](./pinpad.md). |
| `CircuitSurfaceView` | The `UIView` that hosts the Metal/WGPU renderer (`configure(circuitsPackage:)`, `start()`, `stop()`, `onClickPinpadDigit(_:)`). |
| `CircuitSurfaceViewRepresentable` | The `UIViewRepresentable` wrapper used by `TxPinpadScreen`. |

## The raw Rust API is re-exported

`import InterstellarSdk` also gives you the **uniffi bindings** and the **renderer C API** (the package re-exports the two FFI modules). Handy for advanced use — e.g. calling the renderer directly:

```swift
import InterstellarSdk   // gives you the uniffi globals + the renderer C functions

var msgWidth: UInt32 = 0
var msgHeight: UInt32 = 0
var padWidth: UInt32 = 0
var padHeight: UInt32 = 0
_ = get_dimensions(ctxPtr, &msgWidth, &msgHeight, &padWidth, &padHeight)
```

The Android SDK exposes the same Rust surface through its `RustWrapper` adapter.

## Threading & guarantees

- Every `@Published` mutation is routed through the SDK's main-thread hop, so SwiftUI/Combine never sees an off-main write.
- The FFI calls block; the SDK runs them off the main thread. `await` the `async` methods from a `Task`.
- Failures are **logged** (`[InterstellarSdk] …`) and surfaced as `nil`/`false` — check the return values, not the console.

## What is **not** public API

A few more symbols ship in the package; they are **internal** and are not part of the contract —
do not use them (and do not expect them to exist in a future release):

| Symbol | What it is |
| --- | --- |
| the `_getter…` / `_extrinsic…` methods | the internal wrappers over the uniffi bindings (the public API of the same name calls them). |
| the `rust…` functions of `Rust.swift` | the raw uniffi wrappers — the same reason they exist. |
| `InterstellarSdk.init?(wsURL:nodeURL:ipfsAddr:)` | the failable initializer; `create` is the supported entry point. |
| `SdkVcaFlowType` | the internal "which flow is armed" state (it is public, but it is a detail of the SDK's state machine). |

The **public** Rust surface is re-exported by the package (see above) — but the supported entry
point is the `InterstellarSdk` API documented on this page.

## Differences from Android (quick map)

| Android | iOS | Note |
| --- | --- | --- |
| `StateFlow<T>` | `@Published var` | Kotlin flows vs Combine/SwiftUI. |
| `BigDecimal` (base units) | `Decimal` (base units) / `Double` (USD) | Swift has no `BigDecimal`; the SDK uses `Decimal` for the money math. |
| `JniTxAmount.fixed(0.5)` — **display** units | `TxAmount.fixed(amountInAtomicUnits:)` — **atomic** units | ⚠️ convert before calling on iOS (`sdk.convertCoinToAtomic(coin:amount:)`). |
| `JniPendingTxResult(status, …)` | `PendingTxResult` `.requiresVca`/`.autoSent` | Swift is an enum. |
| `WalletBalances(dot:, sol:, …)` | `[SdkCoinBalance]` keyed by `coinIdx` | iOS addresses ride along in the same DTO. |
| The SDK shares recovery tokens via `InterstellarFileSharer` | `recoveryAddVcaToken()` returns `Data` | Your iOS app owns save/share. |
| Endpoint override at build time | `create(wsURL:nodeURL:ipfsAddr:)` | iOS factory takes runtime overrides. |
| `getterRootAccount(): ByteArray` | `getterRootAccount(): Data` | Same name, Swift type. |
