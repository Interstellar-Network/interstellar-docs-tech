---
sidebar_label: 'Asset Distribution Manager'
sidebar_position: 2
---



# Asset Distribution Manager — Bot‑Resistant Airdrop System

REF: [Inisde 30 000 phone crypto airdrop bot farm](https://cointelegraph-magazine.com/inside-30000-phone-crypto-airdrop-bot-farm/)

## Executive Summary

The Asset Distribution Manager (ADM) is a bot-resistant distribution system designed to move airdrops away from easily scriptable claim flows and toward a model that requires repeated live participation on-device.

In the current M4 implementation, ADM enforces live validation during critical campaign actions, limits each eligible account to one successful claim per campaign, and can delay final release through a configurable freeze period. These controls do not provide perfect identity uniqueness or eliminate all multi-account abuse, but they do materially reduce the efficiency and scalability of common farming and replay-based strategies.

The practical security value of ADM is straightforward: abuse becomes more operationally expensive, less automatable, and harder to scale reliably than in conventional open airdrop systems.


---
## Asset Distribution Manager — Bot-Resistant Airdrop System

### Purpose

The Asset Distribution Manager (ADM) defines a secure distribution mechanism for digital assets designed to make airdrop abuse materially harder and less scalable in adversarial environments.

Its goal is not to prove unique human identity or to make abuse impossible in the absolute. Its goal is to bind each successful claim to repeated live user participation on-device, limit claims at the account level, and reduce the efficiency of simple scripted, replay-based, and farm-assisted claiming workflows.

In practical terms, ADM is intended to help issuers run fairer campaigns than conventional open airdrop flows, especially against abuse models based on automation, mass repetition, and low-cost claim orchestration.

---

### Security Model

The current ADM model is **account-centric** and **human-in-the-loop**.

It combines three main enforcement layers:

- **Live Validation** — critical campaign actions require live user validation on the device
- **Account-Level Claim Uniqueness** — an eligible account can successfully claim at most once per campaign
- **Delayed Release** — distributed funds can remain frozen for a configurable period before final release

Taken together, these controls significantly raise the operational cost of abuse compared with standard airdrop flows that can often be scripted end to end.

The current model does **not** claim:

- perfect Sybil resistance
- perfect protection against all multi-account abuse
- full device-identity continuity across reinstall or recovery scenarios
- absolute prevention of human-assisted farming

Instead, its security value is to reduce the scalability, reliability, and economic efficiency of claim automation.

---

### What the Current Model Enforces

#### 1. Live human participation at critical steps

A successful campaign flow requires live user interaction during the claim process rather than simple link opening or background automation.

This makes the following attack patterns materially harder:

- simple replay flows
- one-click scripted claiming
- large batches of unattended wallet claims
- low-friction emulator-assisted farming

#### 2. One successful claim per account, per campaign

Each eligible account can only complete one successful claim for a given campaign.

This prevents repeated claiming from the same account and forces attackers to provision additional accounts if they want to scale abuse.

#### 3. Delayed release through freeze period

After successful campaign participation, funds may remain locked for a configurable period before they can be fully claimed.

This reduces the usefulness of short-cycle farming strategies by requiring attackers to remain engaged across time rather than extracting value immediately.

---

### Current Limitations

The current ADM implementation should be described precisely.

It already raises the cost of abuse, but it does **not** yet enforce all continuity safeguards that could further reduce reinstall-based, recovery-loop, or coordinated multi-account abuse.

In particular:

- campaign participation is still primarily enforced at the **account** level
- the current implementation does **not yet** block registration or claim when a recovery has been initiated or claimed during the campaign period
- the current implementation does **not** establish strong device-account continuity in every recovery or reinstall scenario
- a sufficiently motivated attacker may still attempt abuse across many accounts if they repeatedly involve live human effort

For that reason, ADM should be presented as a **bot-resistant** and **cost-raising** distribution model, not as a fully Sybil-proof distribution system.

---

### Planned Hardening Direction

A natural next hardening step is to suspend campaign registration or claim while a recovery procedure is active or unresolved.

That safeguard is **planned**, but it is **not yet enforced in the current M4 implementation**.

Its purpose would be to reduce low-friction abuse paths based on:

- repeated recovery cycling
- reinstall-assisted campaign participation
- unstable account-state transitions during registration or claim
- transfer-style workflows during an active campaign

Longer term, continuity can also be reinforced through stronger checks derived from trusted runtime behavior rather than brittle static device identifiers.

The design direction is therefore:

- keep recovery available for legitimate users
- avoid rigid device-lock assumptions
- progressively make repeated abuse through unstable account state less practical

---

### Security Properties Overview

| Dimension | Current enforcement in M4 | Security effect | Planned reinforcement |
|---|---|---|---|
| Human validation | Live validation required during critical campaign actions | Makes unattended automation and simple scripted claiming significantly harder | Increase resistance to more advanced assisted-abuse scenarios |
| Claim uniqueness | One successful claim per account, per campaign | Prevents repeated claims from the same account | Stronger continuity checks around account state and trusted runtime |
| Delayed release | Configurable freeze period before final release | Reduces the value of fast farming and immediate extraction | Add stricter post-registration or post-claim controls where needed |
| Recovery-loop abuse | Not explicitly blocked yet | Current model raises abuse cost indirectly, but does not yet remove this path directly | Block registration or claim while recovery is active or unresolved |
| Reinstall / device switching abuse | Partially mitigated through account-centric flow and repeated live validation | Limits simple replay paths, but does not yet fully enforce continuity | Stronger device-account continuity based on trusted runtime behavior |
| Multi-account / Sybil pressure | Abuse cost increased through repeated live participation | Makes scaling abuse more operationally expensive, but does not eliminate it absolutely | Campaign-specific continuity rules and stronger recovery-state enforcement |

---

### Key Mechanisms

#### Double Validation Flow

ADM uses a two-step validation logic for campaign participation.

**1. Registration validation**

Performed when the user joins the campaign.

Purpose:

- confirm live participation
- register the account in the campaign flow
- prevent claim logic from being reduced to passive link opening

**2. Claim confirmation validation**

Performed later, after the configured freeze period, before final release.

Purpose:

- require renewed live participation at release time
- reduce the effectiveness of delayed scripted claiming
- make abuse less attractive by forcing repeated interaction across time

A campaign allocation is only finalized if the required steps complete successfully.

---

#### Account-Centric Participation

A campaign can only be successfully claimed once per eligible account.

This already increases the cost of:

- repeated scripted claiming
- replay-oriented abuse
- simple emulator-assisted farming
- multiple-wallet farming driven by a single low-friction workflow

This should be understood as a **scalability-reduction mechanism**, not as a claim of perfect identity uniqueness.

---

#### Freeze Period

The freeze period is a configurable delay between successful campaign participation and final release of funds.

Its role is to:

- reduce immediate extraction value
- discourage fast-farm / instant-resale strategies
- require sustained participation across time
- make campaigns less attractive to highly short-term abuse models

The freeze duration is defined at campaign creation.

---

#### Claim Limits

Each campaign defines a maximum number of successful claims.

The system tracks validated campaign participation rather than counting simple link openings or raw traffic.

When the maximum number of successful claims is reached, the campaign closes automatically.

---

### Campaign Lifecycle

#### 1. Creation

A campaign is created with its distribution parameters, such as:

- target asset
- claim limit
- registration window
- claim window
- freeze period

The campaign creator becomes the campaign owner, and a dedicated funding address is assigned.

At creation time, the campaign is not yet ready for distribution until it is properly funded.

#### 2. Funding

The campaign funding address must be funded externally.

Once funding is detected and the campaign conditions are met, the campaign can progress to the participation phase.

#### 3. Registration

A user accesses the campaign through the supported entry flow, currently based on app deep links.

The registration step triggers live validation and records campaign participation.

#### 4. Claim completion

After the configured freeze period, the participant completes the claim confirmation step.

If the required conditions are satisfied, the allocation is released.

#### 5. Closure

A campaign closes when one of the following occurs:

- the maximum number of successful claims is reached
- the campaign time window expires
- the campaign owner closes it early, if allowed by the flow

---

### Anti-Abuse Positioning

ADM is designed to improve distribution robustness against common abuse patterns.

| Abuse pattern | Current effect of ADM |
|---|---|
| Scripted claiming | Harder, because critical steps require live validation |
| Replay-based flows | Reduced, because participation is not based on passive link reuse alone |
| Same-account repeated claiming | Blocked by per-campaign account-level uniqueness |
| Fast farming / immediate resale | Reduced by delayed release and freeze period |
| Large-scale low-friction automation | Made more expensive operationally |
| Recovery-loop abuse | Not yet explicitly blocked in M4 |
| Multi-account human-assisted farming | More costly, but not eliminated absolutely |

This is why ADM should be described as a **bot-resistant** distribution model rather than as an absolute anti-bot guarantee.

---

### Asset Handling

The distribution account must be funded in advance.

ADM can support:

- native assets
- external-chain assets where the required transaction flow is supported by the wallet and campaign logic

The protocol is concerned with secure distribution flow and claim validation, not only with link opening or user redirection.

---

### Shared Validation Logic

Validation logic should remain consistent across modules that rely on the same trust boundary.

In particular, campaign-related validation should not diverge from the broader trusted action validation model used elsewhere in the wallet.

This avoids fragmented security assumptions and reduces the risk of inconsistent enforcement paths across recovery, validation, and distribution features.

---

### UX Integration

The wallet interface handles the campaign flow exposed to the user, including:

- campaign creation
- deep-link campaign access
- participation status
- claim progression
- countdown and timing visibility

From a security standpoint, UX is not cosmetic: clear state transitions, reliable refresh behavior, and understandable user actions are part of correct enforcement because they reduce operator error during campaign participation.

That said, ADM security should not be confused with polished production UX. The current M4 implementation proves the core flow, while further refinement of the user experience remains necessary.

---

### Guarantees Provided by the Current ADM Model

Within the current M4 implementation, ADM is designed to ensure that:

- each eligible account can complete at most one successful claim per campaign
- successful campaign participation requires live user interaction at critical steps
- distribution can be made less attractive to short-cycle abuse through delayed release
- simple replay-based and unattended claim automation do not scale efficiently
- large-scale abuse becomes more operationally expensive than in conventional open airdrop systems

ADM does **not** yet guarantee:

- unique human identity across all accounts
- full resistance to coordinated human-assisted multi-account farming
- complete protection against recovery-loop or reinstall-based abuse
- perfect fairness in the absolute

A more precise summary is:

> ADM shifts airdrop distribution away from low-friction, easily scriptable claim flows toward a model where abuse requires repeated live participation, more operational effort, and more sustained coordination.

That is the current security value of the system, and the basis on which future hardening layers can be added.