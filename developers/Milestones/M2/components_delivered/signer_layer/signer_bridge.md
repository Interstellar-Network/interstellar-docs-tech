---
sidebar_label: 'Signer Bridge'
sidebar_position: 2
---


:::info Migration from Registry Pallet to Signer Bridge

The Signer Bridge replaces the originally planned **sidechain registry pallet** that was envisioned to manage a dedicated signature sidechain cluster per cryptographic scheme. This strategic adjustment reflects a shift in focus from early L1-L2 orchestration toward greater flexibility at the **worker level**.

By decoupling signature routing from blockchain-level registries, the architecture avoids the overhead of managing L1 ↔ L2 communication and allows for faster iteration on security-critical features such as TAVP validation, threshold enforcement, and backend diversity.

This approach also increases compatibility with future infrastructure upgrades — including the introduction of **NMC (Nillion), TDX**, or **other TEE/MPC models** — while preserving functional parity and testnet realism during the current phase.

:::

# Signer Bridge

The **Signer Bridge** is a middleware component designed to decouple transaction orchestration logic from the underlying cryptographic signing infrastructure. It introduces policy-based routing to determine how and when transaction signing should be delegated, and to which backend (e.g., hardware enclave, MPC engine, etc.).

Although not yet active in the current implementation, the Signer Bridge is a foundational abstraction for enabling multi-backend, policy-aware signature management in future versions.

---

## 🧩 Purpose

The Signer Bridge serves as a control point between:

- The **Transaction Management Layer**, which formulates and validates transaction payloads.
- The **Signer Layer**, which performs cryptographic operations based on backend capabilities and security requirements.

Its main role is to apply **dynamic routing logic** based on contextual policies, user settings, or runtime metadata before invoking a signature backend.

---

## 🔁 Core Responsibilities

- **Threshold-Based Routing**  
  Route signing requests through additional validation (e.g., TAVP) when user-defined or default thresholds are exceeded (e.g., high transaction amount, unknown destination).

- **Backend Selection**  
  Dynamically choose between available signing engines:
  - Local TEE (e.g., SGX, TDX, SEV, TrustZone)
  - External signer (via MPC or NMC)
  - Recovery signer (if applicable)

- **Pre-Signature Conditions**  
  Enforce validation steps before releasing a signature:
  - VCA challenge passed
  - Device attestation valid
  - Behavioral consistency confirmed

- **Signature Request Standardization**  
  Normalize input format (`{payload, coin_type, metadata}`) across heterogeneous chains and signature schemes (e.g., ECDSA, EdDSA, Schnorr).

---

## 📦 Planned Interfaces

The Signer Bridge will expose an internal interface similar to:

```rust
pub struct SigningRequest {
  pub payload: Vec<u8>,
  pub coin_type: CoinType,
  pub metadata: SigningMetadata,
}

pub enum SigningRoute {
  LocalTEE,
  MPC,
  Recovery,
}

pub trait SignerBridge {
  fn route_and_sign(req: SigningRequest) -> Result<SignatureResponse, SigningError>;
}
```

The internal request object and routing result may conceptually follow this pattern:

- `SigningRequest`
  - Payload: transaction or message to sign
  - CoinType: BTC, ETH, DOT, SOL, etc.
  - Metadata: includes amount, destination, UX context
- `SigningRoute`
  - LocalTEE
  - MPC
  - Recovery
- `SignerBridge`
  - Receives a request
  - Applies rules
  - Delegates signing to the appropriate backend

This approach supports extensibility across signature types and decision engines.

---

## 🧠 Policy Routing Examples

| Condition                                | Route           |
|------------------------------------------|------------------|
| Transaction below user-defined threshold | Local TEE        |
| Transaction above threshold              | VCA + TEE        |
| Recovery mode triggered                  | Recovery signer  |
| Wallet mode = "MPC-only"                 | MPC signer       |
| Destination flagged as restricted        | TAVP required    |

---

## 🔐 Security Benefits

- **Control**: Prevents silent signature generation for high-risk transactions.
- **Flexibility**: Supports both centralized and decentralized backends.
- **Compliance**: Enables governance-aware flows and enterprise rules.
- **Auditability**: Clearly separates signature execution from orchestration logic.

---

## 📌 Summary

The Signer Bridge introduces a programmable abstraction layer that separates signature policy from implementation details. It will become essential in enabling a secure, scalable, and extensible multi-chain wallet infrastructure, where different users, coins, and environments may require distinct validation and signature handling pathways.