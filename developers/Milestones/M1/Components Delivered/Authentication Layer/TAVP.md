---
sidebar_label: 'TAVP Protocol'
sidebar_position: 1
---

# Trusted Action Validation Protocol

The **Trusted Action Validation Protocol (TAVP)** — formerly referred to as **Trusted Transaction Validation Protocol (TTVP)** — enforces user intent verification and transaction-level authentication inside a **Trusted Execution Environment (TEE)**. It enables **DSP-SCA-compliant** validation by binding biometric confirmation and user input directly to the device’s **Secure Element (SE)**, ensuring that sensitive actions are cryptographically confirmed by the user.

---

## Objective

TAVP is designed to:

- Protect against malware or remote compromise of mobile wallets
- Ensure that **each sensitive transaction or action** is explicitly verified by the user
- Guarantee that inputs are **signed by secure hardware**, not emulated or spoofed by software

:::note
While originally described as TTVP in earlier milestone documentation, the protocol has been generalized to **TAVP** to reflect its broader applicability — including transaction signing, recovery flows, and other action-level confirmations.
:::

---

## How It Works

TAVP is based on two dedicated extrinsics, `AUTH-REQ` and `AUTH-RSP`, executed within the TEE. The protocol follows this multi-step flow:

### 1. Action Validation Request

A transaction or sensitive action message is sent to the Interstellar runtime through the `AUTH-REQ` extrinsic. This unsigned extrinsic may optionally include a signed extension if submitted by the user’s mobile app.

### 2. VCA Token Creation

The TEE generates a **garbled circuit** containing both a randomized keypad layout and a user-readable message (e.g., transaction summary). This one-time-use VCA Token is uploaded to IPFS and the CID is sent back to the user’s mobile app.

### 3. Biometric Unlock

The user authenticates locally using biometrics (e.g., Face ID, fingerprint), unlocking the Secure Element for touch validation.

### 4. Visual Action Challenge

The VCA Token is evaluated on the mobile device. It renders a **randomized keypad** and **message confirmation screen**:

- The user sees the action summary (e.g., "Send 300 DOT to Alice")
- A 2–4 digit code is entered using a **shuffled keypad** to prevent replay or recording attacks

### 5. SE-Signed Confirmation

The touch positions of the user-entered code are:

- Signed by the **Secure Element**, using the mobile proxy key
- Optionally encrypted and returned via the `AUTH-RSP` extrinsic

The signature proves both user presence and SE-bound authorization.

### 6. Extrinsic Authorization

The Interstellar runtime verifies:

- The SE signature against the user’s attested SE key
- The correctness of the entered validation code

If valid:

- The `AUTH-RSP` extrinsic succeeds
- A cryptographic approval is triggered in the runtime

The original transaction or action is then **signed** and either returned to the initiator or **broadcast to the blockchain** directly.

---

## Flow Diagram

![Transaction Validation](/img/TxVal.png)

:::note
The `AUTH-REQ` extrinsic may be submitted by the **mobile app** (via the SDK) or by an external **DApp** as an unsigned transaction. For clarity, the diagram shows the DApp submitting the extrinsic.
:::

The `AUTH-REQ` extrinsic carries the transaction or action payload to be signed or executed. Upon user validation, Interstellar signs it internally and may either return the signature to the caller or submit it directly using its embedded blockchain client.

:::info
TAVP will be fully exposed through the **mobile SDK** and API endpoints in the next milestone phase, enabling seamless integration for wallet providers and dApps.
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

TAVP ensures that Interstellar users retain full control over transaction or sensitive action authorization, using a privacy-preserving flow that is verifiable, decentralized, and resistant to device-level compromise.

