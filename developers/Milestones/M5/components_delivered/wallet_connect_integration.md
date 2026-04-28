---
sidebar_label: 'WalletConnect Integration'
sidebar_position: 2
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";


REF: [Wallet Connect Docs ](https://docs.walletconnect.network/wallet-sdk/overview))


# WalletConnect Integration

## Overview

This component delivers the integration of the **open-source WalletConnect protocol** into the Interstellar wallet application.

The purpose of this milestone is not only to add wallet-to-Dapp connectivity, but to demonstrate the **interoperability of Interstellar’s smart account infrastructure with Dapps using the WalletConnect protocol and its core features**.

In practical terms, this means that external Dapps relying on WalletConnect can establish a session with the Interstellar wallet, send standard connection and transaction requests, and have these requests handled through Interstellar’s account, signing, and transaction preparation pipeline.

This milestone is therefore an important interoperability proof point: it shows that Interstellar’s wallet and smart account architecture can integrate with an established open protocol already used across the Web3 ecosystem, while preserving Interstellar’s own security model and conditional transaction validation flow.

## What is delivered

The delivered component includes:

- support for **WalletConnect session establishment** from compatible Dapps,
- **URI-based pairing** through the wallet application,
- support for **multi-chain account context handling** after connection,
- handling of **Dapp-initiated signing and transaction requests**,
- integration of these requests into Interstellar’s internal signing pipeline,
- compatibility with Interstellar’s **conditional approval model**, including the triggering of **PoHI / VCA confirmation** when the configured transaction validation threshold is exceeded.

This means that WalletConnect requests are not treated as a separate or isolated feature. They are routed through the same secure transaction management logic as other wallet-originated requests, allowing interoperability with external Dapps while keeping Interstellar’s policy enforcement and approval controls.

## Why this component matters

Wallet interoperability is a key requirement for real-world adoption.

By integrating WalletConnect, this milestone demonstrates that Interstellar’s smart account infrastructure is not limited to a proprietary application flow. Instead, it can connect to third-party Dapps through a recognized open standard while preserving the Interstellar-specific trust and validation model.

This is particularly important because it proves three things at once:

1. **Protocol interoperability**  
   Interstellar can connect to Dapps using a widely adopted open protocol rather than requiring custom Dapp-side integration.

2. **Compatibility with smart account infrastructure**  
   WalletConnect-originated requests can be processed through Interstellar’s signing and transaction preparation flow.

3. **Preservation of higher-security approval logic**  
   Standard Dapp requests can still trigger Interstellar’s additional approval layer, including PoHI / VCA, when the transaction policy requires it.

In that sense, this component is not only a connectivity feature. It is a demonstration that Interstellar’s smart account model can remain compatible with external ecosystem standards while extending them with stronger transaction validation and human confirmation controls.

## Validation scope in this milestone

The current validation scope of this component is based on the public Reown / WalletConnect test Dapp and focuses on the flows that can be exercised reliably in the current environment.

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
      <TableCell>Yes</TableCell>
      <TableCell> This flow does not require message signing</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Ethereum Sepolia</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>The flow allows transaction signing with approval only when message signing enables establishement of the connection with EVM modal</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Bitcoin</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>No</TableCell>
      <TableCell>No</TableCell>
      <TableCell>Connection can be tested, but transaction flow is not covered here because the public Reown test Dapp uses Bitcoin Testnet3 while the wallet uses Bitcoin Testnet4</TableCell>
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

- a Dapp can connect to the wallet through WalletConnect,
- the wallet can resolve the connected account and refresh balances,
- the Dapp can initiate a transaction request,
- the request is processed by Interstellar’s internal transaction manager,
- the transaction can trigger the **Action Confirmation Screen** when it exceeds the configured validation threshold,
- the user can complete the confirmation flow,
- and the transaction can then be simulated and broadcast successfully.

This Solana Devnet scenario is the clearest demonstration that WalletConnect interoperability works together with Interstellar’s smart account and conditional validation infrastructure.

## Functional result demonstrated by the milestone

Through this component, the milestone demonstrates that Interstellar’s wallet can act as a WalletConnect-compatible endpoint for external Dapps while preserving its internal security pipeline.

Concretely, a Dapp request received through WalletConnect can be:

- accepted by the wallet,
- mapped to the appropriate account and chain context,
- prepared for signing,
- checked against transaction policy conditions,
- optionally escalated to PoHI / VCA confirmation,
- and, once validated, finalized and broadcast.

This confirms that Interstellar’s wallet infrastructure can interoperate with the WalletConnect ecosystem without weakening the transaction approval model already implemented in the application.

## Current limitations of the milestone scope

This milestone validates the integration against currently accessible public test flows and their constraints.

As a result:

- **Solana Devnet** is the primary reference flow for end-to-end validation,
- **Ethereum Sepolia** demonstrates connection and signing interoperability, but the approval scenario required message signing for EVM modal connection establishement,
- **Bitcoin** currently demonstrates connection only in this public test setup due to network mismatch between the Reown test Dapp and the wallet configuration.

These limitations come from the currently available public test environment and do not change the core result of the milestone, which is the successful integration of WalletConnect and the demonstration of interoperability with Dapps using its standard connection and request model.

## Conclusion

This component demonstrates that Interstellar’s smart account infrastructure can interoperate with Dapps through the **open-source WalletConnect protocol** and its core features.

It proves that WalletConnect-based Dapp requests can be handled by the Interstellar wallet and routed through Interstellar’s signing and transaction preparation pipeline, while still remaining compatible with Interstellar’s own higher-security transaction controls such as **conditional PoHI / VCA approval**.

This makes the WalletConnect integration a meaningful milestone component: it validates both **ecosystem interoperability** and **compatibility with Interstellar’s secure transaction model**.

