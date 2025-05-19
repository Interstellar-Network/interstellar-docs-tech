---
sidebar_label: 'Master Circuit Pipeline'
sidebar_position: 1
---

# Master Circuit Pipeline

The **Master Circuit Pipeline** defines the end-to-end flow used to generate VCA Tokens from a high-level specification of user interaction logic. This pipeline enables Interstellar to produce tamper-proof, human-verifiable, and hardware-bound authentication flows using optimized garbled circuit technology.

---

## Purpose

The pipeline transforms a **VHDL-based logical specification** of a secure interaction (e.g., transaction approval, recovery validation) into a **garbled circuit program** that:

- Preserves user privacy and computation secrecy
- Embeds randomized elements (e.g., keypad layout, message rendering)
- Executes on-device with support for SE-bound signatures
- Can be verified cryptographically by the TEE runtime

---

## Pipeline Overview

The pipeline consists of the following stages:

### 1. VHDL Circuit Design

The logical interaction model is first expressed in **VHDL** (Verilog Hardware Description Language). This design specifies:

- The number of input gates (e.g., digits, toggles)
- The output condition (e.g., match against expected code or biometric validation)
- Message blocks and input masking logic
- The UX flow such as keypad layout, confirmation prompt, or cognitive test

### 2. Compilation & Optimization

The VHDL circuit is then passed through:

- **Yosys**: Logic synthesis and optimization engine - combination of sub-circuits
- **ABC**: Netlist and optimization


This produces a hardware-equivalent intermediate representation (IR) optimized for secure evaluation.

### 3. TEE-based Garbling

Within a trusted execution environment:
- The circuit is **garbled** using a newly implemented algorithm optimized by Interstellar for mobile performance
- Randomization is applied to input encodings, gate ordering, and memory layout
- The final circuit includes:
  - Encrypted gate and layout structure
  - Visual layout information for rendering digits/messages
- For performance reasons, this garbling flow does **not** rely on oblivious transfer as in classical MPC schemes.

### 4. SE-Entropy Integration

A signature from the device’s **Secure Element (SE)** is injected on the client side as a **verifiable input and entropy source**. This input:

- Ensures execution uniqueness per session and per device
- Enables the TEE runtime to **cryptographically verify circuit execution**
- Serves as a strong entropy source for **randomizing visual cryptographic shares**, preventing attackers from guessing or injecting fake digit segments

> This mechanism is part of the finalized specification and will be introduced in a future milestone. It is not yet included in the Milestone 1 implementation.

### 5. Output and Registry

The output is:
- Stored as a secure file (VCA Token)
- Hashed (fingerprint)
- Registered on-chain via the VCA Token Registry

The secure file can now be delivered to the mobile device, stored in cloud backup, or linked to a recovery policy.

---

## Performance Enhancements

Interstellar has implemented a **custom garbling algorithm** that significantly reduces evaluation time and memory overhead. This enables:

- **Over 100 FPS circuit execution** on mid-range Android devices
- Visual UI responsiveness compatible with biometric UX expectations
- Robustness against layout prediction and spoofing via entropy-bound circuit paths

---

## Summary

The Master Circuit Pipeline turns high-level user interaction logic into secure, verifiable, on-device programs through a combination of **hardware design tools**, **TEE execution**, and **SE-integrated entropy**. It is a cornerstone of Interstellar’s decentralized, mobile-first authentication model.
