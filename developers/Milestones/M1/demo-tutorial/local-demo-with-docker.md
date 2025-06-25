---
sidebar_label: 'Android App with Local Node'
sidebar_position: 1
---

# Android App with Local Nodes

This guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar Android demo app**.

This setup enables full offline testing without relying on a hosted VPS.

:::info Tested Environment
This compatibility note applies to the **backend stack**, tested on Ubuntu 24.04 LTS (x86_64) using Docker (`docker-compose`) or Podman (with manually installed `podman-compose`*).  
The stack is expected to work on other recent Linux distributions, but this has not been officially verified.

Known issue: May fail on Apple Silicon (M1/M2/M3/M4) due to current SIMD usage and QEMU/Rosetta limitations.

The **frontend** (e.g., Android emulator or physical device) can run on any OS supported by Android Studio.

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
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/add-compose/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/add-compose/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh

# Step 3: Start Docker (if needed)
sudo service docker start  # (for most Linux distros)

# Step 4: Launch the stack
sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate
```

Wait for logs to show messages like:
```
[ocw-circuits] Hello from pallet-ocw-circuits.
🛌 Idle (0 peers), best: #6 (...), finalized #3 (...), ⬇ 0 ⬆ 0
```


You can verify the runtime is ready using [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)


## 3. Install the Android Demo App

### Download the APK

From the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/containers/releases/tag/dev1) (specific APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices or emulators running on ARM-based systems (e.g., Mac M1/M2/M3, Linux ARM desktops, Windows on ARM).
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

### Option 1: Physical Device

1. Transfer the APK to your phone or download it directly from the device 
2. Allow app installation from external sources
3. Install the APK
5. [Connect](https://developer.android.com/codelabs/basic-android-kotlin-compose-connect-device#2) your devices to Android Studio

:::info if you need more details
[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)
:::
:::warning
Ensure that your device is configured for english language
:::
### Option 2: Emulator

1. [Create](https://developer.android.com/studio/run/managing-avds#createavd)  a `Pixel 7` or equivalent emulator `API 31+` - `API 35` 
2. Edit the emulator and select an API 31+ below the default API 36
<img src="/img/API35.png" alt="API 35"  width="250"/>

3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

:::info API 36 Compatibility Notice
Support for Android **API 36 is pending** due to memory alignment issues introduced with 16K page size adoption. Our low-level Rust-based garbled circuit evaluator and frame renderer currently rely on 4K alignment assumptions, leading to crashes under the new memory model. A fix is in progress
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

**Add `adb` path (windows powershell example):**
```powershell
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```
>This will work for the current PowerShell session. To make it permanent, you can update your system environment variables.

**Set-up `adb reverse`**
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
via USB or Wi-Fi to Windows), 
you may need to configure port forwarding between the desktop and the blockchain.

**WSL2 ---> Windows example:**
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
- Launch the app
  - Register a new mobile proxy account
  - Validate biometric & SE-based registration
- Check toasted message
  - **Registering**
  - **Registered**

### Step 2: Test Transaction Validation

- Trigger the Trusted Action Validation Protocol (TAVP) screen

Send a test transaction to a contact
<img src="/img/Send_Currency_Demo.gif" alt="wallet menu"  width="300"/>

- Enter the one-time code (2-digit), or experiment with trial/feedback
### Check Toast message order whith Action Validation Screen

- **Processing...**
- Registered
- [error] No circuits available after 10s; exiting!

[after taping one-time code digits]

- Validating transaction...
- Transaction done!
### Step 3 Test Recovery 
- Register a recovery item (e.g., NFC Item or Cloud Backup)
- Relaunch your App (simulating creation of new App)
- Recovery Screen to recover your account with your Cloud Backup and/or NFC Items


:::info Recovery Testing Note
To simplify recovery flow testing, the app generates and registers a new Secure Element (SE) key pair each time it is launched. This avoids the need to delete and reinstall the app between tests.

**Important:** Once a user registers with a specific NFC tag (or manually entered serial), they cannot register again with the same one until the backend stack is restarted (e.g., by restarting the Docker Compose setup).
:::

## Interpreting Logs

When interacting with the mobile app (e.g., authentication, transaction validation, recovery),
 key log messages are printed by both `integritee-node` and `integritee-service`. 
 These logs help verify that Trusted Action flows are working as expected.

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


### 🛠️ Detailed logs for mobile registration

This log trace shows what happens when a new device connects to the system and is not yet registered under a root account. The backend detects the missing account and proceeds with registration:

```bash
[2025-06-24T08:17:44Z INFO  pallet_mobile_registry::pallet] ensure_has_root_account failed for  while checking if registered: Module(ModuleError { index: 16, error: [0, 0, 0, 0], message: Some("RootAccountNotFound") })  
[2025-06-24T08:17:44Z WARN  sp_io::storage] storage::start_transaction unimplemented  
[2025-06-24T08:17:44Z DEBUG pallet_mobile_registry::pallet] register_mobile start for  
[2025-06-24T08:17:44Z INFO  pallet_mobile_registry::pallet] ensure_has_root_account failed for  while checking if registered: Module(ModuleError { index: 16, error: [0, 0, 0, 0], message: Some("RootAccountNotFound") })  
[2025-06-24T08:17:44Z DEBUG pallet_mobile_registry::pallet] register_mobile: new registration for  
[2025-06-24T08:17:44Z WARN  sp_io::storage] storage::start_transaction unimplemented  
[2025-06-24T08:17:44Z WARN  sp_io::storage] storage::start_transaction unimplemented  
[2025-06-24T08:17:44Z WARN  sp_io::storage] storage::commit_transaction unimplemented  
[2025-06-24T08:17:44Z WARN  sp_io::storage] storage::commit_transaction unimplemented  
[2025-06-24T08:17:44Z DEBUG pallet_mobile_registry::pallet] register_mobile end  
```
---

### ✅ What to Look For

- `RootAccountNotFound`: expected on first connection from a new mobile identity.
- `register_mobile start` → `register_mobile end`: confirms that registration was initiated and completed.
- These logs confirm that the system automatically falls back to registering the mobile when not yet linked to a root account.



### 🛠️ Detailed logs for garbled circuit generation and metadata preparation

The following logs represent the backend activity triggered by a mobile app requesting a new secure visual validation. This includes:

- Garbled circuit rendering for the transaction display.
- Selection of digits and randomized pinpad.
- Storage of metadata used later for input validation.

You should see logs similar to the following:
```bash
[2025-06-23T15:03:45Z WARN  sp_io::storage] storage::start_transaction unimplemented  
[2025-06-23T15:03:45Z INFO  pallet_ocw_garble::pallet] [ocw-garble] garble_and_strip_display_circuits_package_signed: ("T0.13 ETH to REPLACEME" for )  
[2025-06-23T15:03:45Z WARN  pallet_ocw_garble::pallet] get_ocw_circuits_storage_value: storage COULD NOT be read! Fallback to RPC...  
[2025-06-23T15:03:45Z INFO  pallet_ocw_garble::pallet] get_ocw_circuits_storage_value response : <wasm:stripped>  
[2025-06-23T15:03:45Z INFO  pallet_ocw_garble::pallet] display_circuits_package: ("Qmaq13hbrSK7th8kA6CyP5cfviMshv46ZzxZ63aRopvpgF",2) ("QmR9DRACkkgwmyoSNGVX9m54AGZ6mkGkAGxwCLXMzi4aUP",10)  
[2025-06-23T15:03:45Z INFO  pallet_ocw_garble::pallet] pinpad_digits: [6, 2, 5, 4, 1, 9, 7, 3, 8, 0], message_digits: [5, 9]  
[2025-06-23T15:03:46Z INFO  pallet_ocw_garble::pallet] callback_new_garbled_and_strip_signed: "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w" ; "QmSDGvEFH2sDnNg5zCA4Nr4Zd3mByYs9Mmg994DWL8yiK6" for  
[2025-06-23T15:03:46Z INFO  pallet_tx_validation::pallet] store_metadata_aux: message_pgarbled_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", message_digits = [5, 9], pinpad_digits = [6, 2, 5, 4, 1, 9, 7, 3, 8, 0]  
[2025-06-23T15:03:46Z INFO  pallet_tx_validation::pallet] store_metadata_aux: done!  
[2025-06-23T15:03:46Z INFO  pallet_ocw_garble::pallet] callback_new_garbled_and_strip_signed: done!  
[2025-06-23T15:03:46Z WARN  sp_io::storage] storage::commit_transaction unimplemented  
```
---

### ✅ What to Look For

- `display_circuits_package:` confirms the transaction display garbled circuit has been rendered.
- `message_digits` and `pinpad_digits`: the random digits selected for the user’s challenge.
- `store_metadata_aux: done!`: metadata was correctly stored for later validation.
- `callback_new_garbled_and_strip_signed: done!`: confirms generation and signing succeeded.


### Detailed logs for a succesfull validation
When the user correctly responds to the visual cryptographic challenge, the following logs will appear 
in the integritee_service container. These confirm that the digits were correctly interpreted and that the result was successfully committed:
```bash
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_validation::pallet] [tx-validation] check_input: who = , ipfs_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", input_digits = [2, 5]
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_validation::pallet] [tx-validation] check_input: input_digits_str = "\u{2}\u{5}", input_digits_int = [2, 5], pinpad_permutation = BoundedVec([6, 2, 5, 4, 1, 9, 7, 3, 8, 0], 10)
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_validation::pallet] [tx-validation] check_input: computed_inputs_from_permutation = [5, 9], message_digits = BoundedVec([5, 9], 10)
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_validation::pallet] [tx-validation] TxPass
integritee_service-1  | [2025-06-23T15:04:01Z WARN  sp_io::storage] storage::commit_transaction unimplemented
integritee_service-1  | [2025-06-23T15:04:01Z WARN  sp_io::storage] storage::start_transaction unimplemented
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_registry::pallet] [tx-registry] store_tx_result: who = , message_pgarbled_cid = "QmSJSSsyHV9aZCqCvv6QZwJ3K7vf4YoqF1DAWAAwsD7m6w", result = <wasm:stripped>
integritee_service-1  | [2025-06-23T15:04:01Z INFO  pallet_tx_registry::pallet] [tx-registry] store_tx_result: done! [BoundedVec([<wasm:stripped>], 16)]
```
### ✅ What to Look For

- `check_input: input_digits = [2, 5]`: these are the digits entered by the user in response to the challenge.
- `computed_inputs_from_permutation = [5, 9]`: the backend decodes the expected message digits based on the randomized pinpad layout.
- `TxPass`: confirms that the decoded digits match the expected message and the validation is successful.
- `store_tx_result: done!`: indicates that the result of this validation (pass/fail) was committed to the registry for audit or future reference.

### ❌ What to Look For

- `check_input: input_digits = [...]`: shows the digits entered by the user.
- `computed_inputs_from_permutation = [...]`: the expected message digits decoded from the pinpad permutation.
- `TxFail`: indicates that the user’s input did **not** match the expected digits — the validation failed.
- `store_tx_result: done!`: even in failure cases, the result is still stored for transparency, auditability, or rate-limiting purposes.


### 🛠️ Detailed logs for NFC tag-based recovery setup

The following logs represent the flow where a user device sets up a **recovery mechanism using an NFC tag**. This involves:

- Adding the NFC tag to the registry.
- Creating a new `unify_recovery` configuration.
- Mapping the NFC tag to a `KeyFriend`.
- Ensuring threshold conditions are satisfied.
- Finalizing and storing the recovery configuration on-chain.

You should observe logs similar to the following:
```bash
[DEBUG pallet_nfc_recovery::pallet] add_nfc_tag : who =  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : START , None, None, NfcTag(...)  
[DEBUG pallet_unify_recovery::pallet] ensure_has_root_account who:  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK Root Account OK  
[DEBUG pallet_unify_recovery::pallet] has_active_recovery who:  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK AlreadyStarted OK  
[DEBUG pallet_unify_recovery::pallet] get_default_recovery_settings  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : pending ActiveFriends { threshold: 1, key_friend_pairs: [...] }  
[DEBUG pallet_unify_recovery::pallet] is_recoverable who:  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : threshold = 1  
[DEBUG pallet_unify_recovery::pallet] map_friend_with_recovery_method : NfcTag(...), (...)  
[DEBUG pallet_unify_recovery::pallet] get_proxy_account : [...]  
[DEBUG pallet_unify_recovery::pallet] map_friend_with_recovery_method DONE  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : friend_account =  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : pending AFTER = ActiveFriends {...}  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : friends = [, ]  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK threshold OK = [, ]  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : clearing recovery state OK  
[DEBUG pallet_unify_recovery::pallet] clear_recovery_state :  
[DEBUG pallet_unify_recovery::pallet] clear_recovery_state : recoverable found =  
[DEBUG pallet_unify_recovery::pallet] clear_recovery_state : remove_recovery DONE  
[INFO  pallet_unify_recovery::pallet] execute_create_recovery : DONE for  
[INFO  pallet_nfc_recovery::pallet] add_nfc_tag : DONE  
```
---

### ✅ What to Look For

- `execute_create_recovery : START` through `DONE`: confirms the recovery flow using an NFC tag completed without errors.
- `threshold = 1`: confirms that recovery quorum has been set (e.g., single tag for recovery).
- `ActiveFriends` includes both a CID-based and an NFC-based `KeyFriend`.
- `map_friend_with_recovery_method DONE`: shows that the NFC tag was correctly interpreted and linked.
- `clear_recovery_state` ensures old states are removed before registering a new configuration.
- `add_nfc_tag : DONE`: confirms the NFC identifier has been saved in the registry and linked to the user.

This log sequence confirms a successful setup of an NFC-based recovery configuration within the unified recovery module.


### 🛠️ Detailed logs for Cloud Backup-based recovery setup

The following logs describe a successful recovery configuration setup using a **CID-based key**, which refers to a cloud-stored recovery asset (e.g., a backed-up VCA Token). This process involves:

- Triggering `extended_create_recovery` via the cloud backup flow.
- Generating and storing a VCA challenge for user authentication.
- Creating a `KeyFriend` based on the cloud CID.
- Registering the friend account and checking recovery eligibility.

Expected logs:
```bash
[DEBUG pallet_token_recovery::pallet] extended_create_recovery : who =  
[INFO  pallet_tx_validation::pallet] store_metadata_aux: message_pgarbled_cid = "...", message_digits = [...], pinpad_digits = [...]  
[INFO  pallet_tx_validation::pallet] store_metadata_aux: done!  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : START ..., Cid(...)  
[DEBUG pallet_unify_recovery::pallet] ensure_has_root_account who:  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK Root Account OK  
[DEBUG pallet_unify_recovery::pallet] has_active_recovery who:  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK AlreadyStarted OK  
[DEBUG pallet_unify_recovery::pallet] get_default_recovery_settings  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : pending ActiveFriends { threshold: 1, key_friend_pairs: [], delay_period: 10 }  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : threshold for NOT recoverable  
[DEBUG pallet_unify_recovery::pallet] map_friend_with_recovery_method : Cid(...), (...)  
[DEBUG pallet_unify_recovery::pallet] get_proxy_account : [...]  
[DEBUG pallet_unify_recovery::pallet] friend_account :  
[DEBUG pallet_unify_recovery::pallet] map_friend_with_recovery_method DONE  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : pending AFTER = ActiveFriends {...}  
[DEBUG pallet_unify_recovery::pallet] execute_create_recovery : CHECK threshold OK = []  
[WARN  sp_io::storage] storage::start_transaction unimplemented  
[WARN  sp_io::storage] storage::commit_transaction unimplemented  
[INFO  pallet_unify_recovery::pallet] execute_create_recovery : DONE for  
[INFO  pallet_token_recovery::pallet] extended_create_recovery : DONE  
```
---

### ✅ What to Look For

- `extended_create_recovery` and `Cid(...)`: confirms that the recovery setup was triggered using a **CID-backed cloud recovery key**.
- `store_metadata_aux: done!`: ensures that a corresponding visual challenge has been generated for secure user validation.
- `map_friend_with_recovery_method` with a CID input: confirms correct linking between the cloud-stored token and the account’s recovery logic.
- `ActiveFriends` with the CID-based `KeyFriend`: confirms the friend registration is complete.
- `threshold OK` and `execute_create_recovery : DONE`: confirms all recovery criteria were met and configuration finalized.

> ℹ️ In this flow, the CID typically points to a trusted, encrypted, cloud-backed VCA Token that can be retrieved and validated securely by the user.








## Optional: Front-End Access

You can inspect chain state and transactions via:

- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)
- Or your preferred Substrate front-end UI

## Notes

- All services run in Docker containers and use local ports `9944`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs

---

Next Steps:
- Try the [Advanced CLI Demo](./advanced-cli-demo.md) to interact directly with the TEE and garbled circuits logic.
