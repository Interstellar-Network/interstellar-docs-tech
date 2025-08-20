---
sidebar_label: 'Signer Layer'
sidebar_position: 1
---

# 🔐 Signer Layer

The **Signer Layer** is responsible for generating cryptographic signatures for blockchain transactions initiated within the Interstellar infrastructure. It is designed to support a variety of secure backends — from trusted enclaves (SGX/TDX) to decentralized signing schemes like MPC or NMC — and to enforce signing policies via orchestration logic.

This document provides a canonical view of the Signer Layer across all milestones, including both delivered components and planned enhancements.

---

## 🧱 Role in the Architecture

The Signer Layer acts as the boundary between the **Transaction Management Layer**, which formulates transaction intent, and the **cryptographic backends**, which securely generate and attest transaction signatures.

Depending on the security context and backend in use, it may:

- Sign directly using a local enclave (as in M2)
- Forward requests to an orchestrator (M3+)
- Enforce pre-signature checks (TAVP, policy rules)
- Return attested, chain-ready signatures

📄 See canonical overview: [Architecture](/developers/components/architecture)

---

## 🧩 Subcomponents

### 1. [**Key Management Service (KMS)**](/developers/components/signer-layer)

- **Status**: ✅ Delivered in M2
- Basic in-memory KMS used for testnet operations
- Does not yet run inside a SGX-enforced enclave
- Provides coin-specific signing (e.g., ECDSA for BTC/ETH, EdDSA for DOT/SOL)
- Integrated with TAVP for enforced validation before signing

### 2. [**Signer Orchestrator**](/developers/components/signer-layer)

- **Status**: ⏳ Planned (M3+)
- Routes signing requests to appropriate backend:
  - TEE (SGX, TDX)
  - Threshold MPC / NMC
  - EdDSA hardware secure enclave (SE)
- Applies policy logic: threshold enforcement, destination checks, beneficiary filtering
- Optional: returns proof of routing decision for auditability

---

## 🔁 Signing Flow

```text
Mobile SDK
   ↓
Authentication Layer
   ↓
Transaction Management Layer
   ↓
[conditional TAVP check]
   ↓
Signer Layer
   ↓
→ KMS (M2)
→ Orchestrator (M3+)
   ↓
Signature → Client Layer → Broadcast
```
---

## 🔐 Planned Cryptographic Backend Support

| Backend        | Use Case                     | Status            |
|----------------|------------------------------|-------------------|
| SGX enclave    | Default secure backend       | ✅ (partial)       |
| TDX enclave    | Confidential cloud workloads | ⏳ Planned         |
| MPC / NMC      | Distributed trust            | ⏳ Planned         |
| SEV-SNP (AMD)  | Validator infrastructure     | ⏳ Planned         |
| TrustZone (ARM)| Native mobile environments   | ⏳ Planned         |

---

## ⚠️ Security Considerations

- In M2, private keys are ephemeral and exist only in runtime memory inside the worker process. This is acceptable for testnet validation but not sufficient for production-grade security.
- All signing requests are validated via TAVP before processing.
- No keys are written to disk or exported outside the enclave context.

---

## 🧠 Future Work

- Signature policy enforcement (transaction amount thresholds, whitelists)
- Signature provenance and proof-of-origin metadata
- Integration with hardware attestation APIs (e.g., Intel EPID/TDX)
- Chain-specific logic for future cryptographic schemes (e.g., BLS, Schnorr)

---

## 📌 Summary

The Signer Layer enables secure, modular, and extensible signing logic across chains and backends. Starting with a basic KMS in M2, it is designed to evolve into a fully orchestrated, policy-aware, and cryptographically diverse component as the infrastructure expands toward secure production environments.

