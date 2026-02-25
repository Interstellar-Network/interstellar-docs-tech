---
sidebar_label: 'Asset Distribution Manager'
sidebar_position: 2
---



# Asset Distribution Manager — Bot‑Resistant Airdrop System

## Purpose
The Asset Distribution Manager (ADM) defines a secure distribution mechanism for digital assets that guarantees fairness and prevents automated exploitation. The system is designed to operate in adversarial environments where automated agents, scripted wallets, and replay attacks are expected.

The core objective is to bind each claim to a verified human action performed in real time on a specific device, while maintaining a simple user experience (link or QR code interaction).

---

## Security Model
The distribution relies on three independent guarantees:

1. Human Intent Validation — Each claim requires a live verification step executed on the user device
2. Device Uniqueness — A device can only claim once per campaign
3. Economic Finality Delay — Claimed funds are frozen for a configurable period

This prevents farming, emulators, automation clusters, and uninstall/reinstall attacks.

---

## Key Mechanisms

### Double Validation (Two‑Step VCA)
Each claim requires two independent validations:

1. Register to the airdrp campaign Validation
   - Triggered when the user register
   - Proves real‑time human presence
   - Registers device participation in the campaign

2. Claim Confirmation Validation
   - Occurs after freeze delay
   - Prevents scripted delayed claiming
   - Ensures continued control of the same device

A claim is only valid if both validations succeed.

---

### Device‑Bound Participation
A campaign can only be claimed once per device.

The system records a cryptographic device fingerprint derived from runtime execution rather than identifiers. This prevents:

- multiple wallet creation
- reinstall farming
- emulator scaling
- key duplication

**If a recovery procedure is in progress, claiming is blocked.**

---

### Freeze Period
After a successful validation, funds are locked for a configurable time.

Purpose:
- eliminate immediate resale bots
- prevent flash farming attacks
- force long‑term participation

The freeze duration is defined at campaign creation.

---

### Claim Limits
A campaign defines a maximum number of successful claims.

The system tracks the number of validated claims. A claim counts only after successful validation, not link opening.

When the limit is reached, the campaign closes automatically.

---

## Campaign Lifecycle

### 1 — Creation
`create_airdrop_campaign(asset, claim_limit, time_limit, register_period, freeze_period)`

Properties:
- creator becomes campaign owner
- campaign receives a dedicated funding address
- campaign initially inactive until funded

---

### 2 — Funding
The campaign address must be funded externally.

Once balance is detected, the campaign becomes claimable.

---

### 3 — Distribution
Users interact through:
- link click
- QR code scan (later)

Supported scenarios:
- application already installed
- application installed after opening the link (later required app on Google play, Apple store)

---

### 4 — Claim Validation
Flow:
1. User opens link → Register → Validation #1
2. Device registered
3. After freeze period → Validation #2
4. Funds unlocked

---

### 5 — Closure
Campaign closes when:
- claim limit reached
- time limit reached
- owner closes early

Only creator may manually close campaign.

---

## Anti‑Bot Guarantees

| Attack | Protection |
|------|------|
| Scripted wallets | Human validation required |
| Wallet farms | Device uniqueness enforced |
| Reinstall farming | Recovery blocking |
| Emulators | Runtime validation |
| Replay attacks | Two‑step validation |
| Instant resale | Freeze period |
| Batch claiming | Claim limit |

---

## Asset Handling
The distribution account must be pre‑funded.

Supported assets:
- native tokens
- external chain assets (requires transaction signing authority)

---

## Shared Validation Logic
Validation logic must be shared across modules to avoid divergence:

- recovery module
- validation module
- distribution module

No duplicated validation implementations are allowed.

---

## UX Integration
The wallet interface handles:

- campaign creation
- link generation
- QR generation (later)
- claim status
- freeze countdown

The protocol layer only verifies correctness and enforces fairness.

---

## Guarantees Provided

The ADM ensures that:

- one human receives one allocation
- no automation can scale distribution
- distribution remains permissionless
- issuer keeps full control over supply

This transforms airdrops from probabilistic marketing campaigns into verifiable human distributions.

