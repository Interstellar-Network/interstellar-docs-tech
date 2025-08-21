---
sidebar_label: 'Key Management Service (KMS)'
sidebar_position: 2
---

# Key Management Service (KMS)

The **Key Management Service (KMS)** is a foundational component of Interstellar’s secure transaction infrastructure.  
It provides the minimal cryptographic key handling capabilities required to perform transaction signing operations across multiple blockchain protocols.  

This document describes the **M2 version** of the KMS currently delivered. It is functional for testnet usage but does not yet enforce hardware-backed persistence (SGX sealing). These guarantees will be extended in **M3**, together with modular signer backends and stronger enclave isolation.

---

## 🧩 Purpose

The KMS provides the following core functions:

- Generate blockchain-specific key pairs (e.g., `secp256k1`, `ed25519`).  
- Export corresponding **public keys** for address derivation.  
- Sign transaction payloads upon request from the Client Layer and, in **M3**, from the **Transaction Management Layer / Signer Orchestrator**.  
- Enforce a separation between transaction orchestration and the low-level signing logic.

---

## 🛠️ Implementation Details (M2)

- The KMS is implemented as a **Substrate pallet** running inside an **Integritee worker**.  
- Keys and signatures are handled **inside the enclave runtime**, ensuring they are never exposed to untrusted host memory.  
- At this stage, **keys are not yet sealed** with Intel® SGX sealing primitives; they are kept only in protected enclave memory for the lifetime of the worker.  
- All cryptographic operations rely on standard, chain-specific Rust libraries (`sp_core`, `k256`, `ed25519_dalek`, etc.).  
- Signing requests are triggered internally by transaction execution logic after validation steps.

> ⚠️ **Limitations (M2):**  
> - Keys are not persisted across enclave restarts (ephemeral in-memory only).  
> - SGX sealing and recovery mechanisms will be introduced in **M3**.  
> - The system should be considered **insecure for production use** until sealing and persistence are enforced.

---

## 🔐 Key Features

| Feature                         | Status (M2)    |
|---------------------------------|----------------|
| Keypair generation              | ✅ Supported    |
| Public key export               | ✅ Supported    |
| Transaction signing             | ✅ Supported    |
| SGX key sealing (persistence)   | ❌ Not enforced |
| Key rotation / revocation       | ❌ Not available |

---

## 🧪 Usage in Current Architecture

- Each supported blockchain (BTC, ETH, DOT, SOL) is associated with a dedicated keypair.  
- Keypairs are generated and stored **in enclave memory only**.  
- No persistent key storage is applied — keys are lost on enclave restart.  
- Signature requests are routed through the **transaction flow** but never expose raw private keys.  
- The KMS is an **internal component**; it does not expose external APIs.

---

## 🔄 Planned Enhancements (M3+)

- **SGX Sealing**: Persistence and secure recovery of keys across enclave restarts.  
- **Signer Layer integration**: Decoupling KMS logic from signature execution for modular backends.  
- **Threshold / MPC-based signing**: Integration with MPC or NMC frameworks to enable multi-party and distributed signing schemes.  
- **Audit and telemetry hooks**: Non-sensitive logging of signing operations for monitoring and governance.  

---

## 📌 Summary

The M2 KMS implementation provides **minimal cryptographic functionality** for testnet flows: keypair generation, public key export, and signing, all confined to Integritee workers.  
It ensures **in-enclave runtime isolation** but does not yet provide **persistent key sealing**. These capabilities will be hardened in **M3**, preparing the system for production-grade use.
