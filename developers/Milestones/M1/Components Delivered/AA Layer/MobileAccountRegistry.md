---
sidebar_label: 'Mobile Account Registry'
sidebar_position: 2
---

# Mobile Account Registry

The Mobile Account Registry enables users to register **Secure Element (SE)-backed mobile proxy accounts** through a trusted onboarding process. It provides the foundation for passwordless, attested identity creation compatible with decentralized authentication and recovery.

## Purpose

This registry ensures that mobile accounts:
- Are cryptographically tied to a **key pair generated in the Secure Element**
- Include an **attestation proof** bound to a specific device
- Are registered and verified using the **`MOB-REG` extrinsic**

The resulting mobile account acts as a delegated signer for the user’s root identity via the Pure Proxy model.

## Flow Overview

1. **Key Generation in SE**  
   The mobile app triggers the generation of an ECDSA key pair within the device’s Secure Element (using the NIST P-256 curve).

2. **Attestation Construction**  
   The SE returns a signed attestation proof certifying the key’s origin and binding it to the hardware enclave.

3. **Registration via `MOB-REG` Extrinsic**  
   The attestation, along with the public key, is submitted on-chain via a `MOB-REG` transaction, which:
   - Registers the mobile proxy account
   - Associates it with a parent Pure Proxy root account
   - Marks it as a valid, SE-attested identity

4. **Trusted Use in Runtime**  
   Once registered, this account is eligible for:
   - Authentication and transaction validation (via `AUTH`)
   - Participation in recovery setups
   - Serving as a root identity for mobile wallet UX

## Flow Diagram

![Onboarding](/img/Onboarding.png)



## Security Properties

- **Hardware-anchored identity**: Accounts cannot be spoofed or recovered without physical device access.
- **Decentralized attestation**: No central authority is needed to verify or issue credentials.
- **Compliant with WebAuthn/Passkey cryptography**: SE uses NIST P-256, enabling future interoperability with emerging authentication standards.

## Integration Notes

- Multiple mobile accounts may be associated with a single root proxy account.
- The registry pallet logic is executed entirely in TEE and includes runtime validation of attestation signatures.
- This process does not require a passphrase, custody service, or centralized KYC.

---

This registry represents the core entry point into Interstellar’s decentralized account ecosystem, allowing users to onboard securely with nothing more than a mobile device and biometric confirmation.
