---
sidebar_label: 'Getting Started'
sidebar_position: 1
---

# Getting Started — Android

This guide creates a **brand-new Android app** in Android Studio, integrates the Interstellar SDK the most basic way, and ends with a single screen showing the **root account ID** — nothing else.

:::note What "basic" means here
One Activity, one `TextView`, one `InterstellarSdk.create(...)` call. No Compose, no ViewModel, no pinpad — those are covered by the [API Reference](./api-reference.md) and [pinpad guide](./pinpad.md).
:::

## Prerequisites

| Tool | Version / notes |
| --- | --- |
| Android Studio | recent stable (Hedgehog or later recommended) |
| JDK | 17 (Android Studio's embedded JBR is fine) |
| Android SDK | `compileSdk 36` |
| NDK | `28.0.13004108` (SDK Manager → SDK Tools → NDK (Side by side)) |
| Rust | **nightly** toolchain (the workspace `rust-toolchain.toml` pins the exact version once copied) |
| Rust targets | `rustup target add aarch64-linux-android x86_64-linux-android` |
| Interstellar stack | the local Docker stack from the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md) must be running (the SDK's default endpoints are `wss://127.0.0.1:2090` / `ws://127.0.0.1:9944` / IPFS `5001`) |
| SDK access | `wallet-app-internal` is currently private — **contact us** to get access to the SDK sources/checkout used below |

## Step 1 — Create a fresh project

1. **Android Studio → New Project → Empty Views Activity** (Kotlin).
2. Name it anything (e.g. `MyFirstInterstellarApp`), package `com.example.myfirstinterstellarapp`.
3. **Minimum SDK: API 24** (the SDK requires `minSdk 23` or above).

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Android Studio "New Project" dialog with Empty Views Activity selected (to be captured)*

## Step 2 — Bring in the SDK

Request access to the `wallet-app-internal` repository, then copy these items **from its root into your project root**:

| What | Why |
| --- | --- |
| `shared/` | the SDK Gradle module (Kotlin API + its Rust sources under `shared/rust/`) |
| `Cargo.toml` | the Rust workspace manifest the module's build drives |
| `Cargo.lock` | pinned Rust dependencies |
| `rust-toolchain.toml` | pinned nightly toolchain |
| `.cargo/config.toml` | cargo env needed by the Rust build |

Your project root then looks like:

```
MyFirstInterstellarApp/
├── app/                    ← your app module
├── shared/                 ← the Interstellar SDK module (copied)
├── Cargo.toml              ← Rust workspace (copied)
├── Cargo.lock
├── rust-toolchain.toml
├── .cargo/config.toml
├── build.gradle.kts
└── settings.gradle.kts
```

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Project view showing `app/` + `shared/` + the copied Rust workspace files (to be captured)*

:::info Why these files
The SDK module compiles its **Rust core** (garbled circuits, chain clients) with `cargo` during the Gradle build — the workspace must live at your **project root** (the module's build scripts use the Gradle `rootDir` as the cargo workspace).
:::

## Step 3 — Wire up Gradle

**`settings.gradle.kts`** — include the module and add the repositories the SDK needs:

```kotlin
pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")   // needed by the SDK's Rust/KMP dependencies
    }
}
rootProject.name = "MyFirstInterstellarApp"
include(":app")
include(":shared")
```

**`app/build.gradle.kts`** — depend on the module and pick the ABI dimension:

```kotlin
android {
    namespace = "com.example.myfirstinterstellarapp"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.myfirstinterstellarapp"
        minSdk = 24
        targetSdk = 36
        // The SDK module ships per-ABI flavors: "x86_64" for emulators, "arm64" for devices.
        missingDimensionStrategy("abi", "x86_64")   // use "arm64" for a physical device
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation(project(":shared"))   // ← the Interstellar SDK
}
```

Let Gradle **sync** — the first sync/build compiles the Rust core (several minutes; subsequent builds are incremental).

## Step 4 — Initialize the SDK and show the root account ID

Replace `app/src/main/java/…/MainActivity.kt` with:

```kotlin
package com.example.myfirstinterstellarapp

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import gg.interstellar.wallet.InterstellarSdk
import gg.interstellar.wallet.InterstellarFileSharer
import gg.interstellar.wallet.SdkInitListener
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val textView = TextView(this).apply {
            setPadding(48, 48, 48, 48)
            setTextIsSelectable(true)
        }
        setContentView(textView)
        textView.text = "Initializing Interstellar SDK…"

        lifecycleScope.launch {
            try {
                val sdk = InterstellarSdk.create(
                    context = applicationContext,
                    fileSharer = object : InterstellarFileSharer {
                        // Only used by recovery-token export — not exercised in this hello-world.
                        override fun shareData(
                            data: ByteArray, fileName: String, mimeType: String, shareTitle: String,
                        ) { /* no-op */ }
                    },
                    listener = SdkInitListener {
                        // Server reset detected: returning here lets the SDK re-register.
                        // A real app shows a blocking warning dialog first.
                    },
                )
                val rootAccountId = sdk.getterRootAccount()
                textView.text =
                    "Root account ID:\n" + rootAccountId.joinToString("") { "%02x".format(it) }
            } catch (e: Exception) {
                textView.text = "SDK init failed: $e"
            }
        }
    }
}
```

What happens on first launch:

1. `create` generates a P-256 key in the **Android Keystore**,
2. registers the device/account on the Interstellar worker,
3. caches balances and the root account,
4. `getterRootAccount()` returns the **32-byte root account id**, displayed in hex.

## Step 5 — Run it against the local stack

1. Start the Docker stack (node `9944`, worker `2090`, IPFS `5001`) — see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md).
2. Plug in a device (or start an x86_64 emulator) and expose the local ports to it:

```bash
adb reverse tcp:2090 tcp:2090
adb reverse tcp:9944 tcp:9944
adb reverse tcp:5001 tcp:5001
```

3. **Run ▶** the app.

> 📷 **[SCREENSHOT PLACEHOLDER]** — *Emulator/phone running the hello-world app, screen showing "Root account ID:" followed by the 64-char hex id (to be captured)*

The same device key + root account survive app restarts (and iOS reinstalls, see the [iOS guide](../ios/getting-started.md)); the account appears in the stack's chain state — you can inspect it with [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9944).

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Gradle: "The project uses flavors but…" / dimension error | make sure `missingDimensionStrategy("abi", …)` is set (or add matching flavors) |
| `cargo: … can't find C compiler` / NDK errors | install **NDK 28.0.13004108**; the module selects it via `ndkVersion` |
| `rustc: the nightly toolchain is not installed` | `rustup toolchain install nightly` (or let `rust-toolchain.toml` drive it) + the two `rustup target add` above |
| App shows `SDK init failed: …` at start | the local stack isn't reachable — check Docker + `adb reverse` for **all three** ports |
| Init succeeds but no balances | expected for a fresh account — fund the coin address (see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md)) |

Next: [**API Reference**](./api-reference.md) and the [**VCA pinpad guide**](./pinpad.md).
