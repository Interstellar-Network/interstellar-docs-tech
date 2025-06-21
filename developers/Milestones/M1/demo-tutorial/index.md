---
sidebar_label: 'Overview'
sidebar_position: 0
---

# Demo Tutorial Overview
<!--
This section guides you through testing Milestone 1 of Interstellar’s secure Web3 account features. You can interact with the system using three different paths depending on your technical environment and available hardware.
:::tip Suggested Reviewer Flow

Even for technically experienced reviewers, we recommend starting with the **Android app + hosted testnet** path to evaluate the user-facing features quickly.

You can then run the **CLI + local Docker** setup to inspect runtime behavior, validate trusted extrinsics, and view node logs — without the additional complexity of setting up the full Android + local node stack via ADB.

:::

---

## 🚀 Recommended: Android App with Hosted Testnet

This is the fastest way to evaluate the features delivered in Milestone 1. The Android demo app is preconfigured to connect to a remote testnet (hosted on a VPS), avoiding the need to run the blockchain stack locally.

- Requires an Android phone or emulator
- No Docker or local setup needed
- Enables full flows: onboarding, authentication, transaction validation, and recovery

:::note
The Android app connects directly to the hosted testnet. No manual configuration is required.
:::

---

## 🧪 Alternative/Complementary: CLI Demo with Local Docker
_(Use without a mobile device or as a runtime validation companion.)_

This method runs the entire stack locally using Docker or Podman, and allows you to test the core runtime flows via CLI scripts — including circuit initialization, input validation, and recovery logic.

- No mobile device required
- CLI-based validation through trusted extrinsics
- Useful for verifying backend runtime behavior independently

---


Each path is documented in the subsections that follow. We recommend starting with the hosted testnet unless you require deep integration testing or offline validation.


-->

## 🧱 Full Stack: Android App with Local Node

This approach replicates the full mobile + node integration, running the blockchain stack locally and using the Android app to interact with it.

- Requires Android phone or emulator
- Requires local Docker or Podman setup
- Best suited for developers or reviewers who want to test the full integration stack on their own machine



