---
sidebar_label: 'WalletConnect Integration'
sidebar_position: 2
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";


REF: [Wallet Connect Docs](https://docs.walletconnect.network/wallet-sdk/overview)


# WalletConnect / Reown Integration

## Overview

Milestone 5 delivers the WalletConnect integration within the Interstellar Android wallet app, tied to Interstellar infrastructure.

This deliverable is not limited to a single wallet-side feature. It required coordinated work across two layers:

1. **Wallet application integration**, through the Reown SDK inside the Interstellar Android wallet.
2. **Infrastructure-side integration**, through pallet-level adaptations required to support WalletConnect / Reown flows end-to-end.

The purpose of this milestone is therefore not only to add wallet-to-Dapp connectivity. It is to demonstrate that Interstellar’s smart account and signing infrastructure can interoperate with Dapps using the WalletConnect protocol, while preserving Interstellar’s own transaction preparation, signing, policy enforcement, and conditional approval model.

In practical terms, external Dapps relying on WalletConnect can establish a session with the Interstellar wallet, send standard connection and transaction requests, and have those requests routed through Interstellar’s account, signing, and transaction validation pipeline.

This makes Milestone 5 an important interoperability proof point: it shows that Interstellar’s wallet and smart account architecture can connect to an established open protocol used across the Web3 ecosystem, while preserving Interstellar’s higher-security approval flow, including PoHI / VCA confirmation when required by policy.

## Milestone mapping and implementation references

The WalletConnect / Reown integration is split across the M5.2 and M5.3 delivery scope.

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Milestone item</TableCell>
      <TableCell>Scope</TableCell>
      <TableCell>Implementation reference</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>M5.2</TableCell>
      <TableCell>Wallet-side Reown SDK integration in the Interstellar Android wallet app</TableCell>
      <TableCell>https://github.com/Interstellar-Network/wallet-app-internal/pull/32</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>M5.3</TableCell>
      <TableCell>Main pallet-side adaptations required to support the “Sign in with Reown” flow and compatibility with Reown AppKit / Lab test environments</TableCell>
      <TableCell>https://github.com/Interstellar-Network/pallets-internal/pull/73</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>M5.3</TableCell>
      <TableCell>Additional infrastructure-side support to return the broadcasted transaction hash back to Reown after transaction submission</TableCell>
      <TableCell>https://github.com/Interstellar-Network/pallets-internal/pull/72</TableCell>
    </TableRow>
  </TableBody>
</Table>

Together, these PRs demonstrate that the M5 WalletConnect delivery covers the full path across both the Android wallet and Interstellar infrastructure: session handling, signing flow support, transaction preparation, transaction broadcasting, and transaction-hash feedback to the requesting Dapp environment.

## What is delivered

The delivered integration includes:

- support for **WalletConnect session establishment** from compatible Dapps,
- **URI-based pairing** through the Interstellar Android wallet,
- wallet-side integration of the **Reown SDK**,
- support for **multi-chain account context handling** after connection,
- handling of **Dapp-initiated signing and transaction requests**,
- routing of those requests into Interstellar’s internal signing and transaction preparation pipeline,
- infrastructure-side support for Reown-compatible flows,
- transaction broadcasting through Interstellar infrastructure,
- return of the **broadcasted transaction hash** to the Reown / WalletConnect flow,
- compatibility with Interstellar’s **conditional approval model**, including triggering **PoHI / VCA confirmation** when the configured transaction validation threshold is exceeded.

This means that WalletConnect requests are not treated as a separate or isolated wallet feature. They are integrated into the same secure transaction management logic as other Interstellar wallet requests, allowing interoperability with external Dapps while keeping Interstellar’s policy enforcement and approval controls.

## Why this integration matters

Wallet interoperability is a key requirement for real-world adoption.

By integrating WalletConnect / Reown, Milestone 5 demonstrates that Interstellar’s smart account infrastructure is not limited to a proprietary application flow. It can connect to third-party Dapps through a recognized ecosystem protocol while preserving Interstellar’s specific trust and validation model.

This proves three important points:

1. **Protocol interoperability**  
   Interstellar can connect to Dapps using WalletConnect instead of requiring a custom Dapp-side integration.

2. **Compatibility with Interstellar smart account infrastructure**  
   WalletConnect-originated requests can be processed through Interstellar’s account, signing, and transaction preparation flow.

3. **Preservation of higher-security approval logic**  
   Standard Dapp requests can still trigger Interstellar’s additional approval layer, including PoHI / VCA confirmation, when the transaction policy requires it.

In that sense, this integration is more than wallet connectivity. It demonstrates that Interstellar’s smart account model can remain compatible with external ecosystem standards while extending them with stronger transaction validation and human confirmation controls.

## Validation scope in this milestone

The validation scope is based on the public Reown / WalletConnect test environment and focuses on the flows that can be exercised reliably in the current setup.

The main public test environment used for this milestone is:

https://lab.reown.com/appkit/?name=ethers-all

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Network / Flow</TableCell>
      <TableCell>Connection to Dapp</TableCell>
      <TableCell>Signing</TableCell>
      <TableCell>Approval through PoHI / VCA</TableCell>
      <TableCell>Notes</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Solana Devnet</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>No</TableCell>
      <TableCell>This flow provides only transaction signing with hardcoded values below threshold - it does not require message signing before transaction execution.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Ethereum Sepolia</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>The flow allows transaction signing and approval once message signing has enabled connection establishment with the EVM modal.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Bitcoin</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>No</TableCell>
      <TableCell>No</TableCell>
      <TableCell>Connection can be tested, but transaction execution is not covered here because the public Reown test Dapp uses Bitcoin Testnet3 while the wallet is configured for Bitcoin Testnet4.</TableCell>
    </TableRow>
  </TableBody>
</Table>

:::info Limitation
The public Reown Lab environment currently does not expose a Polkadot Dapp flow suitable for testing both WalletConnect connectivity and transaction execution.

For this reason, Polkadot is not included in the practical validation scope of this milestone tutorial.
:::

## Reference validation flow

For this milestone, the main end-to-end validation scenario is the **Solana Devnet flow**.

This flow demonstrates that:

- a Dapp can connect to the Interstellar wallet through WalletConnect,
- the wallet can resolve the connected account and refresh balances,
- the Dapp can initiate a transaction request,
- the request is processed by Interstellar’s internal transaction manager,
- the transaction can trigger the **Action Confirmation Screen** when it exceeds the configured validation threshold,
- the user can complete the confirmation flow,
- the transaction can be simulated and broadcast successfully,
- the broadcasted transaction hash can be returned to the Reown / WalletConnect flow.

This Solana Devnet scenario is the clearest demonstration that WalletConnect interoperability works together with Interstellar’s smart account and conditional validation infrastructure.

## Functional result demonstrated by the milestone

Through this integration, Milestone 5 demonstrates that the Interstellar wallet can act as a WalletConnect-compatible endpoint for external Dapps while preserving its internal security pipeline.

Concretely, a Dapp request received through WalletConnect can be:

- accepted by the wallet,
- mapped to the appropriate account and chain context,
- prepared for signing,
- checked against transaction policy conditions,
- optionally escalated to PoHI / VCA confirmation,
- finalized after user approval,
- broadcast through Interstellar infrastructure,
- and returned to the Dapp environment with the broadcasted transaction hash when supported by the flow.

This confirms that Interstellar’s wallet and infrastructure can interoperate with the WalletConnect ecosystem without weakening the transaction approval model already implemented in the application.

## Current limitations of the milestone scope

This milestone validates the integration against currently accessible public test flows and their constraints.

As a result:

- **Solana Devnet** demomstrate connection without message signing but not transaction with approval.
- **Ethereum Sepolia** demonstrates connection and signing interoperability, with the approval scenario depending on message signing for EVM modal connection establishment.
- **Bitcoin** currently demonstrates connection only in this public test setup because of the network mismatch between the Reown test Dapp and the wallet configuration.
- **Polkadot** is not included in the practical validation scope because the public Reown Lab environment does not currently provide a Polkadot Dapp flow suitable for testing both connectivity and transaction execution.

These limitations come from the currently available public test environment. They do not change the core result of the milestone: successful integration of WalletConnect / Reown across the Interstellar Android wallet and Interstellar infrastructure, with transaction requests routed through the existing signing and approval model.

## Conclusion

Milestone 5 demonstrates that Interstellar’s smart account infrastructure can interoperate with Dapps through the WalletConnect protocol and Reown tooling.

It proves that WalletConnect-based Dapp requests can be handled by the Interstellar Android wallet, routed through Interstellar’s signing and transaction preparation pipeline, processed by the relevant infrastructure-side logic, and finalized with transaction broadcasting and transaction-hash feedback.

Most importantly, this interoperability does not bypass Interstellar’s higher-security transaction controls. Dapp-originated requests can still be subject to Interstellar’s conditional approval model, including PoHI / VCA confirmation when required.

This makes the WalletConnect / Reown integration a meaningful M5 delivery item: it validates both ecosystem interoperability and compatibility with Interstellar’s secure transaction model across the wallet application and the underlying Interstellar infrastructure.
