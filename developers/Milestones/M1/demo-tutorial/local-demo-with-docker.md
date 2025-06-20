---
sidebar_label: 'Android App with Local Node'
sidebar_position: 2
---

# Android App with Local Node

This guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar Android demo app**.

This setup enables full offline testing without relying on a hosted VPS.

## 1. Prerequisites

| Requirement        | Install Guide |
|--------------------|----------------|
| Docker             | [Install Docker](https://docs.docker.com/engine/install/) |
| Docker Compose     | [Install docker-compose](https://docs.docker.com/compose/install/) |
| `curl`, `wget`, `jq` | Installed via `apt`/`brew` or default in most environments |
| Android Studio     | Optional, for emulator usage |
| ADB (`adb reverse`) | Comes with Android Studio |

> You may also use **Podman** as an alternative to Docker.

## 2. Launch the Interstellar Stack

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


You can verify the runtime is ready using [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws://localhost:9990)



## 3. Install the Android Demo App 

### Option 1: Physical Device

1. Download the APK from the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/containers/releases/tag/dev1) (specific APK preconfigured to connect to `localhost`)
- `androidApp-arm64-release.apk` for Android devices or emulator on Mac M1/M2/M3
- `androidApp-x86_64-release.apk` for emulators on Windows or Mac intel


2. Transfer it to your phone
3. Allow app installation from external sources
4. Install the APK

:::info if you need more details
[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)
:::

### Option 2: Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Create a `Android Emulator - Medium Phone` or equivalent emulator (`x86_64`, API 31+)
3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

:::warning
Ensure that your device is configured for english language
:::

---

## 2. Link App to your local Interstellar stack:

The Android app is preconfigured to connect to `localhost`
To allow the Android app to connect to your local blockchain and IPFS stack:

### Step 1: `adb reverse` set-up (on the desktop connected to the device or running the emulator)

If Android Studio is already installed, you can enable adb in your terminal 
by adding it to your PATH with the following command (adjust the path if needed):

** Add PATH on windows powershell example:**
```powershell
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```
>This will work for the current PowerShell session. To make it permanent, you can update your system environment variables.
** adb reverse set-up**
```bash
adb reverse tcp:9944 tcp:9944   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Integritee node port
adb reverse tcp:5001 tcp:5001   # IPFS

```
:::warning
Make sure `adb` is properly configured and the emulator or device is detected with `adb devices` and/or `adb reverse --list`
:::

> This works for both emulators and real devices connected via USB or WiFi

### Step 2 (optional): `ssh` port forwarding (on the system or VM running blockchain stack)

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

### Step 2: Test Recovery and Transaction Validation
- Register a recovery item (e.g., NFC tag or secure file)
- Send a test transaction to trigger the TTVP screen
- Enter the one-time code (2-digit), or experiment with trial/feedback

## Optional: Front-End Access

You can inspect chain state and transactions via:

- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9990)
- Or your preferred Substrate front-end UI

## Notes

- All services run in Docker containers and use local ports `9944`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs

---

Next Steps:
- Try the [Advanced CLI Demo](./advanced-cli-demo.md) to interact directly with the TEE and garbled circuits logic.
