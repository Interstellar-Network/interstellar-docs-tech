---
sidebar_label: 'Mobile Demo with VPS'
sidebar_position: 1
---

# Mobile Demo with VPS Testnet

This guide walks you through testing **Milestone 1** of Interstellar’s secure Web3 account features using the **Android demo app** and a pre-configured remote testnet (hosted on a VPS). This is the fastest way to evaluate the delivered features without setting up the blockchain stack locally.

## Prerequisites

- Android phone (recommended) or an emulator via Android Studio
- ADB (`adb reverse`) must be available on your machine
- The VPS is publicly reachable and already runs:
  - Interstellar node with Integritee pallets
  - TEE enclave and IPFS backend
- Internet connection and browser access to [Polkadot.js Apps](https://polkadot.js.org/apps/)

---

## 1. Install the Android Demo App

### Option 1: Physical Device

1. Download the APK from the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/wallet-app/releases/tag/milestone1)
2. Transfer it to your phone or open it via QR/link
3. Allow app installation from external sources
4. Install the APK

### Option 2: Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Create a `Pixel 5` or equivalent emulator (`x86_64`, API 31+)
3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

---

## 2. Link App to Remote Testnet

The Android app is preconfigured to connect to `localhost`. To redirect those connections to the VPS testnet:

### Step 1: `adb reverse` (on the host system running the emulator or device)

```bash
adb reverse tcp:9990 tcp:9990   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Integritee node port
adb reverse tcp:5001 tcp:5001   # IPFS
```

:::warning
Make sure ADB is properly configured and the emulator or device is detected (adb devices)
:::

## 3. Run the Demo

### Step 1: Launch the App

Swipe up and open "Interstellar Wallet"

### Step 2: Onboard

Create a new account

Biometric prompt will trigger Secure Element key generation

`MOB-REG` extrinsic is submitted

### Step 3: Recovery Flow (Optional)

Register an NFC tag or a secure backup file

Initiate recovery by tapping tag or selecting cloud backup

### Step 4: Transaction Validation

Send a test transaction to a contact

Wait for the validation screen

Enter the 2-digit one-time code (displayed or guessed)

## Troubleshooting

- If the validation screen appears broken or unreadable, it's a known limitation of the current garbled circuit rendering

- For debugging, you may check Polkadot.js Apps at localhost:9990

- Ensure network forwarding is active and accessible on both ends

