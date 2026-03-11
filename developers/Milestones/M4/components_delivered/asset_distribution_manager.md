---
sidebar_label: 'Asset Distribution Manager'
sidebar_position: 2
---



# Asset Distribution Manager — Bot‑Resistant Airdrop System

# Asset Distribution Manager — Bot-Resistant Airdrop System


## Purpose
The Asset Distribution Manager (ADM) defines a secure distribution mechanism for digital assets that guarantees fairness and prevents automated exploitation. The system is designed to operate in adversarial environments where automated agents, scripted wallets, and replay attacks are expected.

The core objective is to bind each claim to a verified human action performed in real time on a specific device, while maintaining a simple user experience (link or QR code interaction).

And prevent this type of infrastructure to steal airdrop from real users: [Inisde 30 000 phone crypto airdrop bot farm](https://cointelegraph-magazine.com/inside-30000-phone-crypto-airdrop-bot-farm/)

---

## Security Model
The distribution relies on three independent guarantees:

1. Human Intent Validation — Each claim requires a live verification step executed on the user device
2. Account-level Uniqueness — Each eligible account can only claim once per campaign
3. Economic Finality Delay — Claimed funds are frozen for a configurable period

This combination makes abuse materially more expensive. Emulator farms, scripted claim flows, uninstall/reinstall strategies, and coordinated automation cannot rely on a simple replay model. Attackers must repeatedly involve a real human at the point of claim and sustain that effort through the delayed-finality window.

The current enforcement is primarily account-centric. Over time, this model can be strengthened through tighter device-account binding, enabling stronger resistance to multi-account and recovery-based abuse patterns while preserving a practical user experience for legitimate users.

### Security properties overview

| Dimension | Current enforcement | Security effect | Future reinforcement path |
|---|---|---|---|
| Human validation | Live verification on the user device for each claim | Makes automation, emulators, and scripted farming significantly harder | Increase resistance to advanced relay or assisted-abuse scenarios |
| Claim uniqueness | One claim per eligible account, per campaign | Prevents repeated claims from the same account | Extend toward stronger account-device continuity checks |
| Post-claim protection | Configurable economic finality delay with frozen funds | Reduces the value of fast farming, resale, and coordinated abuse | Add more adaptive controls during the frozen period |
| Recovery / reinstall abuse | Mitigated indirectly through account-centric enforcement and claim flow controls | Limits simple replay paths, but does not yet fully anchor device continuity in all cases | Stronger device-account binding under development |
| Sybil / multi-account pressure | Raised cost through repeated human-in-the-loop verification | Makes abuse less scalable and more operationally expensive | Further reduced through tighter trusted-device association |

### Design direction

The current model already forces attackers to combine account creation, live human participation, and delayed fund release, which significantly increases operational cost.  
The next reinforcement layer is aimed at improving continuity between the claiming account and the trusted device context, so the system can more strongly constrain recovery-based and multi-account abuse without degrading legitimate user recovery flows.

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
### Account-Centric Participation

A campaign can only be claimed once per eligible account.

The current system primarily enforces uniqueness at the account level, combined with live on-device validation and delayed release. This already increases the cost of:

- multiple wallet farming from a single attack workflow
- repeated scripted claiming
- emulator-assisted abuse
- replay-oriented claim automation

Over time, this model can be reinforced by stronger device-account continuity mechanisms derived from **trusted runtime behavior rather than static identifiers**. This future direction is intended to further reduce reinstall, recovery-loop, and multi-account abuse **without introducing brittle device-lock assumptions**.

:::info Optional hardening for high-value campaigns
For high-value asset distributions, stricter continuity policies can be enabled.  
For example, claims may be temporarily blocked while a recovery procedure is active, as an additional safeguard against reinstall, recovery-loop, or account-transfer abuse during the campaign period.
:::

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
## Anti-Bot Guarantees

| Attack | Protection |
|---|---|
| Scripted wallets | Human validation required |
| Wallet farms | Account-level uniqueness plus repeated human validation |
| Reinstall farming | Limited by account-centric enforcement; stronger mitigation planned through device-account continuity |
| Emulators | Live runtime validation increases abuse cost |
| Replay attacks | Two-step validation |
| Instant resale | Freeze period |
| Batch claiming | Claim limit |

## Asset Handling

The distribution account must be pre-funded.

Supported assets:

- native tokens
- external chain assets requiring transaction signing authority

## Shared Validation Logic

Validation logic must be shared across modules to avoid divergence:

- recovery module
- validation module
- distribution module

No duplicated validation implementations are allowed.

## UX Integration

The wallet interface handles:

- campaign creation
- link generation
- QR generation (later)
- claim status
- freeze countdown

The protocol layer verifies correctness and enforces fairness.

## Guarantees Provided

The ADM is designed to ensure that:

- each eligible account receives at most one allocation per campaign
- automated abuse cannot scale efficiently without repeated human participation
- distribution remains permissionless
- the issuer keeps full control over supply

This shifts airdrops from probabilistic marketing campaigns toward verifiable human-centered distributions.

