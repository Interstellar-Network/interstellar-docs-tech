---
sidebar_label: 'VCA Pinpad Integration'
sidebar_position: 3
---

# VCA Pinpad Integration (Android)

The **pinpad** is how the user authorizes policy-gated actions (coin transfers above a threshold, airdrop registration/claim, recovery vouch). What makes it special:

- the pad itself is rendered **inside a garbled-circuit pixel stream** (`WGPUSurfaceView`) — the digits the user taps are validated cryptographically against the circuits, not against app memory;
- the **SDK owns the whole flow** — your app only renders the view when told to, and reports back nothing.

This page documents the Android view, **`TxPinpadView`** (class `gg.interstellar.wallet.TxPinpadView`, a `FrameLayout`).

:::warning SOL & other coins: complete the pad quickly
Some coins have a **short-lived “pending tx TTL”**: a prepared transaction is only valid for a short window, so the pinpad should be completed **quickly** (e.g. **SOL < 30s** or so on devnet). If you take too long the transaction fails — simply re-initiate it.
:::

## The contract in 4 rules

1. **Show an overlay when `navigateToPinpad == true`** — the SDK sets it the moment a VCA flow is armed (`prepareCoinTransfer`, `prepareAirdropRegistration`, `prepareAirdropClaim`, recovery-vouch). It is a *transient* flag, not a navigation destination.
2. **Inside the overlay, embed `TxPinpadView`** and call `setup(sdk, colors, callback)` once the circuits package (`pendingCircuitsPackage`) is non-null. Before that, show a `"Preparing Transaction…"` placeholder — the SDK clears it automatically.
3. **Let the view talk to the SDK.** `TxPinpadView` receives the rendered digit inputs, calls the SDK internally (`processPinpadInputs`), and gives you the result in its callback.
4. **Hide the overlay when the SDK says so** — the callback fires, and the SDK has already reset `navigateToPinpad=false` (`clearPinpad()` runs internally). Route the user to a receipt/portfolio screen.

## Minimal working example (Compose)

This is the pattern used by the reference wallet app (`PinpadFullScreenOverlay`):

```kotlin
val showPinpad by interstellarSdk.navigateToPinpad.collectAsState()
if (!showPinpad) return

Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colors.background) {
    val sdkPending by interstellarSdk.pendingCircuitsPackage.collectAsState()
    if (sdkPending != null) {
        Column {
            HeaderWithBrand()
            AndroidView(
                modifier = Modifier.weight(1f),
                factory = { ctx ->
                    TxPinpadView(ctx).apply {
                        setup(
                            sdk = interstellarSdk,
                            colors = MaterialTheme.colors,   // androidx.compose.material.Colors
                            callback = { txHash ->
                                // Runs on the main scope.
                                if (interstellarSdk.showTxFailed.value) {
                                    // ONLY meaningful for a COIN_TRANSFER that was rejected.
                                    Toast.makeText(activity, "Transaction failed", Toast.LENGTH_LONG).show()
                                } else if (txHash != null) {
                                    // Coin transfer accepted — show the receipt (txHash).
                                }
                                // For recovery vouch / airdrop flows a null txHash is NOT a failure.
                                navController.navigate(NavPortfolioBody)
                            },
                        )
                    }
                },
            )
        }
    } else {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Preparing Transaction...")
        }
    }
}
```

## `TxPinpadView.setup`

```kotlin
fun setup(
    sdk: InterstellarSdk?,
    colors: androidx.compose.material.Colors,
    callback: (String?) -> Unit,
)
```

| Parameter | Description |
| --- | --- |
| `sdk` | Your SDK instance. The view takes the **already-armed** `pendingCircuitsPackage` from it — you never pass the package yourself. If it is null at `setup` time the call is a no-op: call `setup` only when `pendingCircuitsPackage != null`. |
| `colors` | Material palette used to theme the rendered pad (message text, circle colors, background). |
| `callback` | `(String?) -> Unit` invoked when the pad flow finishes. `null` unless a **coin transfer** was accepted (then it is the broadcasted tx hash). |

Internally, `setup`:

1. builds the `WGPUSurfaceView` with the package's garbled circuits,
2. measures the on-screen rects of the **12 pad circles** and the message bar,
3. adds the WGPU surface **under** your overlay views, so digits appear to live inside the circuit stream,
4. on final input, calls the SDK (`processPinpadInputs`) and forwards the result to `callback`.

## Overlay layout requirements

`TxPinpadView` builds its own children and locates them by **content description**:

- **12 digit slots** must be tagged `contentDescription = "pinpad_0"` … `"pinpad_11"` (row-major, 4 rows × 3 columns; index 11 is the `✕`/backspace slot). The view ships with default pad buttons already tagged — keep them if you restyle.
- The **message bar** (the text the user must re-enter) is an SDK-provided child of the internal overlay — theme it via `colors`, do not remove it.

Place `TxPinpadView` **full-screen** (or at least full-width with a large square-ish area): the WGPU surface must be able to render the circles that visually contain your buttons.

## Reading the result — `showTxFailed` vs `null`

| Flow | Callback result | `showTxFailed` |
| --- | --- | --- |
| Coin transfer accepted | new broadcasted **tx hash** | `false` |
| Coin transfer **rejected** (wrong code) | `null` | **`true`** |
| Recovery vouch / airdrop register / claim / demo | `null` (the action itself is what matters) | `false` |

:::warning
Never implement *"failed = null result"*. For non-transfer flows the SDK returns `null` on success too — the only reliable failure signal is `interstellarSdk.showTxFailed`.
:::

## Lifecycle edge cases

- **Backgrounding mid-pinpad:** the SDK's state survives; `pendingCircuitsPackage` stays non-null until completion or `clearPinpad()`. On restore your overlay re-appears from `navigateToPinpad` automatically.
- **Cancelling:** there is no user-cancel API in this version; `clearPinpad()` exists for error paths (e.g. you failed to import a recovery token before arming the vouch flow — `prepareRecoveryVcaVouch` already calls it for you on failure).
- **Airdrop flows:** `pendingCampaignId` tells you which campaign the pad belongs to — navigate back to its detail screen in the callback, as the reference app does.

Continue with the full [API Reference](./api-reference.md) or the platform-equivalent [iOS pinpad](../ios/pinpad.md).
