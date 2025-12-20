---
sidebar_label: 'Key Management Service (KMS)'
sidebar_position: 2
---

# Key Management Service (KMS)

The **Key Management Service (KMS)** is responsible for secure key handling and transaction signing across all supported blockchains (BTC, ETH, DOT, SOL).  
In **Milestone 3**, the KMS is functionally identical to M2, with **one critical upgrade**: **SGX-backed key sealing**.

---

## 🔐 What changed in M3

The **only functional difference between M2 and M3** is the introduction of **Intel® SGX sealing** for private keys.

- In **M2**, keys existed only in enclave memory and were lost on worker restart.
- In **M3**, keys are **sealed using SGX primitives**, enabling **secure persistence and recovery across enclave restarts**.

All other behaviors (key formats, signing flow, supported chains) remain unchanged.

---

## 🧩 Current behavior (M3)

- The KMS runs as a **Substrate pallet inside an Integritee worker**.
- Private keys are **generated, used, and stored exclusively inside the enclave**.
- Keys are now **sealed to disk using SGX sealing**, preventing extraction or reuse outside the enclave.
- On restart, keys are **unsealed and restored** transparently inside the enclave.
- Signing requests are triggered internally by the transaction execution flow (via `pallet_tx_manager`).

---

## ✅ Feature status

| Feature                       | Status (M3) |
|-------------------------------|-------------|
| Keypair generation            | ✅ Supported |
| Public key export             | ✅ Supported |
| Transaction signing           | ✅ Supported |
| SGX key sealing (persistence) | ✅ Enabled   |
| Key rotation / revocation     | ❌ Not yet   |

---

## 📌 Summary

For Milestone 3, the KMS reaches **production-relevant security guarantees** by adding **SGX-backed key persistence**, while keeping the architecture and signing flow unchanged.  
This upgrade ensures that private keys remain **confidential, enclave-bound, and durable**, even across worker restarts, without increasing system complexity or surface area.

Further evolutions (modular signer backends, MPC/threshold signing) are intentionally deferred beyond M3.
