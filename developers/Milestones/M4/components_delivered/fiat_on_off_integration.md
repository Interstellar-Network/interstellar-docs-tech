---
sidebar_label: 'Fiat On/Off Ramp Integration'
sidebar_position: 6
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# Fiat On/Off Ramp Integration

## Overview
The wallet application integrates fiat entry and exit rails directly inside the user interface, allowing users to acquire and dispose of digital assets without leaving the application.  
This feature complements secure transaction validation by enabling real economic interaction while preserving the same authorization guarantees.

The integration is designed to be chain-agnostic and compatible with multiple networks supported by the wallet.

---

## Current Testnet Constraints
At the current stage, the system operates exclusively with **testnet assets**.

As a consequence:

- Assets purchased through the on-ramp are testnet tokens
- No real monetary value is transferred
- Banking settlement is simulated by the provider environment

This allows end-to-end validation of the payment and authorization flows without regulatory or custody implications.

---

## On-Ramp Behavior
Users can acquire supported assets directly in the wallet:

- Select network and asset
- Choose fiat amount
- Receive testnet tokens in the secured account

---

## Off-Ramp Limitation
Because only testnet tokens are used:

- Off-ramp cannot transfer funds to real bank accounts
- Withdrawal flow is functionally implemented but settlement is disabled
- The feature currently validates UX and security logic only

The off-ramp therefore behaves as a **simulation of the production withdrawal flow**.

---


## Roadmap
When mainnet assets are enabled:

- real fiat settlement will be activated
- withdrawal to bank rails becomes available
- regulatory provider configuration will replace test environment endpoints
- Potential integration of TAVP to ensure fiat interaction inherit the protocol's human-intent verification.
    - explicit user action required
    - secure validation before execution
    - protection against automated cash-out attempt

No architectural change is required — only provider environment switching and compliance configuration.
