---
sidebar_label: 'TTVP Protocol'
sidebar_position: 1
---

# Trusted Transaction Validation Protocol

The **Trusted Transaction Validation Protocol (TTVP)** enforces user intent verification and transaction-level authentication inside a trusted execution environment (TEE). It enables **DSP-SCA-compliant** validation by binding biometric confirmation and touch input directly to the device’s Secure Element (SE), ensuring that sensitive actions are cryptographically confirmed by the user.

## Objective

TTVP is designed to:

- Protect against malware or remote takeover of mobile apps
- Ensure that **every sensitive transaction** is verified by the human user
- Guarantee that validation inputs are **signed by hardware**, not emulated by software

## How It Works

TTVP relies on a dedicated `AUTH` extrinsic executed in the TEE. When called, the runtime triggers the following flow:

### 1. Biometric Unlock

The user authenticates with biometric (e.g., Face ID, fingerprint), unlocking access to the SE.

### 2. One-Time Keypad Display

A **randomized keypad** is shown in the app, where the user enters a short validation code (e.g., 4–6 digits).

- The layout is shuffled per session to mitigate screen recording or malware risks.
- This input is not passed to the backend; it is captured and evaluated within the SE.

### 3. SE-Signed Confirmation

The entered code is:

- Encrypted and signed by the Secure Element
- Sent as part of the `AUTH` extrinsic payload

The TEE runtime verifies this signature against the user’s attested SE key.

### 4. Extrinsic Authorization

If the code is valid and the SE signature is correct:

- The `AUTH` extrinsic succeeds
- The transaction (or recovery) is approved on-chain

Otherwise, the attempt fails securely, with no leakage.

## Flow Diagram

![Transaction Validation](/img/TxVal.png)

:::note
The `AUTH-REQ` extrinsic can be submitted either by the mobile app (via the mobile SDK) or alternatively by a DApp with unsigned extrinsic. For the sake of clarity in the diagram, it is represented here as being sent via a DApp.
:::

## Security and Compliance

| Property                        | Mechanism                                      |
|--------------------------------|------------------------------------------------|
| DSP-SCA compliance             | User presence + biometric + SE-bound signing  |
| Resistance to malware attacks | Keypad input isolated from app memory         |
| Verifiability                  | SE signature is validated in TEE runtime      |
| Replay protection              | Random keypad layout + per-session nonce      |

## Use Cases

- **Transaction approvals** for high-value transfers or contract interactions
- **Sensitive operations** like account recovery or delegation
- **Session validation** for continuous authentication in critical apps

---

TTVP ensures that Interstellar users retain full control over transaction authorization, using a privacy-preserving flow that is verifiable, decentralized, and resistant to device-level compromise.
