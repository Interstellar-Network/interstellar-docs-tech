---
sidebar_label: 'Local Demo with Docker'
sidebar_position: 2
---

# Local Demo with Docker

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

## 3. Prepare Mobile App Access (via `adb reverse`)

To allow the Android app to connect to your local blockchain and IPFS stack:

```bash
adb reverse tcp:9990 tcp:9990   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Integritee node
adb reverse tcp:5001 tcp:5001   # IPFS
```

> This works for both emulators and real devices connected via USB

## 4. Run the Android App Demo

### Step 1: Install the App
Follow the instructions from the [Mobile Demo Guide](./mobile-demo-with-vps.md) to install the APK.

### Step 2: Connect & Onboard
- Launch the app
- Register a new mobile proxy account
- Validate biometric & SE-attested registration

### Step 3: Test Recovery and Transaction Validation
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
