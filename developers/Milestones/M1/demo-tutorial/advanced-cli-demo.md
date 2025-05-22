---
sidebar_label: 'Advanced CLI Demo'
sidebar_position: 3
---

# Advanced CLI Demo (if requested)

This guide describes how to interact with the Interstellar runtime at a low level using CLI tools, enabling direct testing of **garbled circuit evaluation**, **AUTH extrinsics**, and **TEE enclave responses**. It is designed for advanced users and technical reviewers familiar with Substrate and trusted execution environments.

---

## 1. Prerequisites

- A working local stack (from [Local Demo with Docker](./local-demo-with-docker.md))
- Rust toolchain with nightly target
- Access to `integritee-cli` (custom or upstream)
- Node.js (for optional frontend verification)

---

## 2. Overview of the Flow

This test walks through:
- Preparing a circuit definition (garbled circuit logic)
- Uploading it to the enclave or IPFS
- Triggering a `AUTH` extrinsic linked to the circuit
- Reviewing enclave output, logs, or state changes

---

## 3. Garbled Circuit Setup

Create a simple validation circuit or use a pre-generated one:

```bash
wget https://raw.githubusercontent.com/Interstellar-Network/circuits/main/demo-one-time-code.json -O circuit.json
```

Upload it via IPFS or provide to the node via RPC.

---

## 4. Interact with Enclave via CLI

### Submit a Trusted Getter

```bash
./integritee-cli -p 9990 trusted --mrenclave <ENCLAVE_MRENCLAVE>   -u ws://127.0.0.1:9990   -P <SIGNER_PHRASE>   --call enclave_validate_code '42'
```

> Replace `42` with the user-entered code from the mobile app

### Submit AUTH Extrinsic with CLI

This assumes you’ve registered a mobile proxy account already:

```bash
./integritee-cli -p 9990 trusted --mrenclave <ENCLAVE>   --call send_auth_tx   --input 'signed_code_payload'
```

You should see confirmation in the logs or Polkadot.js Explorer.

---

## 5. Debugging and Logs

Monitor logs from:

```bash
docker-compose logs -f node
docker-compose logs -f worker
```

Verify expected outputs:
- Circuit executed
- Signature verified
- AUTH extrinsic emitted and finalized

---

## 6. Optional: Frontend Hook (Node.js Debug UI)

You can use a minimal debug frontend to view circuit stages or results:

```bash
cd debug-ui && npm install && npm start
```

> Displays the reconstructed input, evaluation path, and result from the circuit.

---

This CLI guide allows validation of the full authentication and circuit evaluation flow without relying on the mobile app UI. It is ideal for reviewers verifying the cryptographic flow, enclave behavior, and pallet integration.
