---
sidebar_label: 'PoHI Agent Authorization Layer'
sidebar_position: 12
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# PoHI for Bounded Agent Delegation

## Overview

As software agents gain access to wallets, APIs, enterprise tools, and payment systems, the core security challenge is no longer limited to authentication.

The harder problem is authorization:

**how can a human decision be transformed into a bounded, verifiable, machine-consumable authorization artifact for a sensitive agent action?**

Interstellar’s long-term direction is to address this gap through a **PoHI-based authorization layer**.

This layer is not designed to replace identity systems, passkeys, OAuth, or agent protocols.  
Its role is to add a missing primitive:

> a human-approved authorization unit bound to the critical parameters of an action or delegation.

---

## The Core Idea

A human approval should not remain a vague consent event.

It should become a structured artifact that binds:
- who approved,
- which agent or workflow was authorized,
- which action type was allowed,
- on which resource,
- within which limits,
- for how long,
- and under which assurance level.

We refer to this artifact as a:

## **PoHI Authorization Receipt**

This receipt is intended to become the core machine-consumable object of the authorization layer.

---

## What This Layer Is — and Is Not

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Category</TableCell>
      <TableCell>What It Is</TableCell>
      <TableCell>What It Is Not</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Primary role</TableCell>
      <TableCell>A human authorization layer for bounded delegation</TableCell>
      <TableCell>A generic identity platform</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Core object</TableCell>
      <TableCell>A bounded, verifiable authorization receipt</TableCell>
      <TableCell>A reusable master credential</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Relation to passkeys</TableCell>
      <TableCell>Can offer passkey-grade UX for approvals</TableCell>
      <TableCell>A replacement for passkeys</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Relation to OAuth / agent protocols</TableCell>
      <TableCell>Compatible enforcement and integration layer</TableCell>
      <TableCell>A replacement for OAuth or agent connectivity standards</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Relation to decentralized storage</TableCell>
      <TableCell>May use decentralized trust anchors where useful</TableCell>
      <TableCell>A generic decentralized credential vault</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

## Design Principle

The authorization layer should follow a simple rule:

> **Decentralize the trust-critical invariants. Keep fast-changing operational logic off-chain or off-consensus.**

This avoids turning every runtime authorization decision into a heavy decentralized workflow while preserving strong guarantees where they matter most.

---

## Core Invariant Envelope

The PoHI Authorization Receipt should bind the parameters that materially define the meaning and risk of the approval.

### Actor invariants
- human principal reference
- approving device or trusted execution context
- target agent, workflow, or session identity

### Action invariants
- action class
- target resource or tool scope
- canonical action digest
- execution correlation handle

### Risk invariants
- quantitative limits
- temporal bounds
- replay protection
- delegability rule

### Assurance invariants
- assurance level
- step-up markers
- revocation handle

These parameters form the **core invariant envelope**.

---

## Extension Envelope

Not every parameter belongs in the decentralized or portable core.

The following elements may exist in the broader authorization flow while remaining outside the core receipt model:
- real-time risk scoring
- workflow-local context
- prompt history
- compliance metadata
- enterprise-specific policy logic
- dynamic routing details
- UX rendering information
- ephemeral execution state

This distinction is essential to keep the system both usable and performant.

---

## Hybrid Trust Model

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Component</TableCell>
      <TableCell>Recommended Model</TableCell>
      <TableCell>Reason</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Authorization receipt commitment</TableCell>
      <TableCell>Decentralized</TableCell>
      <TableCell>Improves trust, portability, and auditability</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Revocation transparency</TableCell>
      <TableCell>Decentralized</TableCell>
      <TableCell>Enables verifiable invalidation and dispute analysis</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Attestation registries</TableCell>
      <TableCell>Decentralized</TableCell>
      <TableCell>Useful as cross-domain trust anchors</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Threshold approval evidence</TableCell>
      <TableCell>Decentralized</TableCell>
      <TableCell>Supports verifiable multi-party approval models</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Live risk scoring</TableCell>
      <TableCell>Off-chain / local</TableCell>
      <TableCell>Too dynamic for consensus-based handling</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Session state</TableCell>
      <TableCell>Off-chain / local</TableCell>
      <TableCell>Operational and rapidly changing</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Execution tokens</TableCell>
      <TableCell>Off-chain / local</TableCell>
      <TableCell>Must remain short-lived and efficient</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Enterprise policy logic</TableCell>
      <TableCell>Off-chain / local</TableCell>
      <TableCell>Needs flexibility and frequent updates</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

## Protocol Sketch

### 1. Agent submits a bounded request
An agent requests a narrowly scoped authority, for example:
- a specific action class
- a target tool or resource
- a hard limit
- a time window
- an optional plan or workflow hash

### 2. Gateway canonicalizes the request
The system transforms the request into a **canonical authorization envelope**.

If the request cannot be normalized into a stable and understandable structure, it should not be approved.

### 3. User performs a PoHI confirmation
The user reviews the bounded request through a trusted approval flow and confirms it via PoHI.

### 4. A PoHI Authorization Receipt is generated
The system issues a bounded receipt tied to the critical action parameters.

### 5. Runtime derives narrow execution rights
The receipt is converted into a narrow execution grant such as:
- a one-time signer release
- a short-lived token
- a session-bound capability
- a bounded API authorization

### 6. Execution is correlated
The execution is linked back to the receipt using an execution correlation handle.

### 7. Revocation or step-up remains possible
If the context changes before execution, the system can:
- revoke the authorization
- or require a stronger PoHI approval

---

## Why This Matters for Agents

Most agent systems can request permissions and consume delegated access.

What they generally lack is a strong guarantee that:
- the human approval was intentional,
- the approved scope was bounded,
- the authorized action can be verified later,
- and the agent cannot silently reinterpret the approval after issuance.

This is the role of the PoHI authorization layer.

---

## Initial Use Cases

A first version of the model could apply to:
- smart-account transaction approval
- payment approval for agentic workflows
- custody or signer release
- bounded tool access for a session
- high-risk enterprise actions requiring explicit human authorization

These use cases are narrow enough to be modeled precisely and valuable enough to justify a stronger approval primitive.

---

## Key Challenges

### Canonicalization
The hardest problem is not storage or signatures.

The hardest problem is defining a canonical action envelope that is:
- precise enough to be secure,
- understandable enough to be approved by a human,
- and stable enough to be enforced by machines.

### Receipt-to-execution binding
A second critical challenge is ensuring that the final machine action truly corresponds to the approved authorization receipt.

Without strong execution binding, the system risks becoming only a better approval interface.

### Usability
The receipt must bind the parameters that materially define risk without forcing the user to inspect excessive implementation detail.

---

## Long-Term Direction

The long-term goal is not to replace the broader identity and authorization ecosystem.

It is to introduce a missing middle-layer primitive:

### Layer 1
Human PoHI decision

### Layer 2
Bounded authorization receipt

### Layer 3
Execution adapters and enforcement rails

This architecture makes it possible to remain compatible with evolving standards while preserving a clear and differentiated core.

---

## Summary

Interstellar’s future authorization layer for agents can be understood as follows:

> **PoHI turns a human approval into a bounded, verifiable authorization receipt that machines can consume but not freely reinterpret.**

That is the strategic direction:
- stronger than a simple consent UI,
- narrower and more credible than a new identity standard,
- and compatible with the execution rails that will continue to evolve around it.