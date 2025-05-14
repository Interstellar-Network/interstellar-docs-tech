---
sidebar_label: 'Extended Recovery Pallet'
sidebar_position: 1
---

# Extended Recovery Pallet

The **Extended Recovery Pallet** is a TEE-native runtime module that governs Interstellar’s decentralized, threshold-based account recovery logic. It builds upon the **standard Polkadot recovery pallet**, expanding its capabilities to support **multi-item recovery**, **biometric-first flows**, and **hardware-bound validation**.

## Background: Standard Recovery Pallet

Polkadot’s standard recovery pallet provides a basic mechanism for:
- Registering a set of trusted friends or accounts
- Approving recovery of an account via majority signature

While useful in social recovery contexts, it lacks:
- Native support for NFC or cryptographic tokens
- Biometric/mobile-first flows
- Threshold recovery logic involving heterogeneous item types

## Extensions Implemented

The Extended Recovery Pallet introduces:

### 1. **Item-Based Recovery Model**
- Recovery no longer depends solely on trusted accounts.
- Instead, users register **item account IDs**, which may represent:
  - NFC tags
  - VCA token files
  - Other secure factors

### 2. **Threshold Logic**
- Configurable `M-of-N` recovery policies
- Runtime logic enforces minimum required verified items
- Allows for flexible strategies: e.g., 2-of-3, 3-of-5

### 3. **TEE-Only Verification**
- All logic executes within a **trusted Integritee enclave**
- Runtime checks:
  - Validity of presented item account IDs
  - Biometric unlock (if enabled)
  - SE-signed challenge confirmations

### 4. **Biometric-First Initiation**
- Recovery can be triggered only after biometric confirmation on the user’s mobile device.
- Ensures recovery requests are not programmatically replayed.

### 5. **Account Rotation and Auditability**
- Upon successful recovery:
  - A new SE-based mobile proxy keypair is generated
  - The root account delegates to the new mobile proxy
- All actions are recorded on-chain for audit purposes

## Developer Notes

- The pallet exposes `initiate_recovery`, `verify_recovery_item`, and `complete_recovery` extrinsics.
- All submissions must originate from attested SE-based proxy accounts.
- Item account mappings are hashed using BLAKE2 and verified securely within the enclave.

## Security Assumptions

| Assumption                  | Mitigation                                  |
|----------------------------|----------------------------------------------|
| NFC UID is non-forgeable   | UID never stored directly; only hashes used |
| Garbled file is tamper-proof | Enforced via off-chain signature and TEE logic |
| Device is SE-equipped      | Enforced by attestation during MOB-REG      |

---

The Extended Recovery Pallet provides a robust and modular foundation for future self-custodial recovery schemes, integrating physical hardware, cryptographic files, and biometric security—all without exposing sensitive user data or relying on centralized infrastructure.
