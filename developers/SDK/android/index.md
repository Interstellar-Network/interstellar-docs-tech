---
sidebar_label: 'Overview & Integration'
sidebar_position: 0
---

# Interstellar SDK for Android

The Android SDK is the Gradle module **`:shared`** (package **`gg.interstellar.wallet`**), a Kotlin library that bundles:

- the public `InterstellarSdk` API (this document),
- the **Rust core** compiled for Android (JNI), including the garbled-circuit renderer,
- the **`TxPinpadView`** Android view for the VCA confirmation pad ([dedicated page](./pinpad.md)),
- the currency math helpers (`CurrencyMath`, `WalletBalances`).

## Requirements

| Requirement | Value |
| --- | --- |
| Language | Kotlin (Java 17 toolchain) |
| Android | `minSdk 23`, `compileSdk 36` |
| Device key | **Android Keystore** — P-256 (secp256r1) ECDSA, alias `interstellar_mobile_proxy_v1` |
| Backend | An Interstellar worker (L2, `wss://`), node (L1, `ws://`) and IPFS endpoint |

:::note Endpoint defaults
The SDK defaults are the **local dev stack**: `wss://127.0.0.1:2090` (worker), `ws://127.0.0.1:9944` (node), `/ip4/127.0.0.1/tcp/5001` (IPFS). Connecting to a different environment is currently configured at build/integration time by Interstellar — **contact us** for the values to use. When developing against the local stack, each port needs `adb reverse tcp:PORT tcp:PORT`.
:::

## The one and only entry point

There is no public constructor. The **only** way to obtain an SDK instance is the async factory — this guarantees you can never hold a half-initialized SDK (registration, key checks and the first balance pull happen inside `create`):

```kotlin
val sdk = InterstellarSdk.create(
    context = applicationContext,
    fileSharer = myFileSharer,          // required — used by recovery-token export
    listener = object : SdkInitListener {   // optional
        override suspend fun onServerResetDetected() {
            // Show a blocking warning UI ("server was reset, re-register?")
            // and return ONLY once the user acknowledges.
            awaitUserAcknowledgement()
        }
    },
)
```

| Parameter | Type | Notes |
| --- | --- | --- |
| `context` | `Context` | Application context is recommended. |
| `fileSharer` | `InterstellarFileSharer` | Your implementation; the SDK calls `shareData(...)` when it produces a recovery token file (filename `recovery-token.interstellar.enc`, MIME `application/octet-stream`). |
| `listener` | `SdkInitListener?` | Server-reset callback (see below). |

`create` must be called from a coroutine. On completion the SDK is **ready to use**: registered (or re-registered), with balances cached.

## Server-reset semantics

The SDK stores the root account id locally and compares it with the server at init (and at every `updateBalances`/resume check):

- **Fresh install** → transparent registration.
- **Server root changed / device no longer registered while a local account exists** → `onServerResetDetected()` is invoked; the SDK **suspends inside it** until you return, then re-registers automatically.
- The same check is available on app resume via `sdk.checkServerReset(listener)` — call it when your app comes back to the foreground.

All of this also surfaces **toasts** through the optional `sdk.toastListener` (`SdkToastListener.onToast(message, duration)` with `TOAST_LENGTH_SHORT`/`TOAST_LENGTH_LONG`) — implement it if you want the SDK's progress/error feedback (e.g. "Registering…", "Server reset detected") shown in your UI. Toasts are always fired on the main thread.

## Resetting the device identity

```kotlin
// USER-initiated full reset: deletes the Keystore key, clears cached state,
// and re-registers as a brand-new account.
sdk.resetKeyPairAndRegister()
```

Next steps:

- [**Getting Started**](./getting-started.md) — fresh app in Android Studio → root account ID on screen.
- [**API Reference**](./api-reference.md) — every public API, documented.
- [**VCA Pinpad Integration**](./pinpad.md) — how to host `TxPinpadView` and interpret `showTxFailed`.
