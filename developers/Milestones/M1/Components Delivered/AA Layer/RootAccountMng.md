---
sidebar_label: 'User Accounts Management'
sidebar_position: 1
---

# User Accounts Management

The Interstellar account model is based on a **Pure Proxy root account** architecture, extended to support **mobile-bound delegated accounts**. This model ensures full user sovereignty while enabling secure, app-based authentication and recovery mechanisms without relying on traditional seed phrases or custodial infrastructure.

## Root & Mobile Account Structure

At the core of each Interstellar identity is a **Pure Proxy root account**, which acts as the canonical account on-chain. This root is paired with a **mobile proxy account** generated and attested on the user's device via a **Secure Element (SE)**.

- The mobile proxy account holds delegated signing rights and is the primary interface for authentication and transaction signing.
- The delegation is enforced via Substrate’s Pure Proxy pallet logic and scoped to the Interstellar runtime's policies.

## Decentralized Passkey Compatibility

Mobile proxy accounts use **elliptic curve keys on the NIST P-256 curve**, ensuring **cryptographic compatibility with Passkey/WebAuthn/FIDO2 standards**. However, unlike traditional WebAuthn implementations that rely on platform-anchored or centralized attestation, Interstellar leverages:

- **SE-based key generation** at the edge
- **On-chain registration** of key attestation metadata
- **No centralized credential anchors**

This enables a **truly decentralized Passkey alternative** that is interoperable, compliant with evolving standards, and aligned with self-custodial principles.

## Attestation Workflow

During account registration:

1. The mobile app interfaces with the Secure Element to generate a new key pair.
2. The SE produces a **device-bound attestation**, cryptographically linking the key to the trusted hardware.
3. This attestation is submitted via the `MOB-REG` extrinsic and stored in the Interstellar runtime.

This flow provides cryptographic assurance that the registered account is bound to a real, user-controlled device.

## On-Chain Identity Model

Each Interstellar identity is therefore composed of:

- A **root account** (pure proxy controller)
- One or more* **mobile proxy accounts**, attested and registered via SE
- Associated recovery metadata (covered in the Recovery Layer)
  
:::tip
***Advanced users** or **entities** can associate multiple mobile proxy accounts i.e **mobile devices** with a single root account to strengthen security during sensitive operations, enhance recovery mechanisms, and enable a more **user-friendly** and **resilient** multisignature scheme.
:::
