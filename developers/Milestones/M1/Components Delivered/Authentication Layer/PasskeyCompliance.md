---
sidebar_label: 'Passkey-Compatible Authentication'
sidebar_position: 0
---

# Passkey-Compatible Authentication

Interstellar accounts are designed to be compatible with the **WebAuthn/Passkey standard** at the cryptographic level, while avoiding centralized credential anchors and external attestation services. This design allows users to benefit from secure, biometric-first authentication on mobile devices—without relying on custodial wallets or third-party identity providers.

## Cryptographic Alignment with Passkeys

Interstellar uses the same elliptic curve as the FIDO2/WebAuthn specification:

- **NIST P-256 (secp256r1 / ECDSA)**
- Keypairs are generated directly within the device’s **Secure Element (SE)**

This ensures compatibility with modern authentication ecosystems, including:

- WebAuthn-compatible browsers and devices
- Passkey APIs (Android, iOS, Web)
- Wallet connectors that validate using ECDSA

## Decentralized Key Management

Unlike traditional Passkey implementations that depend on platform-specific credential storage (e.g., Apple Keychain, Google Password Manager), Interstellar generates and stores credentials:

- **On-device**, in a hardware-backed **Secure Enclave**
- **Without relying on any platform or third-party IDP**
- **With attestations signed by the SE**, and verified on-chain during account registration

This approach gives users **full control and self-custody** of their authentication keys.

## Attestation and Registration

When registering an account:

1. The SE generates a new ECDSA keypair.
2. It returns a **hardware-bound attestation**, signed with an embedded attestation key.
3. This attestation is submitted with the `MOB-REG` extrinsic, anchoring the key to the user’s mobile proxy account.

No secrets are stored off-device, and no trust is delegated to cloud-based infrastructure.

## Pure Proxy Delegation Model

Authentication flows rely on the **mobile proxy account**, which is securely delegated by a root **Pure Proxy account**. This separation ensures:

- Flexibility in key rotation or device re-enrollment
- Isolation of recovery and signing roles
- Compatibility with Substrate’s multi-signer and threshold models

## Benefits over Platform Passkeys

| Feature                         | Platform Passkeys      | Interstellar Accounts         |
|---------------------------------|-------------------------|-------------------------------|
| Self-custody                   | ❌ Centralized          | ✅ Decentralized               |
| Biometric unlock               | ✅ (system-provided)    | ✅ (SE-enforced)               |
| Key attestation                | ✅ (vendor-controlled)  | ✅ (on-chain, device-bound)    |
| Cross-device portability       | ✅ via cloud sync       | ✅ via recovery mechanisms     |
| Recovery without passwords     | ⚠️ Platform-dependent   | ✅ Threshold recovery, seedless|

---

Interstellar provides a **passkey-equivalent experience** with superior sovereignty, decentralized trust anchors, and on-chain verifiability—ideal for secure Web3 authentication at scale.
