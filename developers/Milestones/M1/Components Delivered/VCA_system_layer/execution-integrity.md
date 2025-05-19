---
sidebar_label: 'Execution Integrity'
sidebar_position: 3
---

# Execution Integrity

Interstellar ensures the integrity and verifiability of user authentication and recovery actions through a combination of **Secure Element (SE)-based input**, **TEE-enforced circuit execution**, and a **proven cryptographic foundation**. This layer is critical to maintaining trust in the decentralized mobile authentication flow.

---

## SE-Signed Inputs

Each garbled circuit execution (e.g., a VCA Token used for transaction validation) includes a **public signature from the device’s Secure Element (SE)**. This signature is:

- **Generated client-side** at the time of circuit invocation
- Used as a **verifiable, tamper-resistant input** to the circuit
- Publicly checkable by the TEE runtime against on-chain registration

This design binds each execution to a specific **device and session**, preventing unauthorized replays or circuit reuse.

---

## Entropy for Visual Cryptographic Shares

The SE signature also serves as a **high-entropy source** for randomizing the **visual cryptographic shares** of digit segments rendered to the user. This protects against:

- Predictable layouts or segment collisions
- Injection of fake visual states
- UI spoofing by malware or automated phishing attempts

The visual components are **generated dynamically per session** using this entropy and do not persist in memory after rendering.

---

## Runtime Circuit Caching

For performance and security, the **master circuit** template used to generate VCA Tokens is **cached within the runtime**. This allows:

- **On-the-fly garbling** when an `AUTH-REQ` extrinsic is received
- Real-time rendering of randomized digits or secure messages based on transaction context
- Low-latency response suitable for biometric-driven mobile UX

This cached architecture minimizes attack surface by avoiding file I/O, deterministic code reuse, or external communication during evaluation.

---

## Security Model

The garbling algorithm used by Interstellar is an **optimized implementation** of a **standard, peer-reviewed garbled circuit scheme**. It is:

- Proven secure against **probabilistic polynomial-time (PPT) adversaries**
- Resistant to reverse-engineering, side-channel inference, or structure prediction
- Designed to guarantee circuit uniqueness and interaction authenticity

This ensures that even if circuit execution is observed (e.g. through side channels), its internal logic and input-output correlation remain cryptographically opaque.

---

## Summary

The combination of SE-based signatures, runtime-cached circuit execution, and verifiable input logic ensures that all user interactions processed via VCA Tokens are **cryptographically authentic**, **device-bound**, and **session-specific**. This makes the system secure even under advanced attack models—without compromising mobile performance or UX responsiveness.
