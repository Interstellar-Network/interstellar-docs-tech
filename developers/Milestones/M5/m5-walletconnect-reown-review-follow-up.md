---
sidebar_label: 'WalletConnect Review Follow-up'
sidebar_position: 8
---

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

# M5 WalletConnect / Reown Review Follow-up

This document provides the structured follow-up to the external review of the M5 WalletConnect / Reown integration.

The goal is to clarify the intended scope of the M5 deliverable, distinguish core issues from reference-bridge hardening, and define the remediation or documentation path for each finding.

## Introduction

Thank you for the detailed review. We appreciate the depth of the analysis and the fact that the review distinguishes between the documented happy-path flows that work and the adversarial or edge-case paths that require hardening.

We agree with the general direction of the feedback. Some findings identify real issues that should be fixed directly, especially where they affect signing semantics, transaction inspection, method advertising, bounded inputs, or consistency of stored results.

Other findings are more related to the current `InterstellarReownBridge` implementation as a demo/reference bridge. These should be addressed either by narrowing the advertised surface, adding explicit rejection paths, or clarifying the intended scope.

## A — Scope clarification: M5 interoperability proof, not production SDK surface

The first point we would like to clarify is the intended scope of this milestone.

`InterstellarReownBridge` should be understood as a **reference integration / sample bridge** for demonstrating interoperability with WalletConnect/Reown-compatible dApps. It is not intended to define the final production Interstellar SDK API surface.

The purpose of M5 was to demonstrate that an external dApp using a WalletConnect-like protocol can connect to the Interstellar wallet and route requests through Interstellar’s account, signing, transaction preparation, VCA threshold, and transaction-feedback infrastructure.

In a production integration, we expect that many applications integrating Interstellar will either:

- already have their own WalletConnect/Reown integration; or
- integrate WalletConnect/Reown directly within their own app, while using the Interstellar SDK for the secure authorization, signing, account, and transaction-routing primitives.

Therefore, the long-term Interstellar SDK should not become a full wrapper around Reown, nor should it re-export every Reown event, relay setting, telemetry option, UI callback, session lifecycle behavior, or chain-specific WalletConnect method.

The SDK should expose Interstellar’s secure authorization primitives, while app developers remain responsible for their own dApp-connection layer and UX policy.

That said, we agree that even a reference bridge must not advertise unsafe or unsupported capabilities. The right remediation is therefore to:

- fix the core signing / transaction / pallet issues;
- narrow the advertised WalletConnect method surface to what is implemented, tested, and documented;
- return explicit WalletConnect errors for unsupported methods;
- clarify in the documentation that `InterstellarReownBridge` is a sample bridge, not a production WalletConnect SDK.

## B — What M5 successfully demonstrates

We also want to highlight what the review confirms is already working and correctly structured.

The documented happy-path flows are operational:

- WalletConnect/Reown session establishment works.
- Solana Devnet `solana_signAndSendTransaction` works in the documented flow.
- Ethereum Sepolia transaction signing works.
- VCA is triggered above the configured ETH threshold.
- CAIP-2 multichain account scaffolding is in place.
- Transaction hash storage and feedback are implemented.
- The bridge successfully routes external dApp requests into Interstellar’s account/signing/transaction infrastructure.

This is the core interoperability objective of M5.

The remaining findings are mostly about hardening the reference bridge against unsupported, adversarial, or non-documented paths. We agree these should be addressed, but they should be interpreted in the correct scope: **M5 demonstrates interoperability and end-to-end routing, while the reference bridge still needs method-surface narrowing and security hardening before it could be considered production-grade.**

## C — Remediation policy

We propose to classify the findings into four categories.

### 1. Core safety / signing / transaction issues — will fix

These findings affect the underlying signing or transaction semantics and should be fixed directly, regardless of the sample-bridge status.

This includes:

- Solana message-signing domain separation / safe `solana_signMessage` handling.
- Polkadot sign-message domain separation before any future DOT WalletConnect exposure.
- Solana multi-instruction transaction inspection.
- ETH `personal_sign` recovery byte compatibility.
- Bounded message input for `request_sign_message`.
- Correct handling of transaction-hash storage failures.
- Consistent chain/network configuration.

### 2. Advertised WalletConnect method surface — will narrow

For M5, the bridge should only advertise methods that are:

- implemented;
- tested;
- documented;
- aligned with the actual chain support status.

Unsupported methods should either be removed from the namespace or return a clear WalletConnect error such as `method not supported`.

This applies especially to:

- `eth_signTypedData`;
- BTC methods beyond connect-only scope;
- chain methods that cannot currently be validated against a real dApp or the Reown Lab environment;
- sign-message methods where safe domain separation is not yet implemented.

