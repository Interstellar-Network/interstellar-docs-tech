---
sidebar_label: 'From Authentication to Human Authorization'
sidebar_position: 5
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# From Authentication to Human Authorization

**Future Direction**

Interstellar is initially entering the market through a practical and immediate use case: securing high-risk actions in smart accounts for wallet providers, custodians, exchanges, and DEX infrastructure.

Our upcoming testnet focuses on that first step through an SDK that combines **Proof of Human Intent (PoHI)** with a **decentralized signer and verifier network**.

But this architecture points to something larger.

Authentication proves **who** is present.  
Policy defines **what** is allowed.  
Neither reliably proves that a human being **deliberately authorized a specific action at the exact moment of execution**.

That is the gap Interstellar is designed to close.

## Executive Overview

Interstellar is building toward a broader **human authorization layer** for digital systems.

Today, this starts with smart-account security: binding sensitive operations such as transfers, approvals, withdrawals, and policy changes to a stronger proof of deliberate human approval.

Over time, the same architecture can extend to:
- delegated workflows,
- bounded automation,
- stablecoin control operations,
- and later autonomous systems or AI agents operating under explicit human constraints.

This is not a shift away from authentication.

It is the natural extension of authentication into the domain where identity alone is no longer enough.

## The Missing Layer

Modern systems can be:
- authenticated,
- policy-compliant,
- and cryptographically valid,

while still executing actions that were **not genuinely intended** by the human in control.

This is the **intent gap**.

Interstellar’s answer is PoHI: a mechanism that makes authorization more explicit, more verifiable, and harder to simulate, replay, or silently delegate.

In this model, the goal is not simply to confirm a session.

The goal is to ensure that **the action itself is approved**.

## From Identity to Authorization

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Layer</TableCell>
      <TableCell>What it proves</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell><strong>Authentication</strong></TableCell>
      <TableCell>Who the user is, or which device/session is active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Policy</strong></TableCell>
      <TableCell>What is allowed under rules, limits, or permissions</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Human Authorization</strong></TableCell>
      <TableCell>That a specific human deliberately approved a specific action under explicit constraints at a specific moment</TableCell>
    </TableRow>
  </TableBody>
</Table>

PoHI is the foundation for this third layer.



## What PoHI Changes

Traditional approval flows are usually assembled from multiple controls:
- MFA,
- confirmation screens,
- policy engines,
- hardware signing,
- backend checks,
- and audit logs.

These controls can be useful, but they are fragmented.

PoHI moves toward a simpler model:

**one action → one proof → one enforcement point**

Instead of assuming intent survives across screens, sessions, and intermediaries, Interstellar binds authorization directly to the action approaching the irreversible boundary.

If the proof is missing or invalid, execution does not proceed.

## Why This Matters

This matters today in digital finance, where irreversible actions must be secured without excessive friction.

It matters even more tomorrow, as digital systems become increasingly delegated and autonomous.

As software gains the ability to act faster, more frequently, and under looser human supervision, a stronger execution boundary becomes necessary. Interstellar’s long-term vision is to provide that boundary through a decentralized, cryptographic human authorization layer.

## Interstellar Roadmap

A simple way to understand the trajectory is:

1. **Advanced authentication**
2. **Action-bound authorization for smart accounts**
3. **Bounded delegation for automated workflows**
4. **Human authorization layer for autonomous systems**

The current product starts at step one and step two.

The broader framework becomes increasingly relevant as automation, compliance, and agent-mediated execution continue to grow.

## Design Principles

The long-term direction follows a few clear principles:

- **Atomic authorization**  
  The human decision and the action being executed must remain tightly bound.

- **Final-boundary enforcement**  
  Verification should happen where execution becomes materially irreversible.

- **Explicit constraints**  
  Authorization can be linked to limits, scope, thresholds, destinations, or time windows.

- **Decentralized trust**  
  No single backend, operator, or signer should be able to authorize critical actions alone.

## Closing Perspective

Interstellar begins with a concrete product for smart accounts and digital finance infrastructure.

But the larger opportunity is more fundamental.

As digital systems become more autonomous, security will increasingly depend not only on authentication or policy, but on the ability to prove that human authority remained present at the point that mattered most.

That is the direction Interstellar is building toward:

**not only better authentication, but a stronger human authorization layer for digital execution.**