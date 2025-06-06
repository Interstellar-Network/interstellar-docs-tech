---
sidebar_label: 'Introduction'
sidebar_position: 0
---

# Introduction

This documentation site is specifically designed to **assist curators in reviewing and validating the milestones** associated with the development and deployment of the Interstellar testnet. These milestones pertain to the implementation of advanced **secure Web3 account features** currently under active development by Interstellar. The initial delivery of these features will be available through a **dedicated mobile wallet application**. Subsequent releases will extend support via a **mobile SDK**, enabling seamless integration for third-party wallet providers and decentralized applications (dApps) operating on mobile platforms.

:::tip Skip the Docs?

You can start directly with the [**Shortcut Path for Reviewers**](./Milestones/M1/quick-start-evaluator.md) to evaluate Milestone 1 without needing to read the full documentation upfront.

That said, we recommend reading the [**Manifesto**](./Manifesto/manifesto.md) first to understand the broader vision and security model behind Interstellar’s architecture.

:::




:::info Why Our Source Code Is Not Yet Public

**User security is at the heart of Interstellar’s mission.**

Our architecture introduces a new category of authentication and action validation mechanisms that go far beyond the state of the art — including dynamic visual cryptography, secure enclave-based key attestation, and garbled circuit-based behavioral validation.

These mechanisms are specifically designed to comply with and potentially exceed the highest security standards in the industry, including those relevant for PSD2, SOC2, and decentralized identity frameworks.

Because of this, we have taken the responsible position to **withhold source code publication until our final testnet release**. This decision is based on the following principles:

- **Protecting users and integrators from unverified or unsafe reuse** of cryptographic components or SDKs that are not yet audited or hardened for general use  
- **Preventing adversarial learning or adaptation** based on unfinished components, especially in a domain where attackers increasingly use AI to reverse-engineer or mimic behaviors  
- **Preserving security model integrity**, including controlled validation of how and when sensitive components (like Trusted Action Validation Protocol circuits) are deployed  
- **Ensuring reproducible, verifiable builds** and integration with formal verification and remote attestation mechanisms — so the eventual public release meets the highest standards of transparency *and* trust  
- **Avoiding fragmentation or misuse** by external parties who may misunderstand or repurpose core systems before the correct documentation, test harnesses, and dependency controls are in place

Interstellar is committed to progressive disclosure. The codebase will be open-sourced in full, beginning with the final testnet phase — alongside developer tooling and documentation that reflect its intended usage and security posture.

This is not a delay in openness. It’s a commitment to **responsible decentralization and user-first security**.

:::
