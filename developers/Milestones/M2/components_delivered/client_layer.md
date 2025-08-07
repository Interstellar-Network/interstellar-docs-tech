---
sidebar_label: 'Client Layer'
sidebar_position: 4
---

# 🧑‍💻 Client Layer

The **Client Layer** is responsible for orchestrating user-facing interactions and preparing transaction requests for processing within Interstellar’s secure execution environment. It acts as the initiating interface for all user actions that lead to transaction validation and signing.

In the current architecture, the client logic is not implemented as a standalone frontend. Instead, it is embedded within secure workers to streamline testnet interactions and to simulate real-world flows in a controlled environment.

---

## 🧩 Design Philosophy

The Client Layer aims to:

- Provide a consistent interaction model across supported blockchains.
- Abstract differences between UTXO-based and account-based chains.
- Ensure that transaction preparation logic is deterministic and auditable.
- Route all sensitive actions through secure layers (e.g., VCA, KMS).

---

## ⚙️ Execution Context

- The Client Layer is implemented **within Integritee workers**.
- Each worker encapsulates both the transaction logic and user interaction flow.
- Workers run in **trusted execution environments** and expose limited RPC interfaces for testing purposes.
- These interfaces allow external scripts or frontends to:
  - Simulate user inputs (e.g., send X tokens to Y)
  - Trigger transactions
  - Receive validation challenges (TAVP)
  - Fetch transaction status and events

---

## 📌 Responsibilities

- **Transaction Preparation**
  - Construct transaction payloads using coin-specific rules.
  - Fetch account state (balance, nonce, UTXO set) via RPC or light client mechanisms.
  - Estimate and attach fees or gas limits.

- **Validation Routing**
  - Determine whether additional validation (e.g., TAVP) is required based on the current policy.
  - Trigger the corresponding challenge-response protocol.

- **Signature Request**
  - Forward transaction payload to the Transaction Management Layer.
  - Receive and relay signing outcome from the KMS or future signer layers.

- **Feedback Loop**
  - Collect and format execution results, confirmation data, or error conditions for client display or logging.

---

## 🌐 Supported Chains

- **Bitcoin** – UTXO model, SegWit address support, fee-per-byte estimation.
- **Ethereum** – Account model, nonce tracking, EIP-1559 gas pricing.
- **Polkadot** – Substrate account abstraction, runtime call encoding.
- **Solana** – Account model with recent blockhash and fee payer logic.

Each chain is handled via dedicated logic modules within its worker instance.

---

## 🧱 Extensibility

This architecture supports multiple future extensions:

- Separation of frontend clients (e.g., Web, CLI, mobile SDK) from worker-based logic.
- Remote attestation for worker sessions to prove execution integrity.
- Progressive introduction of decentralized relayers to transmit signed TXs.
- Layered caching or batching for enhanced throughput.

---

## ✅ Summary

The Client Layer provides the entry point for initiating and managing transaction flows inside Interstellar’s architecture. By colocating client logic with execution workers, the system ensures end-to-end control over the transaction lifecycle while preserving modularity and forward compatibility with decentralized user interfaces.
