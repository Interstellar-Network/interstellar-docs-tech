---
sidebar_label: 'VCA Token'
sidebar_position: 0
---

# VCA Token (one time use program)

The **VCA Token** (Visual Cryptographic Authentication Token) is a foundational element of Interstellar’s security architecture. It is a **one-time-use program**, compiled from a master circuit, that enforces **computation privacy, human-verifiable interaction**, and **SE-anchored execution integrity**. It is used both for **transaction and sensitive action validation** and as a **secure file format for recovery**.

Unlike traditional signature schemes or passcode validation logic, a VCA Token executes as a **garbled circuit** entirely on the user’s mobile device. Its result is **cryptographically signed using Secure Element (SE) entropy**, and can be verified by the blockchain node through a dedicated `AUTH` or recovery extrinsic.

## Core Objectives

- **Privacy-preserving local execution**: All logic is evaluated client-side in a secure environment.
- **Tamper-proof**: The token is unreadable and unreplicable due to one-time garbling.
- **Human-in-the-loop**: Users verify the transaction visually via randomized code or keypad inputs.
- **Cryptographically verifiable**: Nodes verify execution using a signature derived from the SE.

## Use Cases

### Action and Transaction Validation (TAVP)
Used in the **Trusted Action Validation Protocol**, the VCA Token presents a transaction or sensitive action message associated with a randomized keypad for the user to enter a short code. The input is evaluated securely and signed via SE.

### Recovery File
Used as a **secure file for recovery**, the VCA Token is stored in the cloud or locally. When executed during a recovery flow, it confirms user intent and provides a proof of interaction, without ever exposing the recovery secret.

## Token Lifecycle

1. **Generated from a Master Circuit**
   - A high-level circuit defines the logic and input layout
   - Can include UI elements like digits, code challenge, recipient identity

2. **Garbled in TEE**
   - Garbled and randomized by a custom pallet inside a TEE
   - Produces a one-time, encrypted, non-reusable circuit file

3. **Registered On-Chain**
   - A cryptographic fingerprint (hash) is submitted via the `VCA Token Registry`

4. **Executed on Mobile**
   - User interacts with a visual flow (e.g., code input or message confirmation)
   - Output is signed using SE-derived entropy

5. **Verified On-Chain**
   - The result is submitted to the runtime using  `AUTH` or recovery extrinsics
   - The node verifies both the **fingerprint** and the **SE-bound signature**

## Execution Integrity

To ensure the token cannot be forged or replayed:

- A **signature from the Secure Element** is used as a **protected random input** to the circuit
- This input is unique per execution and included in the final proof
- The node verifies that this SE signature matches the expected user and session

This mechanism guarantees that only a valid device executing the correct circuit logic can produce an acceptable result — making it impossible to spoof even if the file is leaked.

## Summary

The VCA Token acts as a **verifiable cryptographic contract**, executed on the user’s device and cryptographically sealed. It bridges UX simplicity (2-digit codes, visual validation) with deep security guarantees (garbled logic, SE verification, on-chain proof), and plays a central role in Interstellar’s authentication, recovery, and transaction control architecture.

:::info
To learn more about the advanced technology and cryptographic mechanisms that power the VCA Token — which securely manages the one-time keypad and dynamic message display — we invite you to explore the following concepts:

- **Garbled Circuits**: A privacy-preserving computation technique used to ensure that sensitive data is never exposed during processing, even on potentially compromised devices.
- **Dynamic Visual Cryptography**: A novel method for rendering secure information (such as digits or transaction messages) that is only decipherable by the human eye under specific visual and cognitive conditions, making it resistant to automated interception or spoofing.

These technologies are foundational to the VCA Token’s ability to deliver military-grade transaction security on consumer-grade mobile devices.
:::
