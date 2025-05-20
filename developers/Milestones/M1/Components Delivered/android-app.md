---
sidebar_label: 'Android App'
sidebar_position: 7
---

# Android App Overview

The Android App included in this milestone serves as a demonstrator for Interstellar’s secure Web3 account lifecycle, showcasing how end-users can register, authenticate, validate transactions, and recover their accounts—all from a mobile-first interface.

---

## Purpose

The app is not intended as a production wallet, but as a **reference implementation** designed to:

- Demonstrate the capabilities of the underlying runtime pallets
- Interact directly with the TEE runtime for registration, authentication, and transaction validation
- Showcase user flows involving Secure Elements (SE), attestation, and recovery

It also acts as the **foundational layer** for Interstellar’s future **open-source mobile SDK**, enabling integration with third-party wallets, dApps, or financial applications.

---

## Key Features Demonstrated

### 1. Mobile Account Registration
- Generates a new ECDSA keypair inside the device’s Secure Element (SE)
- Displays hardware attestation metadata to the user
- Submits a `MOB-REG` extrinsic to register the SE-bound mobile proxy account on-chain

### 2. Biometric-First Authentication
- Uses device-native biometric authentication (e.g., fingerprint or face recognition)
- Unlocks the SE to sign application-layer payloads
- Verifies attested keypair registration and presence on the chain

### 3. Trusted Transaction Validation Protocol (TTVP)
- Simulates a sensitive transaction or approval flow
- Triggers a VCA Token execution which renders a **randomized keypad** and a **transaction-specific message**
- Captures user-entered input and submits it through an `AUTH` extrinsic
- The TEE verifies intent based on the circuit output and SE signature

### 4. Threshold-Based Recovery
- Registers backup items: NFC tag(s) and/or VCA-based secure file
- Initiates recovery flow from the mobile interface
- Verifies recovery item threshold (e.g., 2-out-of-3)
- Rotates account keys and re-establishes account access securely

---

## Architecture

- Built in **Kotlin** using **Jetpack Compose**
- Integrates with **Android Keystore** and compatible **Secure Elements**
- Communicates with the **TEE** runtime via **RPC/WebSocket**
- Uses **substrate-connect** or a **custom interface layer** for submitting extrinsics
- Includes a **garbled circuit evaluation engine written in Rust**, compiled as a native binary for Android
- Includes a **low-level visual cryptographic frame renderer**, also written in Rust, which works in tandem with the evaluator to render secure digit segments and visual confirmation messages
- Future support for **WASM-based browser execution** is planned

---

## Developer Note

This app is intended not just for milestone evaluation, but as a **blueprint for developers** who wish to:

- Integrate Interstellar's authentication logic into their dApps or wallets
- Build custom flows using the upcoming **mobile SDK**
- Understand how biometric auth, SE signature, and visual confirmation integrate into a secure transaction lifecycle
---

## Current Limitations

- Transaction validation screens may not render perfectly on low-end devices or emulators with limited GPU support
- Secure Element signature integration is active, but full runtime verification (SE fingerprint validation) is planned for a future milestone

---

## Summary

The Interstellar Android App demonstrates how decentralized authentication and account lifecycle management can be securely delivered through a mobile-first interface. It anchors account abstraction, TEE execution, biometric authentication, and cryptographic recovery in a fully decentralized stack — ready to be extended into third-party applications and SDKs.
