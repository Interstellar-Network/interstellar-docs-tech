---
sidebar_label: 'Introduction'
sidebar_position: 0
---

# Introduction

This documentation site is specifically designed to **assist curators in reviewing and validating the milestones** associated with the development and deployment of the Interstellar testnet. These milestones pertain to the implementation of advanced **secure Web3 account features** currently under active development by Interstellar. The initial delivery of these features will be available through a **dedicated mobile wallet application**. Subsequent releases will extend support via a **mobile SDK**, enabling seamless integration for third-party wallet providers and decentralized applications (dApps) operating on mobile platforms.


:::tip Skip the Docs (recommended)
The documentation is intentionally **extensive** and **modular**, offering multiple perspectives for **developers**, **security** and compliance **experts**, and **decision-makers**. For reviewers, this may feel redundant.

We recommend starting with the [**Manifesto and the comparison with Hardware Wallet**](./Manifesto/manifesto.md) to grasp **the core vision and security model** behind Interstellar. 
From there, you’ll find a **shortcut link** at the end of the comparison to jump directly into the [**Shortcut Path for Reviewers**](./Milestones/M5/quick-start-evaluator.md).

The tutorial itself includes **contextual links** to core components in the docs if needed, and you can always use **search bar** (top-right corner) with relevant keywords to explore specific details.
:::


:::info WHY OUR SOURCE CODE IS NOT YET PUBLIC

**User security is central to Interstellar’s mission**

Our architecture introduces a new class of authentication and action validation technologies — including dynamic visual cryptography, secure enclave-based key attestation, and garbled circuit–based behavioral validation — designed to go beyond current best practices.

These systems are built to meet and exceed the highest security standards (e.g. PSD2, SOC2, decentralized identity frameworks). To uphold that bar, we’ve made the deliberate decision to withhold source code publication until our final testnet release.

This approach ensures:

- **User and integrator safety**, by avoiding premature reuse of cryptographic components or SDKs that have not been fully audited or hardened

- **Protection against adversarial learning**, especially in a landscape where AI is increasingly used to reverse-engineer systems

- **Integrity of our security model**, through controlled rollout of sensitive components like Trusted Action Validation Protocol circuits

- **Reproducibility and transparency**, with verified builds and remote attestation to ensure trust in the open-source release

- **Responsible adoption**, by preventing fragmentation or misapplication before documentation, test harnesses, and dependency controls are in place

We’re committed to full open sourcing at the time of the final testnet release, along with tooling and documentation to support responsible integration and usage.

:::
