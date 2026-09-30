---
sidebar_label: 'VCA Pinpad Integration'
sidebar_position: 2
---

# VCA Pinpad Integration (iOS)

The **pinpad** is how the user authorizes policy-gated actions (coin transfers above a threshold, airdrop registration/claim, recovery vouch). The pad is rendered **inside a garbled-circuit pixel stream** — the digits the user taps are validated cryptographically against the circuits, not against app memory — and the **SDK owns the whole flow**.

On iOS the pinpad ships as **`TxPinpadScreen`** (SwiftUI) + **`CircuitSurfaceView`** (Metal/WGPU-backed `UIViewRepresentable`), the mirror of Android's `TxPinpadView`.

:::warning SOL & other coins: complete the pad quickly
Some coins have a **short-lived “pending tx TTL”**: a prepared transaction is only valid for a short window, so the pinpad should be completed **quickly** (e.g. **SOL < 30s** or so on devnet). If you take too long the transaction fails — simply re-initiate it.
:::

## The contract in 4 rules

1. **Show an overlay when `sdk.navigateToPinpad == true`** — set by `prepareCoinTransfer`, `prepareAirdropRegistration`, `prepareAirdropClaim` or `prepareRecoveryVcaVouch`.
2. **In the overlay**: while `sdk.pendingCircuitsPackage` is `nil` show a `"Preparing Transaction…"` placeholder; once non-nil, present `TxPinpadScreen(circuits:sdk:onTxDone:)`.
3. **Let the screen talk to the SDK** — the internal surface collects digit taps, calls `sdk.processPinpadInputs(inputs:)` and forwards the result to `onTxDone`.
4. **Hide the overlay in the callback** — the SDK has already reset `navigateToPinpad`/`pendingCircuitsPackage` when `onTxDone` fires.

## Minimal working example (SwiftUI)

The pattern used by the reference wallet app (`PinpadContent` in `TabBarView.swift`):

```swift
struct PinpadContent: View {
    @ObservedObject var sdk: InterstellarSdk

    var body: some View {
        ZStack {
            if let circuits = sdk.pendingCircuitsPackage {
                TxPinpadScreen(
                    circuits: circuits,
                    sdk: sdk,
                    onTxDone: { hash in
                        // Runs after the SDK cleared the pinpad state.
                        if sdk.showTxFailed {
                            // ONLY meaningful for a COIN_TRANSFER that was rejected.
                            presentTransactionFailed()
                        } else if let hash {
                            // Coin transfer accepted — show the receipt (hash).
                        }
                        // For recovery vouch / airdrop flows a nil hash is NOT a failure.
                    }
                )
            } else {
                VStack {
                    Spacer()
                    Text("Preparing Transaction...").foregroundColor(.white)
                    Spacer()
                }
            }
        }
    }
}
```

Because `sdk` is an `ObservableObject`, the view re-renders automatically when the flow state changes; hold it with `@ObservedObject` (or `@EnvironmentObject`) so `navigateToPinpad` toggles your overlay.

## `TxPinpadScreen`

```swift
public struct TxPinpadScreen: View {
    public init(
        circuits: CircuitsPackage,      // from sdk.pendingCircuitsPackage
        sdk: InterstellarSdk,           // used internally for processPinpadInputs
        onTxDone: @escaping (String?) -> Void
    )
}
```

| Parameter | Description |
| --- | --- |
| `circuits` | The armed VCA package — pass `sdk.pendingCircuitsPackage!`, never construct one. |
| `sdk` | The SDK instance; the screen routes digit inputs to `processPinpadInputs`. |
| `onTxDone` | Completion: `String?` — non-nil **only** when a **coin transfer** was accepted (broadcasted tx hash). |

Internally the screen:

1. lays out the **12 digit slots** (4 rows × 3 columns, index 11 = `✕`) and the message bar with a `GeometryReader`,
2. once frames are measured, mounts `CircuitSurfaceViewRepresentable` with the measured rects and the package's garbled circuits,
3. taps are forwarded to the surface, which renders the visual-cryptography feedback and finally calls `sdk.processPinpadInputs`.

:::note App-only dependencies
The reference `TxPinpadScreen` also renders the wallet's own `HeaderWithBrand`/`ConfirmMessageBar` components (`Components/CommonUI.swift`). When integrating into **your** app, provide equivalent views or strip those lines — everything else is self-contained.
:::

## Reading the result — `showTxFailed` vs `nil`

| Flow | `onTxDone` hash | `sdk.showTxFailed` |
| --- | --- | --- |
| Coin transfer accepted | new broadcasted **tx hash** | `false` |
| Coin transfer **rejected** (wrong code) | `nil` | **`true`** |
| Recovery vouch / airdrop register / claim / demo | `nil` (the action itself is what matters) | `false` |

:::warning
Never implement *"failed = nil result"*. For non-transfer flows the SDK returns `nil` on success too — the only reliable failure signal is `sdk.showTxFailed`.
:::

## Lifecycle edge cases

- **Backgrounding mid-pinpad:** `pendingCircuitsPackage` stays non-nil until completion or `clearPinpad()`; your overlay re-appears from `navigateToPinpad` on restore.
- **Airdrop flows:** `sdk.pendingCampaignId` tells you which campaign the pad belongs to — navigate back to its detail screen in the callback (the reference app also flips `airdropPinpadCompleted`).
- **Forcing a fresh pad:** re-creating the view is enough; `clearPinpad()` exists for error paths (e.g. you aborted after arming a flow).
- **Renderer restarts:** the reference app bumps a `rendererKey` (`\.id(rendererKey)`) when `navigateToPinpad` turns `false`, guaranteeing the Metal surface is rebuilt for the next flow.

See also the [Android pinpad](../android/pinpad.md) — the contract is identical across platforms.
