---
sidebar_label: 'Overview & Integration'
sidebar_position: 0
---

# Interstellar SDK for iOS

The iOS SDK is the **`InterstellarSdk` Swift package** (`iosSdk/` in the source repository, published as `InterstellarSdk-<version>.zip`): a Swift Package Manager package that bundles

- the SDK layer — the `InterstellarSdk` class (the balances, the recovery/VCA flows, the airdrop campaigns, the signing) + the **pinpad UI** (`TxPinpadScreen`, `CircuitSurfaceView`),
- the data model (`CoinType`, `WalletBalances`) and the currency helpers (`CurrencyMath`),
- the pre-generated **uniffi Swift bindings** to the **Rust core** (`substrate-client`) — the **same uniffi FFI surface** Android uses (via its uniffi-Kotlin bindings); only the renderer surface is wired per-platform (extern `"C"` + the `rendererFFI` framework),
- the two **native frameworks** `substrate_clientFFI` (the uniffi FFI) and `rendererFFI` (the C FFI of the Rust renderer, Bevy/Metal),
- the **`MobileKeychainSigner`** — the device key as a **P-256 (secp256r1) ECDSA** key in the **iOS Keychain**.

## Requirements

| Requirement | Value |
| --- | --- |
| Platform | macOS (Apple Silicon) + Xcode 15+ |
| Deployment target | **iOS 17.0** (the package declares `platforms: [.iOS(.v17)]`) |
| Architectures | **arm64 only** — the device slice + the arm64 simulator slice |
| Device key | iOS **Keychain** — P-256 ECDSA (tag `interstellar_mobile_proxy_v1`) |
| Backend | Interstellar worker (`wss://`), node (`ws://`), IPFS endpoint |
| Toolchain | **Xcode/SPM only** — no Rust, no uniffi, no Kotlin/Native, no linker flags |

:::note Endpoint defaults
Defaults are the **local dev stack**: `wss://127.0.0.1:2090` (worker), `ws://127.0.0.1:9944` (node), `/ip4/127.0.0.1/tcp/5001` (IPFS). Unlike Android, the iOS factory **accepts overrides** (`create(wsURL:nodeURL:ipfsAddr:…)`), so you can point the SDK at another environment at runtime. **Contact us** for the shared testnet values.
:::

## Package integration

The published package is **self-contained**: download `InterstellarSdk-<version>.zip`, unzip it and add the `InterstellarSdk` folder as a **local Swift package** (Xcode: *File > Add Package Dependencies… > Add Local…*). Xcode **links and embeds** the two dynamic frameworks by itself — there is no "Embed & Sign" build phase, no bridging header and no linker flag to add.

```swift
import InterstellarSdk
```

That single import gives you the SDK layer **and** the raw Rust API (the package re-exports the two FFI modules).

The reference project (the wallet app) instead builds the SDK from source through a standard Gradle/Xcode bridge — its Run Script phase runs `./gradlew :shared:embedAndSignAppleFrameworkForXcode`, which builds the Kotlin/Native framework and the Rust static libraries, and the app links them through `FRAMEWORK_SEARCH_PATHS` / `LIBRARY_SEARCH_PATHS` / `OTHER_LDFLAGS`. That is the "heavy" path the published package exists to avoid.

:::warning Keystore persistence — **contrary to Android**
The device key lives in the **iOS Keychain** and is **NOT reset when the app is uninstalled** — on reinstall the SDK keeps the same identity and registration (opposite of a "fresh install" expectation). **On Android the opposite is true**: the key lives in the Android Keystore, which is wiped together with the app, so an uninstall + reinstall gives you a **brand-new** account. Only `resetKeyPairAndRegister()` or a Keychain-only reset changes the identity.
:::

## The one and only entry point

```swift
let sdk = try await InterstellarSdk.create(
    onServerResetDetected: {
        // Show a blocking warning UI ("server was reset, re-register?")
        // and return ONLY once the user acknowledges.
        await presentServerResetConfirmation()
    }
)
```

`create` is `async throws` and is the **only** way to obtain a fully-initialized instance — on return the SDK is registered (or re-registered after a server reset) and balances are cached. A second overload lets you override the endpoints:

```swift
try await InterstellarSdk.create(
    wsURL: "wss://…", nodeURL: "ws://…", ipfsAddr: "/ip4/…",
    onServerResetDetected: { … }
)
```

## Server-reset semantics

Identical to Android (both mirror the same Rust flow):

- **Fresh install** → transparent registration.
- **Stored account ≠ server root** (or server no longer knows the device) → your `onServerResetDetected` closure is awaited; when it returns, the SDK re-registers.
- On app resume call `sdk.checkServerReset(onServerResetDetected:)`.

`@Published` mutations are **always serialized on the main thread** by the SDK itself (it hops internally) — safe to consume from SwiftUI/Combine directly.

## Resetting the device identity

```swift
// USER-initiated full reset: deletes the Keychain key, clears cached state,
// re-registers as a brand-new account.
await sdk.resetKeyPairAndRegister()
```

Next steps:

- [**Getting Started**](./getting-started.md) — fresh app in Xcode → root account ID on screen.
- [**API Reference**](./api-reference.md) — every public API, documented.
- [**VCA Pinpad Integration**](./pinpad.md) — `TxPinpadScreen` and result semantics.
