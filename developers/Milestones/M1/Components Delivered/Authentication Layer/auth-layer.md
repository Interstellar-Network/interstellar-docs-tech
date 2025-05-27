---
sidebar_label: 'Authentication Layer'
sidebar_position: 0
---

# Authentication Layer Overview

The **Authentication Layer** of Interstellar is responsible for verifying user identity and validating intent across sensitive operations such as transaction approvals and account recovery. It leverages both biometric factors and hardware-backed signatures via the device’s **Secure Element (SE)**.

At its core, the layer is built around the **Trusted Action Validation Protocol (TAVP)** — previously referred to as TTVP — which enables secure, human-verified input through the use of randomized keypads and visual cryptography rendered in real time by the mobile device.

---

## Core Components

- **Biometric Authentication**
  - Native biometric unlock (Face ID, fingerprint)
  - Unlocks SE for validation and key usage

- **TAVP (Trusted Action Validation Protocol)**
  - Combines biometric unlocking, visual confirmation, randomized input, and SE signing
  - Protects user actions (e.g. transfers, recovery) from spoofing or malware interference

- **AUTH Extrinsics**
  - `AUTH-REQ`: Initiates the validation challenge
  - `AUTH-RSP`: Returns the user’s SE-signed confirmation input

---


This layer is already implemented in Milestone 1 and is fully compatible with DSP2 and SCA requirements. Future updates will expand it to support on-device passkey emulation, secure delegation approvals, and wallet-level policy enforcement.
