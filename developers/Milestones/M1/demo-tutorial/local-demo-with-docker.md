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
curl -O https://raw.githubusercontent.com/Interstellar-Network/Interstellar-Book/docker-compose/docker-compose.yml
curl -O https://raw.githubusercontent.com/Interstellar-Network/Interstellar-Book/docker-compose/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh

# Step 3: Start Docker (if needed)
sudo service docker start  # (for most Linux distros)

# Step 4: Launch the stack
sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate
```

Wait for logs to show messages like:

```text
[ocw-circuits] Hello from pallet-ocw-circuits.
Idle (0 peers), best: #X, finalized #Y...
```

You can verify the runtime is ready using [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws://localhost:9990)



## 3. Install the Android Demo App 

### Option 1: Physical Device

1. Download the APK from the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/wallet-app/releases/tag/milestone1) (specific APK preconfigured to connect to `localhost`)
2. Transfer it to your phone or open it via QR/link
3. Allow app installation from external sources
4. Install the APK

### Option 2: Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Create a `Pixel 5` or equivalent emulator (`x86_64`, API 31+)
3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

---

## 2. Link App to your local Interstellar stack:

The Android app is preconfigured to connect to `localhost`
To allow the Android app to connect to your local blockchain and IPFS stack:

### Option 1: `adb reverse` (on the host system running the emulator or device)

```bash
adb reverse tcp:9990 tcp:9990   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Integritee node port
adb reverse tcp:5001 tcp:5001   # IPFS
```

:::warning
Make sure ADB is properly configured and the emulator or device is detected (adb devices)
:::

> This works for both emulators and real devices connected via USB or WiFi

### Option 2: `ssh` port forwarding (on the host system/VM running blockchain and IPFS)

An exanple when blockchain is running on WSL2 and emulator or device is running on windows connected with adb through through USB or WiFi:
```bash
export WSL_HOST_IP="$(tail -1 /etc/resolv.conf | cut -d' ' -f2)"
```
```bash
ssh -N -R 9990:localhost:9990 -R 5001:localhost:5001 -R 2090:localhost:2090 [windows_user_name]@$WSL_HOST_IP
```

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

- All services run in Docker containers and use local ports `9990`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs

---

Next Steps:
- Try the [Advanced CLI Demo](./advanced-cli-demo.md) to interact directly with the TEE and garbled circuits logic.
