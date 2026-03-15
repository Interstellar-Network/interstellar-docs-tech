---
sidebar_label: 'Trusted Action Links'
sidebar_position: 3
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# Trusted Action Links

## Executive Summary

Trusted Action Links (TAL) are a forward-looking Interstellar architecture for turning low-friction links into secure entry points for wallet-native actions.

Instead of treating a link as a simple redirect, TAL treats it as a contextual action surface: a way to bring a user directly into the correct wallet state, with the correct action context, policy requirements, and validation flow.

In practical terms, this means a link can do more than open a page. It can open a specific claim flow, payment flow, approval flow, or other sensitive wallet action, while preserving the security logic required for that action.

The current M4 implementation does **not** yet deliver TAL as a general-purpose product. In M4, the delivered scope is campaign-scoped link handling inside the Asset Distribution Manager (ADM), primarily through app-native deep-link routing. TAL describes the broader roadmap that extends this pattern into a reusable action-entry architecture.

---

## Purpose

The purpose of Trusted Action Links is to combine three properties that are usually fragmented:

- **low-friction entry**, because links remain one of the simplest distribution and onboarding primitives on the internet;
- **contextual wallet execution**, because the user should land directly in the correct action flow rather than manually reconstructing intent;
- **policy-aware security**, because sensitive actions should be able to trigger the correct level of validation rather than relying on blind approval.

This architecture is designed to support a progression from lightweight campaign access toward more sensitive wallet-native actions such as payments, secure approvals, and later delegated or agent-mediated authorization flows.

---

## Why This Matters

Traditional links are extremely effective for distribution, growth, and conversion, but they are weak security primitives. They typically redirect the user somewhere, then rely on the user to recover the meaning of the action and approve it in a separate context.

Interstellar’s view is different: for digital assets and sensitive actions, the entry surface should preserve the context of the action itself.

A trusted action link is therefore not just a URL. It is a contextual entry point into a wallet-native action flow.

This is valuable because it can improve:

- **user conversion**, by reducing unnecessary friction;
- **action correctness**, by preserving context instead of forcing manual reconstruction;
- **security**, by enabling policy-aware validation when action sensitivity increases;
- **wallet distribution**, by allowing the wallet to appear exactly when the user needs to perform a meaningful action.

---

## From Campaign Links to Trusted Action Links

The first practical form of this architecture appears in ADM.

In M4, campaign links are used to route participants into the correct in-app campaign flow with minimal friction. These links preserve campaign context and allow the wallet to resolve the relevant participation state, registration path, and claim progression logic.

This is still a campaign-specific implementation. It should not yet be interpreted as a fully generalized TAL system.

However, it establishes the core pattern:

- a link carries the user into the correct wallet context;
- the wallet resolves the intended action;
- the flow remains governed by protocol and policy, not by link opening alone;
- validation can occur at the correct point in the action lifecycle.

That pattern can later be extended beyond campaigns.

:::info Current scope vs roadmap
In M4, Interstellar delivers campaign-scoped link orchestration inside ADM. Trusted Action Links describe the broader roadmap that generalizes this pattern to future payment, approval, and sensitive action flows.
:::

---

## Core Concept

A Trusted Action Link is a link-based entry point that opens a wallet-native action together with its relevant execution context.

Conceptually, a TAL can include or resolve information such as:

- action type;
- campaign or payment context;
- target asset;
- destination or beneficiary context;
- amount or value constraints;
- validity window;
- policy flags;
- required validation level;
- optional escalation conditions.

The key design principle is that **opening the link is not the action itself**.

A TAL should be understood as:

- an **entry point** into the correct action flow;
- a **context carrier** for the intended operation;
- and a **policy-aware trigger** for the right validation logic.

This distinction is critical. It preserves low friction at entry while preventing the security model from collapsing into blind-link execution.

---

## Action Categories

Over time, the same TAL architecture can support several categories of wallet-native actions.

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Action category</TableCell>
      <TableCell>Example</TableCell>
      <TableCell>Why TAL is useful</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Campaign actions</TableCell>
      <TableCell>Airdrop registration or claim flow</TableCell>
      <TableCell>Preserves campaign context and minimizes onboarding friction</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Payment actions</TableCell>
      <TableCell>Wallet-native payment request or settlement flow</TableCell>
      <TableCell>Preserves amount, asset, destination, and approval context</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Secure approval actions</TableCell>
      <TableCell>Validation of a sensitive transfer or privileged operation</TableCell>
      <TableCell>Allows risk-based validation escalation instead of blind signing</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Embedded wallet actions</TableCell>
      <TableCell>User enters a contextual wallet flow from a partner surface</TableCell>
      <TableCell>Makes the wallet a just-in-time action layer instead of a precondition</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Delegated or agent-mediated actions</TableCell>
      <TableCell>User approval of a payment or task proposed by a payment agent</TableCell>
      <TableCell>Creates a natural authorization boundary between automated intent generation and verified human approval</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

## Low-Friction by Design

One of the main reasons TAL matters is that it preserves a very strong product property: **action entry remains simple**.

Users do not need to begin with a heavy setup ceremony just to reach the relevant action. Instead, they can start from a low-friction contextual surface such as:

- a campaign link;
- a payment request;
- a merchant or partner entry point;
- a partner-controlled embedded-wallet flow;
- or another contextual invitation to act.

