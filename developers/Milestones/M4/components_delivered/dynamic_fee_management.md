---
sidebar_label: 'Dynamic Fee Management Update'
sidebar_position: 7
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# Dynamic Fee Management (BTC, ETH, DOT, SOL)

## Overview
The wallet automatically computes and applies transaction fees across supported networks.  
Users are no longer required to manually select gas price, priority fee, or transaction speed.

The objective is to guarantee reliable transaction inclusion while preventing unnecessary overpayment and avoiding stuck transactions.

---

## Supported Networks
The dynamic estimator is implemented natively in each client:

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Network</TableCell>
      <TableCell>Fee Model</TableCell>
      <TableCell>Strategy</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Bitcoin</TableCell>
      <TableCell>UTXO fee rate (sat/vB)</TableCell>
      <TableCell>Mempool pressure analysis</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Ethereum</TableCell>
      <TableCell>EIP-1559 (base + priority)</TableCell>
      <TableCell>Adaptive priority estimation</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Polkadot</TableCell>
      <TableCell>Weight-based fee</TableCell>
      <TableCell>Runtime fee query</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Solana</TableCell>
      <TableCell>Compute unit pricing</TableCell>
      <TableCell>Recent block congestion sampling</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

## Behavior
For each transaction:

1. The client queries recent network conditions
2. A target inclusion probability is computed
3. The optimal fee is selected automatically
4. The transaction is submitted with secure validation

The user only confirms the action — never the fee parameters.

---

## Benefits
- No manual gas configuration
- Prevents underpriced transactions
- Avoids excessive fees during spikes
- Consistent UX across chains
- Production-ready default behavior

---

## Security Considerations
Fee selection occurs before authorization and is included in the validated transaction payload.  
This prevents malicious modification of the fee after user approval and guarantees that the signed transaction matches the displayed intent.

---

## Testnet Notes
The estimator operates on testnet environments during development:

- uses real network congestion data
- validates fee adaptation logic
- ensures identical behavior before mainnet activation

Switching to mainnet requires no change in logic — only network endpoint configuration.
