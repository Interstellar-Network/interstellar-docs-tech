---
sidebar_label: 'Android App'
sidebar_position: 7
---
# Android Application

The Android App included in this milestone serves as a demonstrator for **Interstellar’s secure Web3 account lifecycle**, showcasing how end-users can register, authenticate, validate transactions, and recover their accounts—all from a mobile-first interface.

## Purpose

The app is not intended as a production wallet, but as a **reference implementation** to:

- Demonstrate the capabilities of the underlying runtime pallets
- Interact directly with the TEE runtime for registration and validation
- Showcase user flows involving **Secure Elements**, **attestation**, and **recovery**

## Key Features Demonstrated

### 1. Mobile Account Registration

- Generates a new **ECDSA keypair inside the device’s Secure Element**
- Displays hardware attestation metadata
- Submits a `MOB-REG` extrinsic to register the mobile proxy account

### 2. Biometric-First Authentication

- Uses device-native biometric API (e.g. fingerprint, Face ID)
- Unlocks SE to sign test payloads
- Verifies attested keys against chain state

### 3. Trusted Transaction Validation (TTVP)

- Simulates a sensitive transaction
- Triggers randomized keypad challenge
- Captures and submits user-entered code using `AUTH` extrinsic
- Verifies SE-signed intent within TEE

### 4. Threshold-Based Recovery

- Allows registration of NFC tag and VCA token
- Initiates recovery flow from app interface
- Verifies recovery item presence and threshold match
- Rotates account key and completes recovery cycle

## Architecture

- Built in Kotlin using Jetpack Compose
- Integrates with Android Keystore and compatible Secure Elements
- Communicates with TEE via RPC/WebSocket connection
- Uses substrate-connect or custom interface layer for extrinsics

## Testing & Validation

The app includes built-in UI prompts and logs for milestone reviewers, including:

- Attestation content before/after registration
- Transaction hash submissions for all extrinsics
- Recovery policy configuration display

## Developer Usage

While this app is milestone-focused, it serves as the foundation for:

- A future open-source mobile SDK
- Integration with external dApps or wallet interfaces
- Developer-facing demos for Interstellar partners and exchanges

---

The Android App demonstrates how Interstellar’s secure runtime logic integrates natively with biometric authentication, SE-based validation, and TEE-executed recovery — all from an end-user’s mobile device.
