---
sidebar_label: 'VCA Token Registry'
sidebar_position: 4
---


# VCA Token Registry

The VCA Token Registry manages the registration of **Visual Cryptography Authentication (VCA) tokens**, which serve as secure file-based recovery factors. Each token corresponds to a one-time-use garbled circuit program that supports threshold-based account recovery or sensitive operation validation.

## Purpose

VCA tokens are designed for scenarios where:
- A **cloud-backed recovery file** is desired
- Garbled circuit logic is used to guide and verify the recovery flow
- Biometric or cognitive validation steps are integrated with trusted execution

Rather than storing full secrets or executable code on-chain, the registry holds **metadata and item account bindings** corresponding to a VCA-secured file stored off-chain.

## Registration Flow

1. **Token Generation (Off-chain)**  
   A secure file is created, encapsulating a garbled circuit logic flow. This file is typically stored in the cloud or exported to a backup medium.

2. **Hashing and Metadata Extraction**  
   A content fingerprint (hash) of the secure file is generated. From this, an **item account ID** is derived deterministically.

3. **On-chain Registration**  
   The metadata, including the item account ID, is submitted to the VCA Token Registry. This transaction is executed inside the TEE and:
   - Links the VCA token to the user's recovery policy
   - Registers it as a valid recovery item
   - Does not expose sensitive file content or logic

## Security Characteristics

- **Off-chain confidentiality**: The secure file is never uploaded or stored on-chain.
- **On-chain verifiability**: Only the cryptographic fingerprint is committed.
- **Garbled circuit validation**: At recovery time, the TEE runtime executes part of the circuit or uses its challenge logic to verify authenticity and user interaction.

## Use Cases

- **Cloud-based recovery**: Store the secure file in Google Drive, iCloud, or IPFS, and recover via biometric verification.
- **Threshold-based logic**: Combine with NFC tag(s) to enable 2-of-3 or 3-of-5 recovery models.
- **Transaction confirmation**: In future versions, VCA tokens may be used for high-value transaction approvals.

---

The VCA Token Registry provides a standardized interface for integrating privacy-preserving, file-based recovery logic into the Interstellar account model—supporting secure fallback paths without centralized infrastructure or hardcoded secrets.

:::info
if you want to learn more about the technolgy that power the **VCA Token** i.e one time keypad and message display:  
- [Garbled Gircuit](https://interstellar-docs-tech.pages.dev/docs/Technoloy/Deep%20Technology/Garbled%20Circuits)
- [Dynamic Visual Cryptography](https://interstellar-docs-tech.pages.dev/docs/Technoloy/Deep%20Technology/Dynamic%20Visual%20Cryptograpy)
:::