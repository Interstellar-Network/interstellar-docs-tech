---
sidebar_label: 'Summary'
sidebar_position: 1
---

# Summary

This documentation supports the delivery of **Milestone 1** of Interstellar's testnet development. It introduces a subset of Interstellar’s secure Web3 account features, focused on enabling **passwordless onboarding**, **attested user authentication**, **transaction-level validation**, and **flexible recovery**—all designed for mobile-first, self-custodial environments.

![doc structure](/img/docs_structure.svg)

## Features Delivered

Milestone 1 includes the following end-user capabilities:

- **Instant user onboarding** with no seed phrases or passwords
- **Strong authentication** using biometric unlock and Secure Element (SE) attestation
- **Trusted transaction and sensitive action validation** with SE-based signature confirmation
- **Efficient account recovery** via **secure file (cloud) backup** and **NFC tag-based recovery items**

These features are designed to align with **DSP-SCA** requirements, improve resilience against phishing or malware, and deliver a more accessible recovery model for mainstream users.

## Components Delivered

The underlying technical components are implemented as **TEE-executed Substrate pallets** running within a trusted Integritee enclave. These include:

- Pallets for managing **mobile proxy accounts**, **Pure Proxy delegation**, **recovery item registration**, and **threshold logic**
- Runtime integration of SE-based attestation, key management, and validation flow
- The `MOB-REG` and `AUTH` extrinsics, enabling verifiable registration and action confirmation through **Trusted Action Validation Protocol (TAVP)**
- **VCA system** to generate **VCA Token** for (TAVP) and recovery
- Reference integration via an Android application

## Demo Tutorial

To validate Milestone 1, reviewers may use:

- The provided **Android application** (physical device or emulator)
- A **remote VPS testnet**, or a local instance via Docker
- Step-by-step instructions provided in the `Demo Tutorial` section

This tutorial includes setup guidance, environment configuration, and example flows for registration, validation, and recovery testing.

---

The next sections of this documentation are organized into:

- **Features Delivered** — a high-level overview of the core user-facing capabilities
- **Components Delivered** — a detailed look at the technical architecture and runtime logic
- **Demo Tutorial** — practical setup and walkthroughs to evaluate the delivered milestone

