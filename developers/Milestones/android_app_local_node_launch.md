# Launch the Interstellar Stack with the Demo App

This guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar demo app** — on **Android** (APK or emulator) or on **iOS** (Simulator).

This setup enables full offline testing without relying on a hosted VPS.


:::info Tested Environment
This compatibility note applies to the **backend stack**, tested on Ubuntu 24.04 LTS (x86_64) using Docker (`docker-compose`) or Podman (with manually installed `podman-compose`*).  
The stack is expected to work on other recent Linux distributions, but this has not been officially verified.

Known issue: May fail on Apple Silicon (M1/M2/M3/M4) - due to current SIMD usage and QEMU/Rosetta limitations - crash on M1/M2 (not tested on M3/M4)

The **frontend** can run on any OS supported by Android Studio (Android emulator or physical device — expect some emulator limitations on Apple Silicon), and the demo app also runs in the **iOS Simulator** on macOS

*Compose tools are required to manage service startup dependencies (e.g., health checks).
:::


## 1. Prerequisites

| Requirement        | Install Guide |
|--------------------|----------------|
| Docker             | [Install Docker](https://docs.docker.com/engine/install/) |
| Docker Compose     | [Install docker-compose](https://docs.docker.com/compose/install/) |
| `curl`, `wget`, `jq` | Installed via `apt`/`brew` or default in most environments |
| GitHub access | read access to the **private** [`containers`](https://github.com/Interstellar-Network/containers) repo + a GitHub **classic** PAT — see [Get access to the private repositories](#get-access-to-the-private-repositories) |
| Android Studio     |  [Install Android Studio](https://developer.android.com/studio) |
| ADB (`adb reverse`) | Comes with Android Studio |
| Xcode | [Install Xcode](https://apps.apple.com/app/xcode) — iOS only (to install the app in the iOS Simulator) |

> You may also use **Podman** as an alternative to Docker.

## 2. Launch the Interstellar Stack Install 

### Get access to the private repositories

:::warning The `containers` repository is **private**
The stack files (`docker-compose.yml`, `docker-ipfs-init.sh`, …) live in the **private**
[`Interstellar-Network/containers`](https://github.com/Interstellar-Network/containers) repository.
The download commands in this section return **HTTP 404** until you have read access to that
repository and a GitHub personal access token — get both first (steps below).
:::

#### Read access to the private repositories

Two **private** repositories are involved in this guide:

- [`Interstellar-Network/containers`](https://github.com/Interstellar-Network/containers) — hosts the stack files **and** the container images. **Every** reader of this guide needs read access.
- [`Interstellar-Network/wallet-app-internal`](https://github.com/Interstellar-Network/wallet-app-internal) — hosts the SDK sources and their registries (the Android Maven package, the iOS GitHub release). Only needed if you also integrate the SDK — see the [Android](/developers/SDK/android/getting-started) and [iOS](/developers/SDK/ios/getting-started) getting-started guides.

Ask Interstellar for read access to the repository (or repositories) you need.

#### A GitHub **classic** personal access token (required to run the stack)

Running the stack needs **two** private things from GitHub — and one of them forces the token type:

| What | Where | Scope / token type |
| --- | --- | --- |
| The **stack files** (`docker-compose.yml`, …) | private `containers` repository | any read access (see the two download options below) |
| The **container images** (`ghcr.io/interstellar-network/containers/…` pulled by `docker compose up`) | **ghcr.io** = GitHub Packages | **classic** PAT with **`read:packages`** — fine-grained tokens are *not* supported ([official docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-gradle-registry#authenticating-to-github-packages)) |

So a **classic** PAT is needed **no matter what** — `docker` must log in to ghcr.io to pull the images.

:::note Planning to integrate or test the **Android SDK**?
This **same** classic PAT (`read:packages`) is what the [Android SDK integration](/developers/SDK/android/getting-started#step-2--get-access-to-the-sdk) uses for the GitHub Packages **Maven registry** — one token covers both the local stack and the SDK.
:::

1. **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**.
2. Select the **`read:packages`** scope (that is all a consumer needs).
3. If the organisation enforces SAML SSO, click **Configure SSO** and authorize the token for `Interstellar-Network`.
4. Copy the token (`ghp_…`) — GitHub shows it only once.
5. Log in to the container registry so `docker compose` can pull the private images:

   ```bash
   echo "ghp_…your-classic-token…" | docker login ghcr.io -u <your-github-username> --password-stdin
   ```

For the **stack-file downloads** you have two options (see below):

- **`git`** (option 1) — uses whatever GitHub auth you already have on your machine; **no extra token needed**.
- **`curl`** (option 2) — needs a **fine-grained** token with **`Contents: read`** on the
  `containers` repository:

  1. **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
  2. **Repository access**: `Interstellar-Network/containers`.
  3. **Permissions → Repository permissions → Contents**: `Read-only` (metadata comes implicitly).
  4. Copy the token (`github_pat_…`) — GitHub shows it only once.

  ⚠️ Do **not** widen the classic PAT above with the `repo` scope to get file access — `repo`
  grants **full read/write to all your repositories**. The fine-grained token is the
  least-privilege way to download the files.

:::info BTC RPC API Key  
The BTC worker connects to a **Bitcoin Testnet RPC endpoint** using a hosted provider.  
For simplicity, we provide curators with a ready-to-use `.env` file.  

Place the file in the **same directory** as `docker-compose.yml`.  

⚠️ Ask us directly for an updated `.env` file.
:::

The stack config lives in the **private** [`containers`](https://github.com/Interstellar-Network/containers) repository — fetch the two files of the milestone tag using **one** of the two options below. **Both options end up in the same working directory** (`interstellar_m[x]_demo`), so the next steps (`.env`, `docker compose up`) are identical either way.

**Option 1 — `git` (simple, if you have a full dev environment already set up)**

Just clone with your **existing** GitHub setup (SSH key, `gh auth login`, credential helper…):

```bash
# shallow clone at the milestone TAG — `git clone --branch` accepts tags too
# (the clone ends in "detached HEAD" state at the tag, which is what we want)
git clone --depth 1 --branch testnet-m6-v1 https://github.com/Interstellar-Network/containers interstellar_m[x]_demo
cd interstellar_m[x]_demo
chmod +x docker-ipfs-init.sh
```

**Option 2 — `curl` + http auth with a fine-grained PAT**

Use the fine-grained token created above ([A GitHub personal access token](#a-github-classic-personal-access-token-required-to-run-the-stack)):

```bash
mkdir interstellar_m[x]_demo && cd interstellar_m[x]_demo
GITHUB_TOKEN=github_pat_…your-fine-grained-token…
curl -L -H "Authorization: Bearer $GITHUB_TOKEN" -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6-v1/docker-compose.yml
curl -L -H "Authorization: Bearer $GITHUB_TOKEN" -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m6-v1/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh
```

**Step 2 — Place the `.env` file (applies to BOTH options above)**

Place the `.env` file we send you in the working directory — next to `docker-compose.yml`.
It is **NOT** part of the private `containers` repository, so **neither** `git clone` **nor** `curl`
fetches it — you must copy it there yourself.

> Specific for the current Milestone delivery — previous `.env` files should not be reused.

**Step 3 — Start Docker (if needed)**

```bash
sudo service docker start  # (for most Linux distros)
```

**Step 4 — Launch the stack**

```bash
sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate
```

### ⏳ Waiting for Master Circuit Generation

Once the node and service are running, the system will automatically trigger the **generation of master circuits** from the hardware description files.

These circuits are compiled using the Verilog logic generated from the original master circuits specifications, processed through the logic synthesis pipeline. This step may take several minutes depending on the environment.

During this time, monitor the logs and wait for the following sequence of messages:

```bash
[ocw-circuits] callback_new_skcd_signed sent number : <number> 1-Success  - 0-Fail
[ocw-circuits] callback_new_display_circuits_package_signed: (<CID_1>, <message_digits_number>), (<CID_2>, <pinpad_digits_number>) for <account_id>
```
Shortly before these messages, you will also see large blob uploads to IPFS such as:
```bash
Requested started id=<...> method=POST uri=http://ipfs:5001/api/v0/add
```
These blobs correspond to the master visual circuits (SKCD display circuits), which are the result 
of the hardware synthesis pipeline. Their appearance in the logs is a strong indicator 
that the build process has completed.

> ℹ️ You can identify this moment easily by spotting two large IPFS file hashes being 
> logged together — one for the secure keypad circuit and one for the display message circuit 
> i.e one time code These hashes will later be used for visual challenge rendering and validation.

Detailed example from `integritee_node-1` 
```bash
Requested started id=1059 method=POST uri=http://ipfs:5001/api/v0/add
[fetch_from_remote_grpc_web] content_type: application/json
[ocw-circuits] callback_new_skcd_signed sent number : 1
[ocw-circuits] callback_new_display_circuits_package_signed: ("QmUx8mMo8GgGdUhcgFQVg2sexkVfyq1sViruZiBadUfs4d",2),("QmcwXyZNmLXnjeoA25YSzj41G1sr6ZsHgZZBQVWvcfe1qn",10) for d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d (5GrwvaEF...)
```

```
[ocw-circuits] Hello from pallet-ocw-circuits.
🛌 Idle (0 peers), best: #6 (...), finalized #3 (...), ⬇ 0 ⬆ 0
```
:::info VCA System Layer

While waiting for the stack to fully initialize, you can explore the architecture and rationale behind 
the **[VCA System Layer](/developers/category/vca-system-layer)**. This layer is responsible for producing the `VCA Token`, 
the core cryptographic artifact used by the Trusted Action Validation Protocol (`TAVP`).

The token is generated through a hardware-secure pipeline starting from VHDL logic descriptions, synthesized into 
Verilog and compiled using the`Yosis` and `abc` logic synthesis toolchain. The resulting master circuits define both the secure display and interaction logic — including the Secure Circuit Descriptor (`scd`) and its runtime variant, `skcd`, used for verifiable evaluation.

Once built, these circuits are uploaded to IPFS and used to enable real-time, **privacy-preserving visual cryptographic** 
**challenges**, ensuring each critical **user interaction** is verifiable and **resistant to malware, phishing, and adversarial AI**.

:::


## 3. Install the Demo App

Both demo apps are **preconfigured to connect to `localhost`** — the local stack launched in section 2.

:::warning The **same** build on every channel — and it needs the **local** stack
The APK you get from the **GitHub release** or from **Firebase App Distribution**, and the iOS
`.app` you get from the **GitHub release** — are all **the very same builds**: they are configured
for the **local dev stack** (`wss://127.0.0.1:2090`, `ws://127.0.0.1:9944`, IPFS
`127.0.0.1:5001`), **not** for a hosted testnet.
So: **start the stack first** (section 2), install the app (below) and expose the stack ports to
the device/emulator (section 4).
:::

### Android

#### Download the APK

Download the APKs from the current milestone's GitHub release — e.g. the [M6 v1 release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1) (APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices and Apple Silicon(M1/M2/M3/M4)
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

> **Latest version recommended** — the `m6-v1` release ships the current APKs (both architectures); new versions follow each release — check the [releases page](https://github.com/Interstellar-Network/wallet-app-internal/releases).

:::tip Recommended Test Setup – Hardware & Emulator Guidance

While the app runs on Apple Silicon (M1–M4), emulator performance may vary due to ARM virtualization and GPU constraints. For accurate testing—especially for Rust-based rendering and cryptographic logic—choose the best available setup:

| Recommended Option             | Notes                                                                 |
|-------------------------------|-----------------------------------------------------------------------|
| Mid-to-high-end ARM device     | **Preferred**. e.g., Pixel 5–Pixel 8. **Tested with Android 16 (API 36)** — the API 36 crash is emulator-only (see below). |
| x86_64 emulator (Intel)        | Reliable with mid-range or better GPU.                                |
| Apple Silicon (M3/M4) emulator | Acceptable if GPU is sufficient. Better than M1/M2 for rendering.     |
| Apple Silicon (M1/M2) emulator | Works, but may show degraded performance or rendering issues.         |

:::

:::warning App reinstall required

If you already have an older version of the Interstellar Android app installed, **you must uninstall it before installing the new build**.

The app uses local secure storage and cached configuration; keeping a previous version may lead to inconsistent behavior during transaction signing or validation.

:::




#### Option 1: Physical Device

1. Transfer the APK to your phone or download it directly from the device 
2. Allow app installation from external sources
3. Install the APK
5. [Connect](https://developer.android.com/codelabs/basic-android-kotlin-compose-connect-device#2) your devices to Android Studio

:::info if you need more details
[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)
:::
:::warning
Ensure that your device is configured for **english** language
:::
#### Option 2: Emulator

1. [Create](https://developer.android.com/studio/run/managing-avds#createavd)  a `Pixel 7` or equivalent emulator with the **API 35** system image (`x86_64`)
2. Edit the emulator and make sure the API level is **35 or lower** — API 36+ crashes in the emulator (see the note below)
<img src="/img/API34.png" alt="API 34"  width="250"/>

3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

:::info Compatibility: API 36 crashes in the **emulator**
The app currently **crashes in the emulator with API 36+**. The issue is **not caused by the new
16KB memory page model** — it runs correctly on API 35 with 16KB pages. API 36 is a **very
recent release** and may introduce subtle runtime or platform-level changes that affect
low-level Rust code (e.g. the garbled-circuit evaluator or the frame renderer).

**Hardware devices are fine**: the app has been **tested with Android 16 (API 36)** on real
phones — the problem is **specific to the emulator**.

Until further investigation, **use API 35 (the current main dev image) or lower for the
emulator**.
:::

:::note Software Rendering Required on Apple Silicon (M1/M2)

On Apple Silicon (M1–M4), emulators may fail to render or execute low-level native code correctly unless software rendering is enabled.

To enable it:

> **Device Manager → Edit → Advanced Settings → Emulated Performance → Graphics → Software**

<img src="/img/emul_software.png" alt="Software rendering setting in Device Manager" width="400"/>

- **Mandatory for M1/M2**: hardware acceleration is not supported and cause crashes.
- **Not tested on M3/M4**: may support hardware acceleration, but software mode is safer for compatibility.

Enabling this setting ensures more reliable emulator behavior, especially for native Rust or cryptographic rendering, at the cost of some performance.

:::

:::info Or: install from Firebase App Distribution (Android)
The same build is also distributed through **Firebase App Distribution** — installs straight from
the browser, device only. See [App Distribution — Android & iOS](/developers/Milestones/M6/components_delivered/app_distribution).
:::

### iOS

iOS does **not** use Firebase: the app is archived with `xcodebuild`, exported and uploaded to
**App Store Connect**, where it shows up in **TestFlight**. Since **TestFlight only delivers to
real devices**, the current release offers **two** channels — the direct zipped `.app` download
(available now) and **TestFlight** (⚠️ the TestFlight account is approved but the setup is
**still pending**, so the build is **not** available there yet):

:::info Why is the Simulator build a zip?
Unlike an Android APK — a single binary file — an iOS `.app` is a **folder**, so it cannot be
downloaded and installed as-is: it is packaged as a **zip** (`iosApp-Simulator.app.zip`), which
you unzip before installing (steps in the table below).
:::

| What you want | Channel | What you do |
| --- | --- | --- |
| Run the app in the **iOS Simulator** | direct `.app` download | download the zipped `.app` from the [M6 v1 release](https://github.com/Interstellar-Network/wallet-app-internal/releases/tag/m6-v1) eg "iosApp-Simulator.app.zip", unzip it, then in Xcode *Device > Install Simulated Package…* (or `xcrun simctl install booted <app>.app`) |
| Run the app on a **real device** | **TestFlight** ⚠️ **pending setup** | install the **TestFlight** app, accept the invitation, then install the build — ⚠️ **not available yet** for this release (account approved but setup pending, see [App Distribution](/developers/Milestones/M6/components_delivered/app_distribution)) |

:::warning Real devices vs the local stack
The build is preconfigured to reach the stack at `127.0.0.1` — on a **real device**, that is the
device itself, so the local stack running on your computer is **not** reachable this way. Use the
**iOS Simulator** channel for local-stack testing.
`TODO(#328)`: document the real-device story (hosted stack or port forwarding) if/when relevant.
:::

Full details (and what the maintainer does to publish): [App Distribution — Android & iOS](/developers/Milestones/M6/components_delivered/app_distribution).

---

## 4. Link App to your local Interstellar stack:

The demo app is preconfigured to connect to `localhost`
To allow the demo app to connect to your local blockchain and IPFS stack:

### Step 0: iOS Simulator — no forwarding needed

The **iOS Simulator runs on your computer** and reaches `127.0.0.1` natively — **no `adb reverse`
or port forwarding is needed**. The steps below apply to the **Android** device/emulator.

### Step 1: `adb reverse` Setup
> **On** the **Desktop** connected to the **Device** or running the **Emulator** 
(Windows, Mac OS, Linux)

If Android Studio is already installed, you can enable adb in your terminal 
by adding it to your PATH with the following command (adjust the path if needed):

**Add `adb` PATH:** 

Linux:
```bash
export PATH=$PATH:$HOME/Android/Sdk/platform-tools
```
Mac OS:
```bash
export PATH="$HOME/Library/Android/sdk/platform-tools:$PATH"
```
Windows powershell:
```powershell
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

```bash
adb reverse tcp:9944 tcp:9944   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Worker trusted port
adb reverse tcp:5001 tcp:5001   # IPFS

```
:::warning Troubleshooting
Make sure `adb` is properly configured and the emulator or device is detected
 with `adb devices`

 
 You can also check the reverse setup with `adb reverse --list`
:::

> This works for both emulators and real devices connected via USB

### Step 2 (optional): `ssh` Port Forwarding 
> **On** the **System** or **VM** running the **Blockchain stack** (WSL2, Remote VM)

If the emulator is running (or the device is connected) on a different network interface than the backend 
(e.g., the backend runs in WSL2 and the Android emulator or device is connected 
via USB to Windows), 
you may need to configure port forwarding between the desktop and the blockchain.

**WSL2 -> Windows example:**
```bash
export WSL_HOST_IP=$(ip route | awk '/default/ {print $3}')
```
```bash
ssh -N -R 9944:localhost:9944 -R 5001:localhost:5001 -R 2090:localhost:2090 [windows_user_name]@$WSL_HOST_IP
```

:::warning Troubleshooting: Firewall potential issue

To avoid issues with `ssh` or `adb reverse` during this local test, you can temporarily disable the Firewall:

**Example on Windows with PowerShell (as Administrator):**
```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled False
```
**You can re-enable it later with:**
```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
```
:::info


At this stage, the focus is on ensuring correctness and robustness of the transaction pipeline at the infrastructure level. User-facing aspects such as **application UI/UX**, **visual polish**, or **cosmetic design** are not yet part of the milestone scope. Especially because our focus is the delivery of a mobile SDK.   
:::  

---

