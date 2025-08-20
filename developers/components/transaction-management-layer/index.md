---
sidebar_label: 'Transaction Management Layer'
sidebar_position: 2
---

# 🧮 Transaction Management Layer

The **Transaction Management Layer** (TML) is responsible for orchestrating user-initiated blockchain transactions within the Interstellar system. It provides a secure and modular interface between the **Client Layer**, the **Signer Layer**, and **TAVP** for enforcing validation workflows.

This canonical documentation describes both the current implementation (used in testnet) and its future evolution toward a production-grade orchestration layer with programmable transaction policies.

---

## 🧱 Role in the Architecture

The TML serves as the **transactional control plane**, translating abstract user intents into coin-specific transactions, applying signing policies, and routing validated payloads to the appropriate signature backend.

It mediates between:

- The **Client Layer**, which provides coin-specific logic
- The **Signer Layer**, which generates valid signatures
- The **Authentication Layer**, which ties user identity to validation workflows
- The **TAVP Layer**, which ensures sensitive transactions are validated cognitively

📄 See [Architecture Overview](/developers/components/architecture)

---

## 🧩 Key Responsibilities

- Normalize requests across coins (BTC, ETH, DOT, SOL…)
- Perform format checks, fee estimation, and pre-signing compliance
- Apply conditional TAVP validation (e.g., above thresholds or based on policies)
- Forward signing requests to the KMS or Orchestrator
- Relay the signed transaction to the Client Layer for broadcast

---

## 🧪 Transaction Flow
```text
User
 ↓
Secure Mobile SDK
 ↓
Transaction Management Layer
 ↓
→ Format validation
→ Fee estimation
→ Conditional policy matching
 ↓
[TAVP?] → if required
 ↓
Signer Layer (KMS or Orchestrator)
 ↓
Signature
 ↓
Client Layer
 ↓
→ Chain-specific TX broadcast
```
---

## 🧠 Policy-Aware Design (Planned)

The TML is designed to evolve into a **programmable validation controller**, allowing security and UX policies to be configured per account, device, or asset class.

Examples include:

- ⚠️ Require TAVP if amount > X
- ⛔ Block TX if destination not whitelisted
- ⏳ Delay TX signing until 2FA timeout
- ✅ Auto-sign known destinations < Y

These policy hooks will be managed through a declarative ruleset evaluated at runtime.

---

## 🔗 Interfaces

| Module             | Role                                            |
|--------------------|-------------------------------------------------|
| Client Layer       | Chain-specific transaction formatting & fees    |
| Authentication     | Authenticated identity & key provenance         |
| TAVP               | Visual cognitive challenge + behavioral validation |
| Signer Layer       | Key usage enforcement and signature generation  |

---

## 📌 Summary

The Transaction Management Layer is the backbone of Interstellar’s secure and flexible transaction flow. In its current form, it provides secure orchestration with unified logic for BTC, ETH, DOT, and SOL. In its upcoming evolution, it will enable fine-grained policy enforcement, dynamic rule evaluation, and seamless interaction with modular signing backends.
