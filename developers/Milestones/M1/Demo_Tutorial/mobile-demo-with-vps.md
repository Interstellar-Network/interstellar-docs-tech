---
sidebar_label: 'Mobile Demo with VPS'
sidebar_position: 1
---

# Mobile Demo with VPS Testnet

This guide walks you through testing **Milestone 1** of Interstellar’s secure Web3 account features using the **Android demo app** and a pre-configured remote testnet (hosted on a VPS). This is the fastest way to evaluate the delivered features without setting up the blockchain stack locally.

:::note
The demo app is already wired to connect to the hosted testnet — no local configuration or Docker setup is required.
:::

## Prerequisites

- Android phone (recommended) or an emulator via Android Studio
- The VPS is publicly reachable and already runs:
  - Interstellar node with Integritee pallets
  - TEE enclave and IPFS backend
- Internet connection and browser access to [Polkadot.js Apps](https://polkadot.js.org/apps/)

---

## 1. Install the Android Demo App

### Option 1: Physical Device

[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)

1. Download the APK from the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/wallet-app/releases/tag/milestone1)
2. Transfer it to your phone.
3. Allow app installation from external sources
4. Install the APK

:::warning
Ensure that your device is configured for english language
:::


### Option 2: Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. [Create](https://developer.android.com/studio/run/managing-avds#createavd) a `Pixel 5` or equivalent emulator (`x86_64`, API 31+)

3. Launch the emulator
![Launch pixel 5 API 31 emulator](/img/Android_device_manager.png)
4. Drag and drop the APK onto the emulator window to install



---

## 2. Run the Demo

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

### Check Toast message order whith Action Validation Screen

- Processing...
- Registered
- [error] No circuits available after 10s; exiting!

[after taping one-time code digits]

- Validating transaction...
- Transaction done!

:::warning
If you are using an emulator, or a low-end or outdated Android device with a basic GPU, the user experience may be significantly degraded. Although the validation screen may be harder to read in such conditions, you should still be able to complete the test process.
:::
:::note
Please note that the current Android application is still under active development, and the present user experience does not reflect the final experience that will be delivered with the production-ready mobile SDK.

To simplify testing, the app is intentionally closed after a validation screen is completed. Additionally, during transaction screen testing, the input amount and recipient address are not yet displayed in the confirmation message.
:::
:::tip
In the future, we plan to introduce a **trusted beneficiary** feature. This will enable users to register known recipient addresses on-chain through a secure validation process, preventing attackers from substituting contact names with malicious public keys. This enhancement will make the wallet both more secure and user-friendly.
:::



- For debugging, you may check Polkadot.js Apps at localhost:9990