### 3. Reference bridge / demo wallet UX — will harden where simple, document otherwise

Some points are valid from a production-wallet perspective but belong primarily to the sample bridge or demo wallet UX rather than the future Interstellar SDK.

This includes:

- QR pairing confirmation;
- session approval prompt;
- use of Reown `verifyContext`;
- clearer user feedback when Reown response delivery fails;
- lifecycle handling of Reown delegates;
- pending request tracking;
- relay and telemetry configuration.

We agree that the sample bridge should not silently accept or swallow these cases. However, the long-term SDK should not try to own the full Reown UX lifecycle. Production apps integrating Interstellar should retain control over their own WalletConnect/Reown UX, relay configuration, telemetry policy, and dApp-session management.

### 4. Documentation / milestone clarification — will update

We will update the M5 documentation to make the following explicit:

- `InterstellarReownBridge` is a reference integration, not the production SDK.
- BTC is connect-only in the current tested scope unless otherwise documented.
- Unsupported methods are intentionally not part of the M5 validated scope.
- The production Interstellar SDK will expose secure authorization/signing primitives rather than acting as a full WalletConnect SDK wrapper.
- The review findings have been triaged into fixed, narrowed, documented, and future-SDK categories.

## D — Point-by-point response

<Table>
  <TableHeader>
    <TableRow>
      <TableCell><strong>Finding</strong></TableCell>
      <TableCell><strong>Response</strong></TableCell>
      <TableCell><strong>Planned action</strong></TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell><strong>C1 — Solana <code>signMessage</code> signs with transaction signing scheme</strong></TableCell>
      <TableCell>We agree that this is a valid issue. The wallet must not allow cross-purpose signing where transaction bytes can be signed as an off-chain message.</TableCell>
      <TableCell>Will add the payload wrapping following the reference <code>solana-sdk/offchain-message/src/lib.rs</code>. Note that Reown docs do not specify how the payload should be wrapped, so we cannot guarantee that every dApp will work.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>C2 — Polkadot sign-message signs with extrinsic scheme</strong></TableCell>
      <TableCell>We agree this should be treated as a latent issue. DOT is not currently advertised in the WalletConnect bridge, but the pallet-level signing surface should still be safe before any future DOT exposure.</TableCell>
      <TableCell>Will add proper domain separation / message wrapping for DOT sign-message. Note that Reown does not list DOT support, so the safest course of action is to support this only on the pallets side and block it in <code>wallet-app</code>.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>C3 — Sign-message and session-approval paths have no user confirmation</strong></TableCell>
      <TableCell>We agree that the reference bridge should not silently approve sessions or sign messages. The current behavior was optimized for M5 testing with Reown Lab, where persistent sessions were limited and repeated prompts would have made validation cumbersome. That is acceptable for a demo bridge, but not as production behavior.</TableCell>
      <TableCell>Add explicit session confirmation in the sample bridge. Add clear rejection paths. For sign-message, either require confirmation or disable unsupported sign-message methods until safe display and domain-separated signing are implemented. Clarify that production apps should own their WalletConnect session UX.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>C4 — Solana multi-instruction transactions bypass threshold inspection</strong></TableCell>
      <TableCell>We agree. The current parser should not inspect only one instruction while signing and broadcasting the original transaction bytes. This is a real transaction-inspection issue.</TableCell>
      <TableCell>Fix by iterating over instructions and either whitelisting supported instructions or rejecting unsupported / unparsed instructions. For safety, the sample bridge should not sign arbitrary Solana programs it cannot inspect.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H1 — ETH <code>personal_sign</code> returns <code>v</code> as 0/1 instead of 27/28</strong></TableCell>
      <TableCell>We agree this should be checked and fixed for interoperability with standard Ethereum verifiers. The documented ETH transaction path is separate and works, but <code>personal_sign</code> should still produce standard-compatible signatures if advertised.</TableCell>
      <TableCell>Adjust the recovery byte for Ethereum message signatures and add an interoperability test using a standard Ethereum verifier.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H2 — QR scanner auto-pairs without user confirmation</strong></TableCell>
      <TableCell>We agree this is not production-wallet behavior. It belongs to the demo wallet / reference bridge UX, not the future Interstellar SDK.</TableCell>
      <TableCell>Add a confirmation step before pairing with a scanned <code>wc:</code> URI. The UI should display available dApp metadata where possible.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H3 — Reown UI delegate set lazily / pending requests may be dropped or overwritten</strong></TableCell>
      <TableCell>We do not agree with this finding as stated. The app works without the user ever visiting <code>SendScreen</code>; WalletConnect flows have been tested from other app paths, and the delegate setup is not exclusively dependent on <code>SendScreen</code>. We can improve defensive handling for edge cases such as multiple pending requests, but this is not a demonstrated failure of the documented M5 flow.</TableCell>
      <TableCell>Re-check the relevant initialization paths for completeness. Potentially improve pending-request tracking as a robustness improvement, but not as a blocking M5 fix.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H4 — <code>request_sign_message</code> accepts unbounded <code>Vec&lt;u8&gt;</code> with hard-coded weight</strong></TableCell>
      <TableCell>We agree. Even though storage uses bounded types later, the extrinsic input itself should be bounded and weighted properly.</TableCell>
      <TableCell>Replace unbounded <code>Vec&lt;u8&gt;</code> with <code>BoundedVec</code>. Add a maximum message size. Dynamic / benchmarked weight remains part of the broader weight-cleanup work, but the immediate DoS surface should be reduced.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H5 — <code>personal_sign</code> decodes hex blindly and may sign empty message</strong></TableCell>
      <TableCell>We agree. Silent fallback to an empty message is not acceptable, even in a sample bridge.</TableCell>
      <TableCell>Reject malformed input explicitly and return a WalletConnect error. Do not substitute empty bytes. Clarify which parameter order and encoding formats are supported.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H6 — Hard-coded testnet CAIP-2 ids guarded by <code>kotlin.assert</code></strong></TableCell>
      <TableCell>We agree this should be cleaned up. The asserts were used for logging/testing and should not be relied on for runtime safety.</TableCell>
      <TableCell>Remove hard-coded testnet checks or replace them with explicit runtime validation where needed. The bridge should rely on chain/account data returned by the Interstellar infrastructure and fail clearly on mismatch.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H7 — BTC <code>sign_message</code> header does not match P2WPKH address type</strong></TableCell>
      <TableCell>We agree this should be fixed if BTC message signing remains advertised. The current M5 documentation intended BTC as connect-only because of the Reown testnet mismatch, but the advertised namespace was broader than the validated scope.</TableCell>
      <TableCell>Either remove BTC <code>signMessage</code> from the advertised namespace for M5 or fix the BTC message-signing format and validate it with a standard verifier before advertising it.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H8 — <code>eth_signTypedData</code> advertised but unhandled</strong></TableCell>
      <TableCell>We agree. The bridge should not advertise a method it does not handle.</TableCell>
      <TableCell>Remove <code>eth_signTypedData</code> from the advertised namespace for M5. Add a default unsupported-method error path so dApps do not hang. Proper EIP-712 support should be treated as a separate future feature.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H9 — <code>respondToRequest</code> swallows Reown failures</strong></TableCell>
      <TableCell>We agree this should be improved in the sample bridge. It is part of Reown lifecycle/error handling rather than Interstellar core signing logic, but silent failure is not ideal.</TableCell>
      <TableCell>Differentiate success and failure callbacks. Log accurately. Surface meaningful errors to the user where appropriate. Deduplicate inbound requests before responding.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>H10 — BTC bridge namespace claims live methods despite docs saying connect-only</strong></TableCell>
      <TableCell>We agree this is a documentation / advertised-surface mismatch.</TableCell>
      <TableCell>Narrow the BTC namespace to connect-only for M5, or update documentation if/when BTC live execution is fully implemented and tested. For M5, narrowing is the safer option.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M1 — Reown telemetry hard-coded on; no relay override</strong></TableCell>
      <TableCell>This is configured in the demo <code>wallet-app</code>, not in <code>InterstellarReownBridge</code>. The bridge is not intended to expose a complete Reown configuration layer. A production app integrating Interstellar would own its own WalletConnect/Reown configuration, including telemetry and relay policy.</TableCell>
      <TableCell>Document this as demo-wallet configuration, not SDK/bridge behavior. No M5 bridge change required.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M2 — <code>do_store_tx_hash</code> failures silently swallowed</strong></TableCell>
      <TableCell>We agree. A broadcasted transaction with stale or missing tx-hash feedback can confuse the dApp and user.</TableCell>
      <TableCell>Propagate the storage error or clear the previous value before storing the new hash.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M3 — Public storage of signatures and tx hashes may correlate accounts to chain activity</strong></TableCell>
      <TableCell>We are not fully sure we understand this point. In the current M5 architecture, this flow is handled in the L2 / worker-mediated context, not as public L1 storage intended to expose signature artifacts or tx hashes globally. Could you clarify whether your concern is about actual public visibility in the current implementation, about metadata correlation through the worker-mediated getter flow, or about a future production privacy model?</TableCell>
      <TableCell>Pending clarification. If there is an actual public-storage exposure in the current M5 implementation, we will review and fix it. If the concern is about future production privacy, we will document that the M5 storage/getter pattern is a testnet/reference mechanism and not the final privacy architecture.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M4 — <code>SignedMessages</code> and <code>LatestBroadcastedTxHash</code> grow without pruning</strong></TableCell>
      <TableCell>We partially agree with the general storage-hygiene concern, but not with the implication that these storages grow unbounded per operation. Both are latest-value maps, not append-only collections. For a given key, a new value replaces the previous one. The storage can grow with the number of participating accounts/devices, but not with every signed message or broadcasted transaction. There is also no background worker in this stack to perform automatic pruning, and mutating storage from a getter would be a poor design.</TableCell>
      <TableCell>Keep the current M5 behavior unless a concrete boundedness issue is identified. Clarify in the documentation that these are latest-value retrieval slots for the reference flow. Future cleanup, if required, should be explicit and designed at the call level, not implemented as implicit getter-side mutation.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M5 — Cross-device race / inconsistent keying</strong></TableCell>
      <TableCell>We agree consistency should be improved. Current multi-device-per-root-account behavior is not a fully supported scenario in M5, but the storage model should still avoid avoidable ambiguity.</TableCell>
      <TableCell>Align keying semantics where practical and document current limitations. Longer term, signed results and transaction feedback should be treated as short-lived, request-scoped artifacts rather than persistent account-level state.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M6 — <code>EthNetworkConfig.network_prefix</code> independent of <code>chain_id</code></strong></TableCell>
      <TableCell>We agree. This was done for implementation symmetry across networks, but it creates avoidable configuration risk.</TableCell>
      <TableCell>Derive or validate the network prefix consistently from the chain configuration. Fail clearly on mismatch.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M7 — Reown <code>verifyContext</code> received but not inspected</strong></TableCell>
      <TableCell>We agree that the sample bridge should use the available verification signal. This remains client-side and not a substitute for Interstellar’s own authorization model, but it is still useful anti-phishing context.</TableCell>
      <TableCell>Surface <code>verifyContext</code> in the session/request confirmation UI. Reject or strongly warn on invalid contexts, and display unknown contexts appropriately.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M8 — <code>WALLET_CONNECT_PROJECT_ID</code> fallback to empty string</strong></TableCell>
      <TableCell>This is intentional for CI. The CI build is used only as a build check, not as the functional M5 APK distributed for testing. We do not want to inject real Reown project IDs or API keys into CI, because that would create credential-stealing / supply-chain exposure for no practical benefit. A WalletConnect-enabled build should be produced from a controlled local or release environment where the project ID is provided explicitly.</TableCell>
      <TableCell>Keep CI free of real Reown credentials. Optionally add documentation or a build warning clarifying that CI artifacts are not intended to be functional WalletConnect release builds.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M9 — <code>respondToRequest</code> builds JSON via string interpolation</strong></TableCell>
      <TableCell>We agree this should be cleaned up. Even if the current values are expected to be base58/hex, typed JSON construction is safer and clearer.</TableCell>
      <TableCell>Replace string interpolation with proper JSON serialization.</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>M10 — BTC <code>sign_message</code> rejects non-UTF-8 silently</strong></TableCell>
      <TableCell>We agree this should either be handled explicitly or removed from the advertised surface. BTC advanced signing flows such as PSBT are out of scope for M5 and would require specific pallet-side work.</TableCell>
      <TableCell>For M5, remove or explicitly reject unsupported BTC message formats. Treat broader BTC signing support as a future feature, only if there is a clear need and proper validation path.</TableCell>
    </TableRow>
  </TableBody>
</Table>

## Proposed conclusion

Overall, we agree with the review’s direction and will address the issues in a way that is consistent with the actual M5 scope.

The main adjustment is that M5 should not be interpreted as delivering a production WalletConnect SDK or a full Reown wrapper. It delivers an interoperability proof and reference bridge showing that WalletConnect/Reown-compatible dApp requests can be routed into Interstellar’s account, signing, VCA, and transaction-feedback infrastructure.

The fixes will therefore focus on:

- correcting core signing and transaction-inspection issues;
- narrowing the advertised WalletConnect surface to implemented and tested methods;
- adding explicit unsupported-method errors;
- improving the sample bridge UX for pairing, session approval, and Reown verification context;
- documenting clearly that the bridge is a reference implementation, while the future Interstellar SDK will expose secure authorization primitives rather than owning the full WalletConnect/Reown lifecycle.

This should make the M5 deliverable clearer, safer, and better aligned with the long-term Interstellar architecture.