This makes TAL especially attractive for:

- high-conversion distribution flows;
- embedded-wallet adoption;
- partner integrations;
- and actions where usability matters as much as security.

The design goal is therefore not to add security by making users do more work up front. The design goal is to keep entry simple, while allowing validation strength to increase only when the action warrants it.

---

## Security Model

Trusted Action Links are designed around a simple principle:

> low-friction entry does not imply low-assurance execution.

A TAL should be able to open a flow lightly while still allowing the wallet and protocol to apply the right security policy at execution time.

This means the security boundary can evolve with the action:

- low-sensitivity action → lightweight validation path;
- moderate-sensitivity action → stronger confirmation and contextual approval;
- high-sensitivity action → trusted action validation with stronger runtime and user-verification requirements.

This security ladder is important. It prevents the product from forcing every flow into maximum friction, while still keeping room for stronger assurances where needed.

---

## TAL and Validation Escalation

Over time, TAL is intended to work together with Interstellar’s broader validation model.

That means a link can eventually serve not only as an access surface, but also as the contextual trigger for the appropriate validation level.

Examples of future escalation paths may include:

- stronger transaction-aware confirmation flows;
- runtime-derived continuity checks;
- higher-assurance approval for large-value payments;
- trusted display / trusted validation flows for sensitive actions;
- and later, deeper integration with Interstellar’s trusted action validation mechanisms.

At this stage, these should be understood as roadmap directions rather than current M4-delivered TAL capabilities.

---

## Relationship to Proof of Human Intent

Trusted Action Links are not themselves a Proof of Human Intent system.

However, they are a natural product surface through which Proof of Human Intent can later be applied.

This matters because many important actions do not begin inside a wallet. They begin from an external context:

- a campaign invitation;
- a payment request;
- a merchant checkout;
- a delegated workflow;
- or an agent-proposed operation.

If Interstellar’s long-term goal is to secure human authorization of sensitive actions, then TAL provides a practical entry layer for bringing those actions into the right validation boundary.

In that sense, TAL can be understood as one of the bridges between today’s wallet-native flows and tomorrow’s broader PoHI-governed authorization model.

That does **not** mean TAL should currently be marketed as a full PoHI authorization product. The more accurate statement is:

> TAL is a low-friction action-entry architecture that creates the right surface for progressively stronger human-intent validation over time.

---

## Embedded Wallet Distribution

TAL is also strategically important for wallet distribution.

Users rarely adopt a wallet in the abstract. They adopt it when they have a reason to perform an action.

A TAL-based model allows the wallet to appear exactly when the action matters:

- the user receives a contextual link;
- the link opens the relevant wallet-native flow;
- the wallet context is created, resumed, or resolved;
- the action is completed with the appropriate policy and validation.

This is particularly attractive for embedded-wallet strategies because it avoids making “download and configure the wallet first” the primary entry point.

Instead, the wallet becomes the secure execution layer behind a meaningful user action.

---

## Roadmap Progression

The TAL roadmap can be understood in stages.

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Stage</TableCell>
      <TableCell>Description</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>M4 foundation</TableCell>
      <TableCell>Campaign-scoped deep-link orchestration inside ADM</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Generalized wallet action routing</TableCell>
      <TableCell>Reusable link-driven entry into broader wallet-native actions</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Payment and approval flows</TableCell>
      <TableCell>Policy-aware payment links and secure approval links</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Trusted validation escalation</TableCell>
      <TableCell>Action-sensitive security escalation based on value, context, and risk</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Delegated / agent-mediated authorization</TableCell>
      <TableCell>User-controlled approval of automated or agent-proposed actions under stronger human-intent validation</TableCell>
    </TableRow>
  </TableBody>
</Table>

This staged view is important because it keeps the roadmap disciplined. It shows continuity from current delivery without overstating what has already been implemented.

---

## What TAL Is Not

At this stage, TAL should **not** be confused with:

- a generic link shortener;
- a simple redirect system;
- blind-signing through a link;
- a fully delivered payment-link product in M4;
- or a complete Proof of Human Intent authorization framework by itself.

TAL is best understood as a **roadmap architecture** for secure, contextual, low-friction wallet action entry.

---

## Why TAL Matters for the Ecosystem

For the broader ecosystem, TAL creates a practical bridge between usability and stronger action security.

It allows partners, apps, campaigns, merchants, and future automated systems to initiate meaningful wallet-native actions through a low-friction surface, while preserving the possibility of stronger validation when needed.

This is particularly relevant in environments moving toward:

- embedded wallets;
- account abstraction;
- richer payment and commerce flows;
- delegated user actions;
- and future payment-agent or AI-agent interactions.

In that context, TAL is not only a UX mechanism. It is part of the infrastructure needed to keep human authorization meaningful as action flows become more automated.

---

## Summary

Trusted Action Links are a roadmap architecture for transforming low-friction links into secure entry points for contextual wallet-native actions.

Their long-term value is to unify:

- campaign access;
- wallet distribution;
- payment initiation;
- secure approval flows;
- and later, delegated or agent-mediated authorization

under a common model where links carry users into the right action context and the right validation boundary.

Today, this architecture begins in a narrow and practical form through campaign-scoped link handling inside ADM.

Over time, it can evolve into a broader authorization surface that helps Interstellar move from bot-resistant distribution toward a more general model of trusted human approval for sensitive digital actions.