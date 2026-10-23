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
| Android SDK | `compileSdk 37` |
| **Rust / NDK / cargo** | **not needed** — the published AAR already ships the prebuilt native libraries (`arm64-v8a` + `x86_64`) |
| Interstellar stack | the local Docker stack from the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md) must be running (the SDK's default endpoints are `wss://127.0.0.1:2090` / `ws://127.0.0.1:9944` / IPFS `5001`) |
| SDK access | read access to the private [`wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) repo **+** a GitHub **classic** PAT with the `read:packages` scope — see [Get access to the SDK](#step-2--get-access-to-the-sdk) |

:::info Which artifact?
The SDK is published as a **private Maven package** on GitHub Packages:
`gg.interstellar.wallet:shared:<version>` (the KMP root metadata + the Android AAR).
The package inherits the visibility of the repository it is published from, so it stays private —
see [SDK access](../intro.md#status--scope-please-read) for the full story.

:::warning ⚠️ The package is not there yet
The publishing pipeline is implemented and CI-tested, but the package is published only when the
M6 release is cut. The repository URL below is the **final** one; the `<version>` is the
**planned** one — ask Interstellar for the current version and for the access to the private
repository.
:::
:::

## Step 0 — Install Android Studio and the Android SDK

::::warning Step 0 has not been tested end-to-end
The steps below describe a fresh-machine setup. The subsequent steps (creating the project, adding the SDK, running the app) have been tested on a **fresh Ubuntu 26.04 VM** with Android Studio installed through the **App Manager** (ie the Ubuntu **snap package**: `sudo snap install android-studio --classic`). That setup ships the SDK components the snap bundles, so your mileage on a clean machine may vary (the commands and links below are the canonical way).
::::

The iOS guide starts from "install Xcode + a simulator"; the Android equivalent is **Android Studio + the Android SDK**.

### 0.1 — Install Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio/install) (the *Koala* or newer stable release is fine).
2. Launch it once: the **setup wizard** installs the Android SDK (platform, build-tools, platform-tools) and offers to create an emulator.

### 0.2 — Check the SDK components

Open *Tools → SDK Manager* and make sure you have:

- an **SDK Platform** for the API level you target (`compileSdk 37` in the example below),
- **SDK Tools** and **Platform-Tools** (they provide `adb`).

:::note The NDK is **not** needed
The published AAR already contains the compiled Rust libraries (`arm64-v8a` + `x86_64`).
You only need the **NDK** if you build the SDK **from source** — see [Alternative](#alternative--build-the-sdk-from-source).
:::

### 0.3 — Create an emulator (or use a real device)

- *Tools → Device Manager → **＋** (Create Device)* → pick a hardware profile (e.g. *Pixel 8*) and a **system image** → finish.
- …or plug a real phone in with **USB debugging** enabled.

:::warning Emulator: use **API 35** or lower
The app **crashes in the emulator with API 36+** (it is not the 16KB page model — API 35 runs
fine with 16KB pages; API 36 may change low-level runtime behaviour for the Rust code). The
problem is **emulator-only**: the app has been **tested with Android 16 (API 36) on real
devices**. So pick the **API 35** system image — the current main dev image — for the emulator.
:::

### 0.4 — Sanity check

```bash
adb devices            # your emulator/device must be listed
```

## Step 1 — Create a fresh project

1. Launch **Android Studio**. From the landing page, click **New project** (you could also pick *Clone repository* to fetch an existing one, or *Open* to browse a local folder — we want a brand-new project here).

   ![Android Studio landing page with "New project", "Clone repository" and "Open"](/img/AS_LandingPage.png)

2. Pick the **Empty Views Activity** template in the project-type picker (don't pick *No Activity* or *Empty Activity* — the *Views*-flavoured one gives us a classic layout to edit in step 4).

   ![Project type picker with "Empty Views Activity" selected](/img/AS_ProjectTypePicker.png)

3. Fill in the new-project form:
   - **Name**: `My Application` (or anything you like, e.g. `MyFirstInterstellarApp`),
   - **Package name**: `com.example.myapplication` (auto-derived from the name),
   - **Language**: **Kotlin**,
   - **Minimum SDK**: **API 24** (the SDK requires `minSdk 24` or above),
   - leave everything else at its default.

   Then click **Finish**.

   ![New project dialog with default fields: "My Application", Kotlin, Min SDK 24](/img/AS_NewProjectConfig.png)

4. Wait for the template to materialise: the editor opens and **Gradle sync** starts in the background (progress shown in the status bar / Build window at the bottom). Let it finish before touching anything else — the SDK dependency added in the next step only resolves once the sync machinery is warm.

   ![Project template ready with Gradle sync in progress](/img/AS_GradleSync.png)

## Step 2 — Get access to the SDK

The SDK lives in a **private** repository, so you need two things.

### 2.1 — Read access to the repository

Ask Interstellar for read access to [`Interstellar-Network/wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal). Without it the Maven package is invisible to you (and so is the source, if you want to read it).

### 2.2 — A GitHub **classic** personal access token

GitHub Packages only authenticates with a **classic** PAT — fine-grained tokens are *not* supported. The official instructions are in
[Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens); the short version:

1. **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**.
2. Select the **`read:packages`** scope (that is all a consumer needs).
3. If the organisation enforces SAML SSO, click **Configure SSO** and authorize the token for `Interstellar-Network`.
4. Copy the token (`ghp_…`) — GitHub shows it only once.

### 2.3 — Give the token to Gradle

Put it in your **global** Gradle properties — `~/.gradle/gradle.properties` (never in the project, never in git):

```properties
gpr.user=<your-github-username>
gpr.key=ghp_…your-classic-token…
```

`gpr.user` is your GitHub **username** (not your email, not the org name). The environment variables `GITHUB_ACTOR` / `GITHUB_TOKEN` work too if you prefer them.

> ⚠️ **The Maven URL owner is lowercase.** GitHub requires `maven.pkg.github.com/interstellar-network/…` even though the organisation is `Interstellar-Network`. See [Working with the Gradle registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-gradle-registry).

## Step 3 — Wire up Gradle

**`settings.gradle.kts`** — add the GitHub Packages repository (it is the only extra one; the SDK's own dependencies come from `google()` and `mavenCentral()`):

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
        maven {
            name = "GitHubPackages"
            // NOTE: the owner MUST be lowercase, even though the org is "Interstellar-Network"
            // The final URL of the (private) GitHub Packages registry of the repo.
            url = uri("https://maven.pkg.github.com/interstellar-network/wallet-app-internal")
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                    ?: providers.environmentVariable("GITHUB_ACTOR").orNull
                password = providers.gradleProperty("gpr.key").orNull
                    ?: providers.environmentVariable("GITHUB_TOKEN").orNull
            }
        }
    }
}
rootProject.name = "MyFirstInterstellarApp"
include(":app")
```

**`app/build.gradle.kts`** — depend on the SDK:

```kotlin
android {
    namespace = "com.example.myfirstinterstellarapp"
    compileSdk = 37

    defaultConfig {
        applicationId = "com.example.myfirstinterstellarapp"
        minSdk = 24
        targetSdk = 37
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.19.1")
    implementation("androidx.appcompat:appcompat:1.8.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.11.0")
    // ⚠️ the version is the planned one — ask Interstellar for the current one.
    implementation("gg.interstellar.wallet:shared:<version>")   // ← the Interstellar SDK
}
```

**`gradle.properties`** (project level) — the AAR is big (it embeds two native ABIs), so give the Gradle daemon enough heap:

```properties
org.gradle.jvmargs=-Xmx2048M
```

:::info No ABI juggling needed
The published AAR contains **both** `arm64-v8a` (real devices) and `x86_64` (emulators), so there is no `missingDimensionStrategy("abi", …)` to set — the same APK runs everywhere.
:::

Let Gradle **sync** — the first sync downloads the SDK and its dependencies.

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

## Alternative — build the SDK from source

If you have the `wallet-app-internal` repository checked out, you can consume the SDK **without**
the private Maven registry at all. There are two ways — pick the one that fits what you are doing.

### A. A composite build (no publish at all)

The SDK is a Gradle module of that repository, so you can **include the whole checkout as a
composite build** and let Gradle resolve `gg.interstellar.wallet:shared` to the local project.

**`settings.gradle.kts`**

```kotlin
includeBuild("<path-to>/wallet-app-internal") {
    dependencySubstitution {
        // any requested version resolves to the local :shared project
        substitute(module("gg.interstellar.wallet:shared")).using(project(":shared"))
    }
}
```

**`app/build.gradle.kts`** — the dependency stays the same:

```kotlin
dependencies {
    implementation("gg.interstellar.wallet:shared:<version>")
}
```

This is the **closest to "just consume the clone"**: the Rust build runs inside the checkout (the
cargo workspace lives at the *root* of the `wallet-app-internal` Gradle build), so you do not have
to move any file around.

### B. Publish to a local Maven repository

The other way is to let the SDK publish **itself** to a local Maven folder, and to consume it
exactly like the published artifact (same coordinates, same POM, same transitive dependencies):

```bash
# in the wallet-app-internal checkout
./gradlew :shared:publishSdkToLocalTest -Psdk.version=0.1.0-local
# → shared/build/local-maven/gg/interstellar/wallet/shared/…
```

Then add the repository to `settings.gradle.kts`:

```kotlin
repositories {
    google()
    mavenCentral()
    maven {
        name = "localSdk"
        url = uri("<path-to>/wallet-app-internal/shared/build/local-maven")
    }
}
```

```kotlin
dependencies {
    implementation("gg.interstellar.wallet:shared:0.1.0-local")
}
```

:::tip When to use which?
- **A (composite build)** — you are **patching** the SDK: the sources are rebuilt on every build,
  no intermediate artifact.
- **B (local Maven)** — you want to check that the **published** artifact is complete (the POM
  carries the transitive metadata: JNA, Compose, …). This is exactly what the CI's
  [SDK consumer smoke test](https://github.com/Interstellar-Network/wallet-app-internal) does
  with `sdk-consumer/`.
:::

:::warning Both need the Rust toolchain
Building the SDK from source needs **Rust nightly**, the **Android NDK** and the cargo Android
targets (`rustup target add aarch64-linux-android x86_64-linux-android`). Prefer the published
artifact unless you want to patch the SDK.
:::

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Could not find gg.interstellar.wallet:shared:<version>` | the GitHub Packages repository is missing or the credentials are wrong — check the URL (lowercase owner!), `gpr.user` / `gpr.key` in `~/.gradle/gradle.properties`, and that your token has `read:packages` **and** SSO authorization |
| `401 Unauthorized` / `403 Forbidden` | your token is missing the `read:packages` scope, or it was not authorized for the org's SSO, or you have no read access to the private repo |
| `Received status code 402` while publishing (maintainers) | the organisation's GitHub Packages budget is exhausted — see the [Packages billing docs](https://docs.github.com/en/billing/concepts/product-billing/github-packages) |
| `OutOfMemoryError` / D8 dex merge fails | raise `org.gradle.jvmargs` to `-Xmx2048M` in the project's `gradle.properties` |
| App shows `SDK init failed: …` at start | the local stack isn't reachable — check Docker + `adb reverse` for **all three** ports |
| Init succeeds but no balances | expected for a fresh account — fund the coin address (see the [M6 tutorial](../../Milestones/M6/local-demo-with-docker.md)) |

Next: [**API Reference**](./api-reference.md) and the [**VCA pinpad guide**](./pinpad.md).
