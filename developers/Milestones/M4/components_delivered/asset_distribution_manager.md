---
sidebar_label: 'Asset Distribution Manager'
sidebar_position: 2
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# Asset Distribution Manager — Bot-Resistant Airdrop System


REF: [Inside a 30,000 phone crypto airdrop bot farm](https://cointelegraph-magazine.com/inside-30000-phone-crypto-airdrop-bot-farm/)



## Executive Summary

The Asset Distribution Manager (ADM) is a bot-resistant distribution framework designed to help issuers run digital asset campaigns that remain simple for legitimate users, while becoming materially harder to exploit at scale through scripted claiming, replay-based flows, and low-friction farming strategies.

In its current M4 form, ADM combines three main controls:

- live user validation during critical campaign steps;
- one successful claim per eligible account, per campaign;
- a configurable freeze period before final release.

This does **not** make abuse impossible and does **not** provide full Sybil resistance. Its purpose is different: ADM is designed to **raise the operational cost**, **reduce the scalability**, and **decrease the reliability** of abuse, while preserving a lightweight campaign participation flow.

ADM should therefore be understood as a **low-friction, cost-raising distribution model** rather than as a global proof-of-personhood system.


---

## Purpose

The purpose of ADM is to improve the robustness of digital asset distribution in adversarial environments where issuers may face:

- scripted claim automation;
- emulator-assisted claim farming;
- replay-oriented workflows;
- low-cost multi-account orchestration;
- and repeated abuse attempts driven by frictionless claim flows.

The goal is not to establish universal human uniqueness. The goal is to bind successful campaign participation to repeated live user interaction on-device, while keeping onboarding compatible with lightweight entry flows such as direct app links.

This makes ADM especially suitable for campaigns where issuers need a stronger anti-abuse posture than a standard open airdrop, but do not want to impose **heavyweight identity enrollment** or **high-friction pre-registration**.

---

## Why ADM Fits Real-World Campaigns

A key advantage of ADM is that it improves abuse resistance **without requiring heavyweight proof-of-personhood onboarding**.

Users do not need to complete a prior biometric enrollment ceremony, persistent identity registration flow, or external uniqueness process before participating in a campaign. Instead, ADM keeps campaign entry compatible with lightweight wallet-native flows such as deep links, while still requiring live validation at critical stages.

This positions ADM differently from both extremes:

- **conventional open airdrops**, which maximize reach but are easy to script and farm;
- **identity-centric proof-of-personhood systems**, which can provide stronger uniqueness properties but often introduce significantly higher onboarding friction, stronger ecosystem dependency, or more sensitive enrollment requirements.

ADM is designed for a different optimization point: **better abuse resistance than open claim systems, with much lower participation friction than heavyweight identity-centric models**.

:::info Low-friction by design
ADM is designed for campaigns that need stronger abuse resistance without requiring a heavy identity-enrollment ceremony upfront.

Unlike more identity-centric proof-of-personhood approaches, ADM keeps participation compatible with lightweight wallet-native entry flows such as direct links, while accepting a different tradeoff: it raises the cost of abuse rather than attempting to prove universal human uniqueness.
:::

---

## Security Model

The current ADM model is **account-centric** and **human-in-the-loop**.

Its current security value comes from three primary enforcement layers:

- **Live Validation** — critical campaign actions require live user interaction on-device;
- **Account-Level Claim Uniqueness** — an eligible account can complete at most one successful claim per campaign;
- **Delayed Release** — distributed funds can remain frozen for a configurable period before final release.

Taken together, these controls materially raise the cost of abuse compared with standard airdrop flows that can often be scripted end to end.

ADM does **not** currently claim:

- perfect Sybil resistance;
- perfect prevention of all multi-account abuse;
- full continuity enforcement across recovery and reinstall scenarios;
- or absolute prevention of human-assisted farming.

Its actual security contribution is more precise:

> ADM reduces the scalability and operational efficiency of abuse by forcing repeated live participation at critical stages of the distribution lifecycle.

---

## What ADM Enforces in M4

### 1. Live human participation at critical steps

A successful campaign flow requires active user participation during critical stages of campaign execution.

This makes the following attack patterns materially harder:

- simple replay flows;
- one-click scripted claiming;
- unattended batch claim automation;
- low-friction emulator-assisted claiming.

### 2. One successful claim per account, per campaign

Each eligible account can complete only one successful claim for a given campaign.

This blocks repeated claiming from the same account and forces attackers to provision additional accounts if they want to scale abuse.

### 3. Delayed release through freeze period

Campaign funds may remain locked for a configurable period before final release.

This reduces the usefulness of immediate extraction strategies by forcing attackers to remain engaged across time rather than capturing value instantly.

---

## Current Limitations

The current ADM implementation should be described precisely.

It already raises the cost of abuse, but it does **not yet** enforce all continuity safeguards that could further reduce reinstall-based, recovery-loop, or coordinated multi-account abuse.

In particular:

- campaign protection is still primarily enforced at the **account** level;
- the current implementation does **not yet** block registration or claim while a recovery has been initiated or claimed during the campaign period;
- the current implementation does **not** fully establish strong device-account continuity across all reinstall and recovery scenarios;
- a sufficiently motivated attacker may still attempt abuse across many accounts if they repeatedly involve live human effort.

For that reason, ADM should be presented as a **bot-resistant**, **cost-raising**, and **scalability-reducing** system — not as a fully Sybil-proof distribution system.

---

## Planned Hardening Direction

ADM is designed to evolve beyond a purely account-centric model.

The next hardening layer focuses on stronger continuity between:

- the campaign participant account;
- trusted runtime behavior;
- recovery state;
- and live user interaction during critical steps.

A natural near-term safeguard is to suspend campaign registration or claim while a recovery procedure is active or unresolved. This was part of the intended hardening path, but it is **not yet enforced in the current M4 implementation**.

Its purpose would be to reduce low-friction abuse paths based on:

- repeated recovery cycling;
- reinstall-assisted participation;
- unstable account-state transitions during campaign execution;
- and transfer-style workflows during an active campaign.

Longer term, Interstellar is exploring stronger continuity checks derived from trusted runtime behavior and richer live intent/input verification. At this stage, these should be understood as part of the **hardening roadmap**, not as current M4 protections.

The design objective is clear:

- preserve lightweight onboarding;
- avoid brittle device-lock assumptions;
- progressively make repeated abuse through unstable state or repeated orchestration less practical.

---

## Security Properties Overview

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Dimension</TableCell>
      <TableCell>Current enforcement in M4</TableCell>
      <TableCell>Security effect</TableCell>
      <TableCell>Planned reinforcement</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Human validation</TableCell>
      <TableCell>Live validation required during critical campaign actions</TableCell>
      <TableCell>Makes unattended automation and simple scripted claiming significantly harder</TableCell>
      <TableCell>Increase resistance to more advanced assisted-abuse scenarios</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Claim uniqueness</TableCell>
      <TableCell>One successful claim per account, per campaign</TableCell>
      <TableCell>Prevents repeated claims from the same account</TableCell>
      <TableCell>Stronger continuity checks around account state and trusted runtime</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Delayed release</TableCell>
      <TableCell>Configurable freeze period before final release</TableCell>
      <TableCell>Reduces the value of fast farming and immediate extraction</TableCell>
      <TableCell>Add stricter post-registration or post-claim controls where needed</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Recovery-loop abuse</TableCell>
      <TableCell>Not explicitly blocked yet</TableCell>
      <TableCell>Current model raises abuse cost indirectly, but does not yet remove this path directly</TableCell>
      <TableCell>Block registration or claim while recovery is active or unresolved</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Reinstall / device switching abuse</TableCell>
      <TableCell>Partially mitigated through account-centric flow and repeated live validation</TableCell>
      <TableCell>Limits simple replay paths, but does not yet fully enforce continuity</TableCell>
      <TableCell>Stronger device-account continuity based on trusted runtime behavior</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Multi-account / Sybil pressure</TableCell>
      <TableCell>Abuse cost increased through repeated live participation</TableCell>
      <TableCell>Makes scaling abuse more operationally expensive, but does not eliminate it absolutely</TableCell>
      <TableCell>Campaign-specific continuity rules and stronger recovery-state enforcement</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

## Key Mechanisms

### Double Validation Flow

ADM uses a two-step campaign participation model.

#### 1. Registration validation

Performed when the user joins the campaign.

Purpose:

- confirm live participation;
- register the account in the campaign flow;
- ensure campaign entry is more than passive link opening.

#### 2. Claim confirmation validation

Performed later, after the configured freeze period, before final release.

Purpose:

- require renewed live participation at release time;
- reduce the effectiveness of delayed scripted claiming;
- make abuse less attractive by forcing repeated interaction across time.

A campaign allocation is only finalized if the required steps complete successfully.

---

### Account-Centric Participation

A campaign can only be successfully claimed once per eligible account.

This already increases the cost of:

- repeated scripted claiming;
- replay-oriented abuse;
- simple emulator-assisted farming;
- multiple-wallet farming driven by a single low-friction workflow.

This should be understood as a **scalability-reduction mechanism**, not as a claim of perfect identity uniqueness.

---

### Freeze Period

The freeze period is a configurable delay between successful campaign participation and final release of funds.

Its role is to:

- reduce immediate extraction value;
- discourage fast-farm or instant-resale strategies;
- require sustained participation across time;
- make campaigns less attractive to very short-term abuse models.

The freeze duration is defined at campaign creation.

---

### Claim Limits

Each campaign defines a maximum number of successful claims.

The system tracks successful campaign participation rather than simple link openings or raw access attempts.

When the maximum number of successful claims is reached, the campaign closes automatically.

---

## Campaign Lifecycle

### 1. Creation

A campaign is created with its distribution parameters, such as:

- target asset;
- claim limit;
- registration window;
- claim window;
- freeze period.

The campaign creator becomes the campaign owner, and a dedicated funding address is assigned.

At creation time, the campaign is not yet ready for distribution until it is properly funded.

### 2. Funding

The campaign funding address must be funded externally.

Once funding is detected and the campaign conditions are met, the campaign can progress to the participation phase.

### 3. Registration

A user accesses the campaign through the supported campaign-entry flow, currently based on app deep links.

The registration step triggers live validation and records campaign participation.

### 4. Claim completion

After the configured freeze period, the participant completes the claim confirmation step.

If the required conditions are satisfied, the allocation is released.

### 5. Closure

A campaign closes when one of the following occurs:

- the maximum number of successful claims is reached;
- the campaign time window expires;
- the campaign owner closes it early, if allowed by the flow.

---

## Campaign Link Management

ADM includes a campaign link-management layer used to route participants into the correct campaign flow with minimal onboarding friction.

In the current model, campaign links are not treated as a generic standalone product surface. They are part of the ADM access model: they carry the user into the appropriate in-app campaign context, allowing registration, claim progression, and campaign-state retrieval from a lightweight entry point such as a deep link.

This serves several practical purposes:

- **Campaign access** — users can enter the correct campaign flow directly without navigating manually through the wallet;
- **Context preservation** — the app can resolve the campaign reference and open the relevant campaign state and action path;
- **Low-friction participation** — campaign entry remains compatible with lightweight distribution methods such as direct links, with QR-based entry as a natural extension;
- **Controlled claim flow** — link opening alone does not constitute a claim; the protocol still requires the relevant live validation and campaign steps.

From an architectural standpoint, this is why link handling was implemented as part of the integrated ADM campaign flow rather than as an isolated standalone subsystem.

In M4, the primary user-facing implementation relies on app-native deep-link handling rather than a separate web-based link-management frontend.

This distinction is important: link management in ADM should currently be understood as **campaign access orchestration**, not as a claim in itself and not yet as **a general-purpose action-link framework** (part of the future roadmap).

ADM currently uses links as a campaign access and routing layer. The broader roadmap for generalized action-oriented links is described in [Trusted Action Links](developers/components/TAL.md).

---

## Anti-Abuse Positioning

ADM is designed to improve distribution robustness against common abuse patterns without introducing heavy participation friction.

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Abuse pattern</TableCell>
      <TableCell>Current effect of ADM</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Scripted claiming</TableCell>
      <TableCell>Harder, because critical steps require live validation</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Replay-based flows</TableCell>
      <TableCell>Reduced, because participation is not based on passive link reuse alone</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Same-account repeated claiming</TableCell>
      <TableCell>Blocked by per-campaign account-level uniqueness</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Fast farming / immediate resale</TableCell>
      <TableCell>Reduced by delayed release and freeze period</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Large-scale low-friction automation</TableCell>
      <TableCell>Made more expensive operationally</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Recovery-loop abuse</TableCell>
      <TableCell>Not yet explicitly blocked in M4</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Multi-account human-assisted farming</TableCell>
      <TableCell>More costly, but not eliminated absolutely</TableCell>
    </TableRow>
  </TableBody>
</Table>

This is why ADM should be described as a **bot-resistant distribution model** rather than as an absolute anti-bot or proof-of-personhood guarantee.

---

## Asset Handling

The distribution account must be funded in advance.

ADM can support:

- native assets;
- external-chain assets where the required transaction flow is supported by the wallet and campaign logic.

ADM is concerned with secure campaign participation and claim validation, not only with opening a link or redirecting a user.

---

## Shared Validation Logic

Validation logic should remain consistent across modules that rely on the same trust boundary.

In particular, campaign-related validation should not diverge from the broader trusted validation model used elsewhere in the wallet.

This avoids fragmented security assumptions and reduces the risk of inconsistent enforcement paths across recovery, validation, and distribution features.

---

## UX Integration

The wallet interface handles the campaign flow exposed to the user, including:

- campaign creation;
- deep-link campaign access;
- participation status;
- claim progression;
- countdown and timing visibility.

From a security standpoint, UX is not cosmetic: clear state transitions, reliable refresh behavior, and understandable user actions are part of correct campaign execution because they reduce operator error during participation.

That said, ADM security should not be confused with polished production UX. The M4 implementation proves the core flow, while further refinement of testing ergonomics and end-user experience remains necessary.

---

## Guarantees Provided by the Current ADM Model

Within the current M4 implementation, ADM is designed to ensure that:

- each eligible account can complete at most one successful claim per campaign;
- successful campaign participation requires live user interaction at critical steps;
- distribution can be made less attractive to short-cycle abuse through delayed release;
- simple replay-based and unattended claim automation do not scale efficiently;
- large-scale abuse becomes more operationally expensive than in conventional open airdrop systems.

ADM does **not** yet guarantee:

- unique human identity across all accounts;
- full resistance to coordinated human-assisted multi-account farming;
- complete protection against recovery-loop or reinstall-based abuse;
- perfect fairness in the absolute.

A more precise summary is:

> ADM shifts airdrop distribution away from low-friction, easily scriptable claim flows toward a model where abuse requires repeated live participation, more operational effort, and more sustained coordination.

That is the current security value of the system and the basis on which future hardening layers can be added.

