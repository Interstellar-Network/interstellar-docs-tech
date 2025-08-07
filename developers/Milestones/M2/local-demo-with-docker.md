---
sidebar_label: 'Android App with Local Node'
sidebar_position: 1
---

# Android App with Local Nodes

This guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar Android demo app**.

This setup enables full offline testing without relying on a hosted VPS.

:::note Milestone 2 Scope
This milestone delivers the core transaction signing capabilities of the Interstellar platform for multiple blockchains coins: DOT, ETH, BTC, SOL.

All features have been **extensively tested with a focus on user experience**, demonstrating how simple, reliable, and intuitive these flows can be. The current interface has been **adjusted to support efficient testing**, while leaving room for further UX and UI refinements in the production-grade SDK.

Although the system is **not yet production-ready**, it provides a robust foundation. 
Broader edge case coverage, interoperability, and resilience guarantees will be the focus 
of the upcoming SDK and future milestones. 
Reviewers are encouraged to **focus on the functional flow and experience** of the key features in this milestone.
:::


:::info Tested Environment
This compatibility note applies to the **backend stack**, tested on Ubuntu 24.04 LTS (x86_64) using Docker (`docker-compose`) or Podman (with manually installed `podman-compose`*).  
The stack is expected to work on other recent Linux distributions, but this has not been officially verified.

Known issue: May fail on Apple Silicon (M1/M2/M3/M4) - due to current SIMD usage and QEMU/Rosetta limitations - crash on M1/M2 (not tested on M3/M4)

The **frontend** (e.g., Android emulator or physical device) 
can run on any OS supported by Android Studio (expect some emulator limitations on Apple Silicon)

*Compose tools are required to manage service startup dependencies (e.g., health checks).
:::



## 1. Prerequisites

