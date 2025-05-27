---
sidebar_label: 'Beyond Traditional Authenticators'
sidebar_position: 3
---

# Beyond Traditional Authenticators

Traditional 2FA solutions like **Google Authenticator** and **Microsoft Authenticator** rely on static, time-based one-time passwords (TOTP). While simple to deploy, these methods have significant limitations:

- **They do not bind the code to a specific action or transaction**
- **They are vulnerable to phishing, malware, and real-time replay attacks**
- **They require complex and manual backup procedures, often relying on QR codes or recovery keys**

In contrast, **Interstellar's TAVP (Trusted Action Validation Protocol)** — previously referred to as **TTVP** — validates sensitive actions such as transactions or account recovery by linking them to:

- A **user-visible message** describing the action
- A **randomized keypad** displayed through secure visual cryptography
- A **Secure Element (SE)-signed response** confirming user intent
- Full processing and validation within a **Trusted Execution Environment (TEE)**

This approach is backed by Interstellar’s decentralized infrastructure, which handles message integrity, circuit delivery, and attestation flows **without reliance on centralized servers**.

---

## Key Differentiators

Compared to traditional authenticators, Interstellar provides significantly stronger guarantees in both **security** and **user experience**:

| Feature / Threat                       | Google/Microsoft Authenticator       | Interstellar (VCA + TAVP)           |
|----------------------------------------|--------------------------------------|-------------------------------------|
| Phishing-Resistant                     | ❌                                   | ✅                                  |
| Replay Protection                      | ❌                                   | ✅                                  |
| Hardware Binding (SE)                 | ❌                                   | ✅                                  |
| Intent Visibility (Message Display)    | ❌                                   | ✅                                  |
| Randomized Keypad Input                | ❌                                   | ✅                                  |
| Code Validity (One-Time)               | ✅ (but predictable)                 | ✅ (non-replayable)                 |
| Device Spoofing Resistance             | ❌                                   | ✅                                  |
| Integration with TEE                   | ❌                                   | ✅                                  |
| Visual Cryptography                    | ❌                                   | ✅                                  |
| Biometric Integration                  | ❌                                   | ✅                                  |
| Instant, Passwordless Onboarding       | ❌                                   | ✅                                  |
| Recovery Without Manual Backup         | ❌ (manual QR/key)                   | ✅ (NFC or secure file + threshold) |

---

## Summary

Interstellar eliminates the inherent limitations of traditional authenticators by combining **user-visible intent verification**, **hardware-backed signatures**, and **secure execution** into a streamlined user experience. This not only mitigates modern threat vectors like phishing and malware, but also **simplifies onboarding and recovery** for non-technical users.

Future versions of the mobile SDK will further expand these flows to support **Passkey compatibility**, **session delegation**, and **multi-device recovery policies** — all secured by Interstellar’s TAVP protocol.
