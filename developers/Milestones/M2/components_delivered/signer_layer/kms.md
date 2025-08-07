---
sidebar_label: 'Key Management Service (KMS)'
sidebar_position: 2
---

# Key Management Service (KMS)

The Key Management Service (KMS) is a foundational component of Interstellar’s secure transaction infrastructure. It provides minimal cryptographic key handling capabilities required to perform transaction signing operations across multiple blockchain protocols.

This document describes the **basic version** of the KMS used in the current implementation. It is designed primarily for testnet usage and will be extended with secure enclave support and modular signer backends in future iterations.

---

## 🧩 Purpose

The KMS serves the following core functions:

- Generate and store blockchain-specific key pairs (e.g., secp256k1, ed25519).
- Export public keys for client-side address derivation.
- Sign transaction payloads upon request from the Client Layer and later from **Transaction Management Layer/Signer Orchestrator (M3)** //TO VERIFY/ADJUST
- Enforce basic isolation between signing logic and transaction orchestration.

---

## 🛠️ Implementation Details

- The current KMS runs **within a Substrate pallet** embedded in an **Integritee worker node**.
- It operates in **trusted user space**, but is **not yet protected** by SGX enclave boundaries.
- All cryptographic operations are performed using chain-specific Rust libraries.
- Signature requests are initiated by the transaction logic after optional validation steps.

> ⚠️ While the KMS is hosted on a worker node, **SGX isolation is not enforced** in the current implementation. This limits the system's resilience against certain runtime-level attacks and should be considered insecure for production use.

---

## 🔐 Key Features

| Feature                         | Status         |
|---------------------------------|----------------|
| Keypair generation              | ✅ Supported    |
| Public key export               | ✅ Supported    |
| Transaction signing             | ✅ Supported    |
| SGX enclave isolation           | ❌ Not enforced |
| Hardware-based key attestation  | ❌ Not available |
| Key rotation / revocation       | ❌ Not available |

---

## 🧪 Use Case in Current Architecture

- Each supported blockchain (BTC, ETH, DOT, SOL) uses a dedicated keypair.
- Keypairs are generated and stored locally in the worker runtime memory.
- Signature requests are routed through the Transaction Management Layer.
- No persistent key storage is used — keys exist for the duration of the worker runtime.//TO VERIFY
- The KMS is accessed only through internal interfaces; no external API is exposed.

---

## 🔄 Planned Enhancements

The current KMS is designed to be replaced or upgraded with a hardened, production-ready version that will include:

- **TEE-based execution**: Isolation using SGX, TDX, SEV, or TrustZone backends.
- **Key attestation**: Verifiable proof of origin and execution context.
- **Signer Layer integration**: Decoupling KMS logic from signature generation.
- **Threshold signing**: Integration with MPC/NMC frameworks.
- **Audit and telemetry hooks** for key usage tracking (non-sensitive metadata).

---

## 📌 Summary

The current KMS implementation provides the minimal cryptographic functionality required to test and validate transaction flows in a controlled testnet environment. It is intentionally simple and not designed for production use. Future versions will integrate enclave-based protection, attestation, and flexible signer backends to meet the security and compliance needs of real-world deployments.