| Requirement        | Install Guide |
|--------------------|----------------|
| Docker             | [Install Docker](https://docs.docker.com/engine/install/) |
| Docker Compose     | [Install docker-compose](https://docs.docker.com/compose/install/) |
| `curl`, `wget`, `jq` | Installed via `apt`/`brew` or default in most environments |
| Android Studio     |  [Install Android Studio](https://developer.android.com/studio) |
| ADB (`adb reverse`) | Comes with Android Studio |

> You may also use **Podman** as an alternative to Docker.

## 2. Launch the Interstellar Stack Install 
```bash
# Step 1: Create a working directory
mkdir interstellar_m1_demo && cd interstellar_m1_demo

# Step 2: Download the stack config
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/main/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/main/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh

# Step 3: Start Docker (if needed)
sudo service docker start  # (for most Linux distros)

# Step 4: Launch the stack
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
You can also verify the runtime is ready using [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)

:::info VCA System Layer

While waiting for the stack to fully initialize, you can explore the architecture and rationale behind 
the **[VCA System Layer](/developers/category/vca-system-layer)**. This layer is responsible for producing the `VCA Token`, 
the core cryptographic artifact used by the Trusted Action Validation Protocol (`TAVP`).

The token is generated through a hardware-secure pipeline starting from VHDL logic descriptions, synthesized into 
Verilog and compiled using the`Yosis` and `abc` logic synthesis toolchain. The resulting master circuits define both the secure display and interaction logic — including the Secure Circuit Descriptor (`scd`) and its runtime variant, `skcd`, used for verifiable evaluation.

Once built, these circuits are uploaded to IPFS and used to enable real-time, **privacy-preserving visual cryptographic** 
**challenges**, ensuring each critical **user interaction** is verifiable and **resistant to malware, phishing, and adversarial AI**.

:::


## 3. Install the Android Demo App

### Download the APK

From the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/containers/releases/tag/testnet-m1) (specific APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices and Apple Silicon(M1/M2/M3/M4)
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

:::tip Recommended Test Setup – Hardware & Emulator Guidance

While the app runs on Apple Silicon (M1–M4), emulator performance may vary due to ARM virtualization and GPU constraints. For accurate testing—especially for Rust-based rendering and cryptographic logic—choose the best available setup:

| Recommended Option             | Notes                                                                 |
|-------------------------------|-----------------------------------------------------------------------|
| Mid-to-high-end ARM device     | **Preferred**. e.g., Pixel 5–Pixel 8. Avoid Android 16 (API 36) for now. |
| x86_64 emulator (Intel)        | Reliable with mid-range or better GPU.                                |
| Apple Silicon (M3/M4) emulator | Acceptable if GPU is sufficient. Better than M1/M2 for rendering.     |
| Apple Silicon (M1/M2) emulator | Works, but may show degraded performance or rendering issues.         |

:::


### Option 1: Physical Device

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
### Option 2: Emulator

1. [Create](https://developer.android.com/studio/run/managing-avds#createavd)  a `Pixel 7` or equivalent emulator `API 31+` - `API 35` 
2. Edit the emulator and select an API 31+ below the default API 36
<img src="/img/API35.png" alt="API 35"  width="250"/>

3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

:::info Compatibility Issue with API 36
Our app currently crashes on Android API 36. The issue is **not caused by the new 16KB memory 
page model**, as it runs correctly on API 35 with 16KB pages. 
API 36 is a **very recent release** and may introduce subtle runtime or platform-level changes 
that affect low-level Rust code (e.g., garbled circuit evaluator or frame renderer). 
Until further investigation, **we recommend using API 35 or earlier for testing.**
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




---

## 2. Link App to your local Interstellar stack:

The Android app is preconfigured to connect to `localhost`
To allow the Android app to connect to your local blockchain and IPFS stack:

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
adb reverse tcp:2090 tcp:2090   # Integritee node port
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
:::

## 4. Run the Android App Demo

### Step 1: Connect & Onboard
- **Launch the app**
  - Register a new mobile account
  - Validate biometric & SE-based registration
- Check toasted messages
  - **Registering**
  - **Registered**

### Step 2: Test Transaction Validation

- Trigger the **Trusted Action Validation Protocol (TAVP)** screen

  - Send a test transaction to a contact
<div style={{ textAlign: "center" }}>
  <img src="/img/Send_Currency_Demo.gif" alt="wallet menu" width="200"/>
</div>

  - Enter the one-time code (2-digit), or experiment with trial/feedback
  - Check toasted messages whith Action Validation Screen
    - **Creating a demo transaction...**
    - [error] No circuits available after 10s; exiting!
    - [after taping one-time code digits]
    - **Validating transaction...**
    - **Transaction done!**

:::warning Low-end devices and emulator limitations
If you are using an emulator with low-end GPU, or a low-end or outdated Android device with limited GPU, the user experience may be significantly degraded. 
Although the validation screen may be harder to read in such conditions, 
you should still be able to complete the test process.
:::

:::info FUTURE ENHANCEMENT
In the future, we plan to introduce a **trusted beneficiary** feature. This will enable users 
to register known recipient addresses on-chain through a secure validation process, preventing attackers from substituting contact names with malicious public keys. This enhancement will make the wallet both more secure and user-friendly.
:::


TO POTENTIALLY REUSE WITH OTHERS IMAGE

<div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/initial_backup.png" alt="initial backup" width="200"/>
    <figcaption>Initial Backup</figcaption>
  </figure>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/vca.png" alt="+ vca" width="200"/>
    <figcaption>+ CLOUD BACKUP added</figcaption>
  </figure>
</div>
  

<div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/vca_nfc.png" alt="vca+nfc items" width="200"/>
    <figcaption>CLOUD BACKUP + NFC Item</figcaption>
  </figure>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/threshold_changed.png" alt="threshold changed" width="200"/>
    <figcaption>Threshold Changed</figcaption>
  </figure>
</div>
---


> 🛠️ You can check the logs from your local stack to see whtat happen begind the hood when you interact with the blockchain: `extrinsics` sent






## Interpreting Logs

When interacting with the mobile app (e.g., authentication, transaction validation, recovery),
 key log messages are printed by both `integritee-node` and `integritee-service`. 


### Trusted Action Validation Highlight
 These logs help verify that **Trusted Action Validation** flows used both in transaction validation and recovery are working as expected.

### Key messages to look for:

#### Challenge screen rendering (garbled circuit evaluation):

```bash
[tx-validation] store_metadata_aux: message_digits = [9, 7], pinpad_digits = [8, 4, 6, 7, 3, 1, 5, 2, 9, 0]
```

#### Succesfull or Failed Validations (timing or incorrect code touchscreens positions)

- If you enter an invalid code:
  ```
  [tx-validation] TxFail
  ```
- If correct:
  ```
  [tx-validation] TxPass
  ```


### 🛠️ Mobile Registration

This log trace shows what happens when a new device connects to the system and is not yet registered under a root account. The backend detects the missing account and proceeds with registration:

```bash
[INFO  pallet_mobile_registry::pallet] ensure_has_root_account failed for  while checking if registered: Module(ModuleError { index: 16, error: [0, 0, 0, 0], message: Some("RootAccountNotFound") })  
[DEBUG pallet_mobile_registry::pallet] register_mobile start for    
[DEBUG pallet_mobile_registry::pallet] register_mobile: new registration for   
[DEBUG pallet_mobile_registry::pallet] register_mobile end  
```
---

#### ✅ What to Look For

- `RootAccountNotFound`: expected on first connection from a new mobile identity.
- `register_mobile start` → `register_mobile end`: confirms that registration was initiated and completed.
- These logs confirm that the system automatically falls back to registering the mobile when not yet linked to a root account.

:::info more details
Learn more on **[Account Abstraction Layer](/developers/category/aa-layer)**
:::

### 🛠️ VCA Token Generation and Metadata Preparation

The following logs represent the backend activity triggered by a mobile app requesting a new secure visual validation 
i.e `VCA token` generation. This includes:

- Garbled circuit rendering for the transaction or sensitive action display.
- Selection of digits and randomized pinpad.
- Storage of metadata used later for user input touchscreen validation.

You should see logs similar to the following:
```bash
[INFO  pallet_ocw_garble::pallet] [ocw-garble] garble_and_strip_display_circuits_package_signed: ("TRANSACTION AMMOUNT to DESTINATION" for )  
[WARN  pallet_ocw_garble::pallet] get_ocw_circuits_storage_value: storage COULD NOT be read! Fallback to RPC...  
[INFO  pallet_ocw_garble::pallet] get_ocw_circuits_storage_value response : <wasm:stripped>  
[INFO  pallet_ocw_garble::pallet] display_circuits_package: ("Qmaq13hbrSK7th8kA6CyP5cfviMshv46ZzxZ63aRopvpgF",2) ("QmR9DRACkkgwmyoSNGVX9m54AGZ6mkGkAGxwCLXMzi4aUP",10)  
[INFO  pallet_ocw_garble::pallet] pinpad_digits: [6, 2, 5, 4, 1, 9, 7, 3, 8, 0], message_digits: [5, 9]  
[INFO  pallet_ocw_garble::pallet] callback_new_garbled_and_strip_signed: "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w" ; "QmSDGvEFH2sDnNg5zCA4Nr4Zd3mByYs9Mmg994DWL8yiK6" for  
[INFO  pallet_tx_validation::pallet] store_metadata_aux: message_pgarbled_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", message_digits = [5, 9], pinpad_digits = [6, 2, 5, 4, 1, 9, 7, 3, 8, 0]  
[INFO  pallet_tx_validation::pallet] store_metadata_aux: done!  
[INFO  pallet_ocw_garble::pallet] callback_new_garbled_and_strip_signed: done!   
```
---

#### ✅ What to Look For

- `display_circuits_package:` confirms the transaction display garbled circuit has been rendered.
- `message_digits` and `pinpad_digits`: the random digits selected for the user's challenge.
- `store_metadata_aux: done!`: metadata was correctly stored for later validation.
- `callback_new_garbled_and_strip_signed: done!`: confirms generation and signing succeeded.


### 🛠️ Visual Cryptographic Challenge Validation
When the user correctly responds to the visual cryptographic challenge through 
`VCA token` evaluation on the mobile, the following logs will appear 
in the integritee_service container. 
These confirm that the digits were correctly interpreted and that the result was successfully committed:
```bash
[INFO  pallet_tx_validation::pallet] [tx-validation] check_input: who = , ipfs_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", input_digits = [2, 5]
[INFO  pallet_tx_validation::pallet] [tx-validation] check_input: input_digits_str = "\u{2}\u{5}", input_digits_int = [2, 5], pinpad_permutation = BoundedVec([6, 2, 5, 4, 1, 9, 7, 3, 8, 0], 10)
[INFO  pallet_tx_validation::pallet] [tx-validation] check_input: computed_inputs_from_permutation = [5, 9], message_digits = BoundedVec([5, 9], 10)
[INFO  pallet_tx_validation::pallet] [tx-validation] TxPass
[INFO  pallet_tx_registry::pallet] [tx-registry] store_tx_result: who = , message_pgarbled_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", result = <wasm:stripped>
[INFO  pallet_tx_registry::pallet] [tx-registry] store_tx_result: done! [BoundedVec([<wasm:stripped>], 16)]
```
#### ✅ What to Look For

- `check_input: input_digits = [2, 5]`: these are the digits entered by the user in response to the challenge.
- `computed_inputs_from_permutation = [5, 9]`: the backend decodes the expected message digits based on the randomized pinpad layout.
- `TxPass`: confirms that the decoded digits match the expected message and the validation is successful.
- `store_tx_result: done!`: indicates that the result of this validation (pass/fail) was committed to the registry for audit or future reference.

#### ❌ What to Look For

- `check_input: input_digits = [...]`: shows the digits entered by the user.
- `computed_inputs_from_permutation = [...]`: the expected message digits decoded from the pinpad permutation.
- `TxFail`: indicates that the user's input did **not** match the expected digits — the validation failed.
- `store_tx_result: done!`: even in failure cases, the result is still stored for transparency, auditability, or rate-limiting purposes.

:::info MORE DETAILS
Learn more on **[Authentication Layer](/developers/category/authentication-layer)**

**[`computed_inputs_from_permuation`](/developers/Milestones/M1/demo-tutorial/cli-demo-with-docker#how-to-find-the-correct-code-for-the-node)** detailed
:::






## Optional: Front-End Access

You can inspect chain state and transactions via:

- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)
- Or your preferred Substrate front-end UI

## Notes

- All services run in Docker containers and use local ports `9944`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs

---
:::note Technical Preview – Foundation for Secure Mobile SDKs  
This Android application is provided as a technical demonstration of Interstellar’s secure Web3 account infrastructure. It serves as a foundation for the forthcoming Android and iOS SDKs, which are still under active development.  

Please note that the current user interface and experience are not representative of the final product. Both UI and UX will be significantly refined to align with Interstellar’s core mission: delivering the highest levels of simplicity and security in mobile self-custody.  
:::


:::info Follow-Up – Selective Docs Exploration

If you've jumped straight into the evaluation, we recommend consulting the **[Milestone 1 documentation](/Milestones/M1/Summary.md)** for key context. It outlines the core architecture, backend logic, and trusted execution flows implemented in this milestone.

The documentation is modular—feel free to explore only the sections most relevant to your review or interest.  
You can also use the **search bar** (top right corner) to locate specific topics quickly. Helpful keywords include:

- `VHDL`, `circuits`, `garbled`, `TEE`, `integritee`,`SE attestation`  
- `NFC`, `VCA`,`recovery`, `threshold`, `trusted UX`  
- `comparison`, `passkey`, `ledger`, `authentication`, `compliance`, `security`, `ATT&CK`

:::
