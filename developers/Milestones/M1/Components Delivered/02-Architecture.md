---
sidebar_label: 'Architecture'
sidebar_position: 2
# need to rename md file to force proper ordering
---

# Architecture Overview

The architecture of Interstellar’s secure Web3 account system is built on a modular, **TEE-native design**, optimized for mobile-first use cases. All core logic is executed within trusted environments using **Integritee-based Substrate runtimes**, ensuring strong guarantees of confidentiality, integrity, and attestation.

## Layered Design

The system is organized into four primary functional layers:

- **Account Abstraction Layer (AA Layer)**  
Manages user identity and registration flows, including support for Pure Proxy-based root accounts, SE-attested mobile proxy accounts, and registration of recovery items such as NFC tags or VCA tokens.

- **Authentication Layer**   
Provides on-device authentication and transaction validation via the Secure Element. It includes the AUTH extrinsic and enforces compliance with DSP-SCA by validating user input (e.g., biometric unlock + randomized keypad) directly within the TEE.

- **Recovery Layer**  
  Implements a flexible, threshold-based recovery mechanism using combinations of NFC tags and VCA-based secure backup files. Recovery flows are handled entirely within the trusted execution environment, without reliance on external services or seed phrases.

- **VCA System Layer**  
    Defines the execution model for Visual Cryptographic Authentication Tokens — one-time-use programs generated from a master circuit and executed on the user's device. Each VCA Token displays a randomized keypad and a transaction- or action-specific message, which is never stored in memory and rendered only through garbled circuit logic. The output is signed using a Secure Element–derived random input, allowing the TEE to verify correct execution. This system serves as the trusted, privacy-preserving execution layer for both authentication and recovery flows.


## Secure Mobile Integration

Mobile interactions are designed to be cryptographically verifiable. Keys are generated within the Secure Element and registered on-chain using attestation flows. The system is compatible with WebAuthn / Passkey standards at the cryptographic level, while remaining fully decentralized and interoperable.

## Execution Environment

All logic runs within an **Integritee enclave**, enabling:

- Remote attestation of operations
- Confidential state transitions
- Cryptographic integrity for identity and transaction workflows

This ensures that user data, credentials, and account actions are verifiable, private, and resistant to client-side compromise.

---

This high-level architecture serves as the foundation for the components delivered in Milestone 1 and documented in the following sections.







