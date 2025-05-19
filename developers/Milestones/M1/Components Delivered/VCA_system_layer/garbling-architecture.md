---
sidebar_label: 'Garbling Architecture'
sidebar_position: 2
---

# Garbling Architecture

Interstellar implements a **custom garbling architecture** optimized for secure, fast, and private execution of user interaction logic on mobile devices. This engine forms the core of the VCA Token system and is designed to meet the demanding UX and security requirements of mobile-first Web3 authentication.

---

## Objectives

Unlike traditional server-side garbled circuit systems or MPC protocols, this architecture is built for:

- **Local evaluation on resource-constrained devices**
- **Interactive use cases** (e.g. user enters 2-digit code)
- **Human-verifiable visual flows**
- **Execution within 1–2 frames** to meet real-time UX demands

---

## Key Design Elements

### Circuit Minimization
- Circuits are first optimized using **ABC** and **Yosys**, producing a lean logical structure.
- Gate count and depth are minimized to reduce computational and memory overhead.

### Randomized Wire Mapping
- During garbling, wire labels are assigned with full randomization.
- This prevents structural leakage and ensures circuit obfuscation across sessions.
- Wire aliases are not reused and are dynamically re-keyed.

### Execution Unpredictability
- Each garbled circuit has randomized layout, gate ordering, and input encoding.
- This makes the structure impossible to reverse-engineer and prevents statistical inference.

### Frame-Responsive Evaluation
- The execution pipeline is tuned to support **100+ FPS** on mid-range mobile hardware.
- Parallel wire evaluation and gate batching are employed to align with screen refresh cycles.
- No memory persistence beyond execution frame—data is discarded in-memory after signing.

---

## UX and Security Integration

- Each garbled circuit renders a **digit segment layout** or message screen.
- These visual components are tied to **secure randomization** derived from SE entropy.
- The layout changes every session, so attackers cannot learn or guess visual inputs.
- The signed output can be verified by the runtime as coming from a legitimate execution flow.

---

## Comparison with Classical Models

| Property                     | Classical GC / MPC         | Interstellar Garbling         |
|-----------------------------|-----------------------------|-------------------------------|
| Oblivious Transfer          | ✅ Required                 | ❌ Not used (for performance) |
| Server-side dependency      | ✅ Often required           | ❌ Fully local                |
| UX responsiveness           | ❌ Low                      | ✅ 100+ FPS optimized         |
| Visual interaction support  | ❌ None                     | ✅ Native                     |
| SE-integrated entropy       | ❌ Absent                   | ✅ Core security input        |

---

## Summary

The garbling architecture developed by Interstellar enables **real-time, secure, and verifiable** execution of logic-heavy user interactions—such as transaction confirmations and recovery steps—on everyday mobile devices. It ensures that every VCA Token is unique, unpredictable, and strongly bound to the user’s device and session context.
