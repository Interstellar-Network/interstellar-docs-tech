---
sidebar_label: 'Overview & Integration'
sidebar_position: 0
---

# Interstellar SDK for iOS

The iOS SDK is the **`InterstellarSdk`** Swift layer (`InterstellarSdk.swift` and friends in the reference app), which binds together:

- **`import shared`** — the Kotlin Multiplatform `shared` framework (currency math, shared enums),
- **uniffi-generated Swift bindings** (`Generated/substrate_client.swift`) to the **Rust core** (static libraries `libsubstrate_client.a`, `librenderer.a`),
- **`MobileKeychainSigner`** — device key as a **P-256 (secp256r1) ECDSA** key in the **iOS Keychain**.

## Requirements

| Requirement | Value |
| --- | --- |
| Platform | macOS (Apple Silicon) + Xcode 15+ |
| Device key | iOS **Keychain** — P-256 ECDSA (tag `interstellar_mobile_proxy_v1`) |
| Backend | Interstellar worker (`wss://`), node (`ws://`), IPFS endpoint |
| Rust targets | `aarch64-apple-ios`, `aarch64-apple-ios-sim` |

:::note Endpoint defaults
Defaults are the **local dev stack**: `wss://127.0.0.1:2090` (worker), `ws://127.0.0.1:9944` (node), `/ip4/127.0.0.1/tcp/5001` (IPFS). Unlike Android, the iOS factory **accepts overrides** (`create(wsURL:nodeURL:ipfsAddr:…)`), so you can point the SDK at another environment at runtime. **Contact us** for the shared testnet values.
:::

## Framework integration

The reference project wires the KMP framework through a standard Gradle/Xcode bridge — your Xcode build phase runs:

```sh
./gradlew :shared:embedAndSignAppleFrameworkForXcode
```

which transitively builds the Rust static libraries and embeds the `shared` framework (`FRAMEWORK_SEARCH_PATHS = shared/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)`). The `InterstellarSdk` Swift sources then compile into your app target.

:::info Keystore persistence
The device key lives in the **iOS Keychain** and is **NOT reset when the app is uninstalled** — on reinstall the SDK keeps the same identity and registration (opposite of a "fresh install" expectation). Only `resetKeyPairAndRegister()` or a Keychain-only reset changes the identity.
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

`create` is `async throws` and is the **only** way to obtain an instance — on return the SDK is registered (or re-registered after a server reset) and balances are cached. A second overload lets you override the endpoints:

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
