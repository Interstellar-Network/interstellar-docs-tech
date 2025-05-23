---
sidebar_label: 'Recovery Architecture'
sidebar_position: 0
---

# Recovery Architecture

Interstellar implements a flexible, threshold-based recovery architecture designed to provide secure account restoration without seed phrases, centralized custody, or external KYC providers. This system supports **biometric-first**, **multi-factor**, and **hardware-anchored** recovery workflows—all executed within a **trusted execution environment (TEE)**.

## Recovery Philosophy

Traditional recovery mechanisms (e.g., mnemonic seed phrases or custodial email/password systems) create single points of failure and poor user experience. Interstellar's approach is:

- **Non-custodial**: All recovery logic is enforced on-chain and inside the TEE.
- **Threshold-based**: Multiple recovery items may be registered, with customizable policies (e.g., 2-of-3).
- **Hardware-compatible**: Includes support for NFC tags and secure files (VCA tokens).
- **Biometric-native**: Recovery can be initiated through a biometric challenge on a trusted device.

## Types of Recovery Items

Recovery items are cryptographically registered with the user’s account and may include:

- **NFC Tags**: Everyday physical objects (cards, wearables) registered and verified via UID hashing.
- **VCA Tokens**: Secure files backed by garbled circuits, stored in the cloud or offline.
- **Other mobile accounts** (planned): Additional devices or users in a social recovery graph.

Each item is mapped to an **item account ID**, which is used by the runtime to enforce threshold recovery logic.

## Recovery Configuration

When setting up recovery, the user may define a **threshold policy** such as:

- Total registered items: 3

- Threshold required to recover: 2


This policy is enforced inside the TEE and stored in encrypted runtime state. During recovery, the TEE checks the combination of presented items (e.g., NFC tag + VCA token) and only proceeds if the threshold is satisfied.

## Key Recovery Steps

1. **Recovery Initiation**: Triggered via the mobile app on a new device using biometric + recovery item scan.
2. **Item Verification**: Each recovery item (tag, file) is re-hashed and matched against on-chain registration.
3. **Threshold Check**: If the required number of verified items are present, recovery is unlocked.
4. **New Key Registration**: The new device's SE-based mobile proxy account is bound to the root account.

## Advantages

- **No seed phrase or passwords**
- **No centralized service dependency**
- **Supports physical + digital backup**
- **TEE-verifiable and privacy-preserving**

---

The Recovery Architecture lays the foundation for resilient and user-friendly fallback strategies, offering users strong guarantees of safety and recoverability—without sacrificing self-custody or user experience.
