---
sidebar_label: 'Transaction Manager'
sidebar_position: 3
---

# Transaction Manager

The **Transaction Manager** is the first concrete and operational component of Interstellar’s **Transaction Management Layer (TML)**.  
In **Milestone 3**, it serves a dual role:

1. **Define and manage a unified transaction structure** between the Client / SDK layer and the blockchain runtime  
2. **Decide whether a transaction requires Trusted Action Validation (TAVP)** based on deterministic policy (currently per-chain thresholds)

This component establishes the **foundation for future transaction orchestration**, signer routing, and policy-driven execution.

---

## 🧩 Role in the Architecture

The Transaction Manager sits at the intersection of intent, policy, and execution.  
It mediates between:

- **Client / SDK Layer** — user intent, chain-specific builders, fee estimation  
- **Blockchain Runtime** — canonical transaction representation and validation  
- **Signer Layer (KMS in M3)** — cryptographic signing  
- **TAVP** — human-in-the-loop validation when required  

Rather than letting each client directly manage signing decisions, the Transaction Manager provides a **single, canonical control point** for all transaction types and chains.

---

## 🎯 Scope in Milestone 3

In M3, the Transaction Manager already goes beyond simple gating logic.

### 1. Unified transaction abstraction

The Transaction Manager defines a **chain-agnostic transaction structure** that is shared between:

- Mobile SDK / clients  
- On-chain runtime logic  
- Transaction validation (TAVP)

This unified representation allows BTC, ETH, DOT, and SOL transactions to be:

- Described consistently
- Validated uniformly
- Logged and audited deterministically

Chain-specific clients (BTC, ETH, DOT, SOL) are responsible only for **materializing** this abstract transaction into the appropriate wire format, as reflected in the logs.

---

### 2. Conditional TAVP triggering (current policy)

For M3, the enforced policy is intentionally simple and transparent:

- Each chain has a **static threshold** (`TX_THRESHOLD_*`)
- The Transaction Manager evaluates the amount against the threshold
- Two execution paths exist:
  - **Below threshold** → auto-approved
  - **Above threshold** → VCA / TAVP required

This logic is deterministic, reproducible, and easy for reviewers to validate.

---

### 3. Coordination with signing

The Transaction Manager does **not sign transactions itself**.

Instead, it:

- Determines whether signing may proceed
- Invokes TAVP when required
- Releases the transaction for signing via the **KMS**
- Ensures that **no signing occurs before validation completes**

This clean separation allows signing backends to evolve independently.

---

## 🔁 Current Decision Model (M3)

At a high level:

`tx` = `normalize_transaction(intent)`

if `policy_requires_tavp(tx)`:
`require_tavp(tx)`
else:
`allow_signing(tx)`



In M3, `policy_requires_tavp` is defined purely by **per-chain amount thresholds**, but the abstraction is already in place for richer policies.

---

## 🚀 Evolution Path

The Transaction Manager is designed to evolve into the **transaction orchestrator** of Interstellar.

Planned extensions include:

- **Fiat- and stablecoin-denominated policies**  
  (e.g. require TAVP if value > $X, using price feeds)

- **Asset-aware rules**  
  (USDC vs volatile assets, NFTs, wrapped tokens)

- **Destination-based logic**  
  - Allowlists / denylists  
  - First-time recipient checks  
  - Risk tagging

- **Signer routing**  
  - Route transactions to the appropriate signer backend  
  - Single signer, threshold signing, MPC / NMC, or heterogeneous TEEs

- **Composable policy evaluation**  
  Multiple conditions evaluated atomically before signing

At this stage, the Transaction Manager becomes the **policy and orchestration core** of the Transaction Management Layer.

---

## 📌 Strategic Positioning

By unifying transaction definition, validation gating, and signing coordination, the Transaction Manager forms the **technical basis** for:

- Secure human-approved transactions
- Policy-controlled autonomous execution
- Future Proof-of-Human-Intent (PoHI) enforcement for agentic and autonomous systems

These capabilities are intentionally scoped out of M3, but the architectural groundwork is already in place.

---

## 📌 Summary

In Milestone 3, the Transaction Manager is:

- A **unified transaction abstraction layer** across BTC, ETH, DOT, and SOL  
- The **enforcement point** for conditional TAVP validation  
- The **coordination layer** between clients, validation, and signing  

While current policies are limited to per-chain thresholds, the Transaction Manager is explicitly designed as the **long-term core of Interstellar’s Transaction Management Layer**, capable of supporting policy-driven, signer-aware, and autonomous transaction execution in future milestones.
