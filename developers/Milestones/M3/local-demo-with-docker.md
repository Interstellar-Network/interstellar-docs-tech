---
sidebar_label: 'Android App with Local Node'
sidebar_position: 1
---

# Android App with Local Nodes

This guide explains how to run the full Interstellar stack **locally** using Docker or Podman. You will be able to launch the Substrate node, Integritee TEE worker, and IPFS service, then interact with the system using the **Interstellar Android demo app**.

This setup enables full offline testing without relying on a hosted VPS.

:::note Milestone 3 Scope
This milestone delivers the core transaction signing capabilities of the Interstellar platform for multiple blockchains coins: DOT, ETH, BTC, SOL with conditional transaction confirmation through the transaction management layer.

All features have been **extensively tested with a focus on user experience**, demonstrating how simple, reliable, and intuitive these flows can be. The current interface has been **adjusted to support efficient testing**, while leaving room for further UX and UI refinements in the production-grade SDK.

Although the system is **not yet production-ready**, it provides a robust foundation. 
Broader edge case coverage, interoperability, and resilience guarantees will be the focus 
of the upcoming SDK and future milestones. 
Reviewers are encouraged to **focus on the functional flow and experience** of the key features in this milestone.
:::


:::info Tested Environment
This compatibility note applies to the **backend stack**, tested on Ubuntu 24.04 LTS (x86_64) using Docker (`docker-compose`) or Podman (with manually installed `podman-compose`*).  
The stack is expected to work on other recent Linux distributions, but this has not been officially verified.

Known issue: May fail on Apple Silicon (M1/M2/M3/M4) - due to current SIMD usage and QEMU/Rosetta limitations - crash on M1/M2 (not tested on M3/M4)

The **frontend** (e.g., Android emulator or physical device) 
can run on any OS supported by Android Studio (expect some emulator limitations on Apple Silicon)

*Compose tools are required to manage service startup dependencies (e.g., health checks).
:::



## 1. Prerequisites

| Requirement        | Install Guide |
|--------------------|----------------|
| Docker             | [Install Docker](https://docs.docker.com/engine/install/) |
| Docker Compose     | [Install docker-compose](https://docs.docker.com/compose/install/) |
| `curl`, `wget`, `jq` | Installed via `apt`/`brew` or default in most environments |
| Android Studio     |  [Install Android Studio](https://developer.android.com/studio) |
| ADB (`adb reverse`) | Comes with Android Studio |

> You may also use **Podman** as an alternative to Docker.

## 2. Launch the Interstellar Stack Install 

:::info BTC RPC API Key  
The BTC worker connects to a **Bitcoin Testnet RPC endpoint** using a hosted provider.  
For simplicity, we provide curators with a ready-to-use `.env` file.  

Place the file in the **same directory** as `docker-compose.yml`.  
It contains a single variable:  

```bash
BITCOIN_TESTNET_API_KEY=<API_KEY_WE_SEND>
```
⚠️ If you prefer to use your own provider, simply replace the value of BITCOIN_TESTNET_API_KEY in .env.
:::

```bash
# Step 1: Create a working directory
mkdir interstellar_m2_demo && cd interstellar_m2_demo

# Step 2: Download the stack config
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m2/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/tags/testnet-m2/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh
```

```bash
# Step 3: Place the .env file we send in this directory
```

```bash
# Step 3: Start Docker (if needed)
sudo service docker start  # (for most Linux distros)

# Step 4: Launch the stack
sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate
```

### ⏳ Waiting for Master Circuit Generation

Once the node and service are running, the system will automatically trigger the **generation of master circuits** from the hardware description files.

These circuits are compiled using the Verilog logic generated from the original master circuits specifications, processed through the logic synthesis pipeline. This step may take several minutes depending on the environment.

During this time, monitor the logs and wait for the following sequence of messages:

```bash
[ocw-circuits] callback_new_skcd_signed sent number : <number> 1-Success  - 0-Fail
[ocw-circuits] callback_new_display_circuits_package_signed: (<CID_1>, <message_digits_number>), (<CID_2>, <pinpad_digits_number>) for <account_id>
```
Shortly before these messages, you will also see large blob uploads to IPFS such as:
```bash
Requested started id=<...> method=POST uri=http://ipfs:5001/api/v0/add
```
These blobs correspond to the master visual circuits (SKCD display circuits), which are the result 
of the hardware synthesis pipeline. Their appearance in the logs is a strong indicator 
that the build process has completed.

> ℹ️ You can identify this moment easily by spotting two large IPFS file hashes being 
> logged together — one for the secure keypad circuit and one for the display message circuit 
> i.e one time code These hashes will later be used for visual challenge rendering and validation.

Detailed example from `integritee_node-1` 
```bash
Requested started id=1059 method=POST uri=http://ipfs:5001/api/v0/add
[fetch_from_remote_grpc_web] content_type: application/json
[ocw-circuits] callback_new_skcd_signed sent number : 1
[ocw-circuits] callback_new_display_circuits_package_signed: ("QmUx8mMo8GgGdUhcgFQVg2sexkVfyq1sViruZiBadUfs4d",2),("QmcwXyZNmLXnjeoA25YSzj41G1sr6ZsHgZZBQVWvcfe1qn",10) for d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d (5GrwvaEF...)
```

```
[ocw-circuits] Hello from pallet-ocw-circuits.
🛌 Idle (0 peers), best: #6 (...), finalized #3 (...), ⬇ 0 ⬆ 0
```
You can also verify the runtime is ready using [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)

:::info VCA System Layer

While waiting for the stack to fully initialize, you can explore the architecture and rationale behind 
the **[VCA System Layer](/developers/category/vca-system-layer)**. This layer is responsible for producing the `VCA Token`, 
the core cryptographic artifact used by the Trusted Action Validation Protocol (`TAVP`).

The token is generated through a hardware-secure pipeline starting from VHDL logic descriptions, synthesized into 
Verilog and compiled using the`Yosis` and `abc` logic synthesis toolchain. The resulting master circuits define both the secure display and interaction logic — including the Secure Circuit Descriptor (`scd`) and its runtime variant, `skcd`, used for verifiable evaluation.

Once built, these circuits are uploaded to IPFS and used to enable real-time, **privacy-preserving visual cryptographic** 
**challenges**, ensuring each critical **user interaction** is verifiable and **resistant to malware, phishing, and adversarial AI**.

:::


## 3. Install the Android Demo App

### Download the APK

From the official [Interstellar GitHub Release](https://github.com/Interstellar-Network/containers/releases/tag/testnet-m2) (specific APKs preconfigured to connect to `localhost`):

- `androidApp-arm64-release.apk` — for Android devices and Apple Silicon(M1/M2/M3/M4)
- `androidApp-x86_64-release.apk` — for Android emulators running on x86_64 platforms (e.g., Windows PCs, Intel-based Mac)

:::tip Recommended Test Setup – Hardware & Emulator Guidance

While the app runs on Apple Silicon (M1–M4), emulator performance may vary due to ARM virtualization and GPU constraints. For accurate testing—especially for Rust-based rendering and cryptographic logic—choose the best available setup:

| Recommended Option             | Notes                                                                 |
|-------------------------------|-----------------------------------------------------------------------|
| Mid-to-high-end ARM device     | **Preferred**. e.g., Pixel 5–Pixel 8. Avoid Android 16 (API 36) for now. |
| x86_64 emulator (Intel)        | Reliable with mid-range or better GPU.                                |
| Apple Silicon (M3/M4) emulator | Acceptable if GPU is sufficient. Better than M1/M2 for rendering.     |
| Apple Silicon (M1/M2) emulator | Works, but may show degraded performance or rendering issues.         |

:::


### Option 1: Physical Device

1. Transfer the APK to your phone or download it directly from the device 
2. Allow app installation from external sources
3. Install the APK
5. [Connect](https://developer.android.com/codelabs/basic-android-kotlin-compose-connect-device#2) your devices to Android Studio

:::info if you need more details
[How to install an APK on Android](https://www.lifewire.com/install-apk-on-android-4177185)
:::
:::warning
Ensure that your device is configured for **english** language
:::
### Option 2: Emulator

1. [Create](https://developer.android.com/studio/run/managing-avds#createavd)  a `Pixel 7` or equivalent emulator `API 31+` - `API 35` 
2. Edit the emulator and select an API 31+ below the default API 36 (API 34 more stable)
<img src="/img/API34.png" alt="API 34"  width="250"/>

3. Launch the emulator
4. Drag and drop the APK onto the emulator window to install

:::info Compatibility Issue with API 36
Our app currently crashes on Android API 36. The issue is **not caused by the new 16KB memory 
page model**, as it runs correctly on API 35 with 16KB pages. 
API 36 is a **very recent release** and may introduce subtle runtime or platform-level changes 
that affect low-level Rust code (e.g., garbled circuit evaluator or frame renderer). 
Until further investigation, **we recommend using API 34 (more stable on emulator) or earlier for testing.**
:::

:::note Software Rendering Required on Apple Silicon (M1/M2)

On Apple Silicon (M1–M4), emulators may fail to render or execute low-level native code correctly unless software rendering is enabled.

To enable it:

> **Device Manager → Edit → Advanced Settings → Emulated Performance → Graphics → Software**

<img src="/img/emul_software.png" alt="Software rendering setting in Device Manager" width="400"/>

- **Mandatory for M1/M2**: hardware acceleration is not supported and cause crashes.
- **Not tested on M3/M4**: may support hardware acceleration, but software mode is safer for compatibility.

Enabling this setting ensures more reliable emulator behavior, especially for native Rust or cryptographic rendering, at the cost of some performance.

:::




---

## 2. Link App to your local Interstellar stack:

The Android app is preconfigured to connect to `localhost`
To allow the Android app to connect to your local blockchain and IPFS stack:

### Step 1: `adb reverse` Setup
> **On** the **Desktop** connected to the **Device** or running the **Emulator** 
(Windows, Mac OS, Linux)

If Android Studio is already installed, you can enable adb in your terminal 
by adding it to your PATH with the following command (adjust the path if needed):

**Add `adb` PATH:** 

Linux:
```bash
export PATH=$PATH:$HOME/Android/Sdk/platform-tools
```
Mac OS:
```bash
export PATH="$HOME/Library/Android/sdk/platform-tools:$PATH"
```
Windows powershell:
```powershell
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

```bash
adb reverse tcp:9944 tcp:9944   # Substrate WS
adb reverse tcp:2090 tcp:2090   # Integritee node port
adb reverse tcp:5001 tcp:5001   # IPFS

```
:::warning Troubleshooting
Make sure `adb` is properly configured and the emulator or device is detected
 with `adb devices`

 
 You can also check the reverse setup with `adb reverse --list`
:::

> This works for both emulators and real devices connected via USB

### Step 2 (optional): `ssh` Port Forwarding 
> **On** the **System** or **VM** running the **Blockchain stack** (WSL2, Remote VM)

If the emulator is running (or the device is connected) on a different network interface than the backend 
(e.g., the backend runs in WSL2 and the Android emulator or device is connected 
via USB to Windows), 
you may need to configure port forwarding between the desktop and the blockchain.

**WSL2 -> Windows example:**
```bash
export WSL_HOST_IP=$(ip route | awk '/default/ {print $3}')
```
```bash
ssh -N -R 9944:localhost:9944 -R 5001:localhost:5001 -R 2090:localhost:2090 [windows_user_name]@$WSL_HOST_IP
```

:::warning Troubleshooting: Firewall potential issue

To avoid issues with `ssh` or `adb reverse` during this local test, you can temporarily disable the Firewall:

**Example on Windows with PowerShell (as Administrator):**
```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled False
```
**You can re-enable it later with:**
```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
```
:::

:::info Milestone 2 Scope Clarification  
During **Milestone 2**, our primary objective is to validate the backend capabilities required to generate, sign, and execute transactions across different chains.  

At this stage, the focus is on ensuring correctness and robustness of the transaction pipeline at the infrastructure level. User-facing aspects such as **application UI/UX**, **visual polish**, or **cosmetic design** are not yet part of the milestone scope. Especially because our focus is the delivery of a mobile SDK. 

In addition, while the backend successfully submits transactions, we have not yet integrated **state tracking from the backend** (e.g., monitoring transaction inclusion and confirmation events). This will be addressed in subsequent milestones, once the foundational backend logic is fully validated.  
:::  



## 4. Run the Android App Demo

### Step 1: Connect & Onboard
- **Launch the app**
  - Register a new mobile account
  - Validate biometric & SE-based registration
- Check toasted messages
  - **Registering**
  - **Registered**

### Step 2: Fund your wallet

following is suggested faucets for DOT/PAS, SOL, ETH, BTC:
- [DOT/PAS](https://faucet.polkadot.io/?parachain=1000)
- [SOL](https://faucet.solana.com/) select **testnet** not **devnet** on the dropdown
- [ETH](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [BTC](https://faucet.testnet4.dev/)

Then on your portfolio screen:
- Simply click on the correponding DOT, SOL, ETH, BTC symbol to see your address.
- Click on `Create Pair` if needed and then on the address to copy it, then paste it in the corresponding faucet.

> BTC transaction from the faucet usually can take up to one hour.

:::warning if you experienced issue with some faucet
Feel free to contact us, we will send you SOL or BTC for their respective testnet.
:::

**Once Portfolio funded you are ready to move on the Send Screen:**


> **Wipe down** on the portfolio or balance/address screen triggers a manual refresh of balances. This is a temporary workaround until the app natively tracks chain states more accurately, which will be available with the SDK delivery.


<div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/portfolio_funded_black.png" alt="portfolio funded black" width="200"/>
    <figcaption>Portfolio Screen - Funded - dark mode</figcaption>
  </figure>
  <figure style={{ textAlign: "center" }}>
    <img src="/img/portfolio_funded_white.png" alt="portfolio funded white" width="200"/>
    <figcaption>Send Screen - Funded - light mode</figcaption>
  </figure>
</div>

:::info Atomic Units in Testing  
For testing purposes, the account/address and transaction validation screens display balances and transfer amounts in the **atomic units** of each chain:  

- **DOT / Paseo:** planck  
- **BTC:** satoshi (sat)  
- **ETH:** gwei  
- **SOL:** lamports  

This approach ensures precision and consistency during backend validation, even if these units are less user-friendly than standard denominations.  
:::  


:::note New Feature (M3)  
In Milestone 3, transaction validation become **conditional on an amount threshold**. This threshold is managed by the **Transaction Management Layer (TML)**, allowing policies such as requiring validation only for transfers above a specified value.  
:::  



### Step 2: Test Transactions with conditional validations

:::note Test Setup  
For simplicity during Milestone 3 testing — and to minimize the need for testnet tokens — the **sender and receiver addresses are set to the same account**, except for Solana (which uses a predefined address). This setup accelerates testing for curators by avoiding manual address inputs, while still allowing us to validate transaction generation and submission without requiring external token funding.  
:::


- **Send DOTs, SOLs, ETHs, BTCs to a contact**

<div style={{ textAlign: "center" }}>
  <img src="/img/Send_Currency_Demo.gif" alt="wallet menu" width="200"/>
</div>


:::note Test setup (Milestone 3)

For simplicity during **Milestone 3**, transaction thresholds and prefilled amounts are intentionally calibrated so that **changing a single digit** is enough to switch between the two execution paths:

- **Below threshold** → auto-approved transaction  
- **Above threshold** → VCA-gated transaction

The default amounts are defined in  
<code>androidApp/src/main/java/gg/interstellar/wallet/android/data/WalletData.kt</code>  
and are chosen so that a typical faucet allocation allows **~10–20 transactions per chain** without refilling.

| Chain | Prefilled amount (example) | Threshold | How to trigger VCA |
|------|----------------------------|-----------|--------------------|
| BTC  | 0.00015 BTC                | 0.0002    | Change to 0.00025 |
| ETH  | 0.00025 ETH                | 0.0003    | Change to 0.00035 |
| DOT  | 0.55 DOT                   | 0.6       | Change to 0.65    |
| SOL  | 0.02 SOL                   | 0.025     | Change to 0.03    |

This setup allows reviewers to validate **both flows** quickly, without manual threshold tuning or repeated faucet usage.

:::













  - Trigger the **Trusted Action Validation Protocol (TAVP)** screen
  - Enter the one-time code (2-digit), or experiment with trial/feedback
  - Check toasted messages whith Action Validation Screen:
    - **Initializing a transaction...**
    - [error] No circuits available after 10s; **Something went wrong!** (usually due to insuficient balance)
    - [after taping one-time code digits]
    - **Validating transaction...**
    









📖 **How to Track a Transaction**

Copy the transaction hash (or signature) printed in the backend logs when a transaction is submitted.

- DOT/Paseo → extrinsic hash (hexadecimal, 0x…)
- ETH → starts with 0x…
- SOL → long base58 signature string
- BTC → transaction ID (txid, hexadecimal …)

Paste this value into the corresponding block explorer (alternatively you can also paste your **address**):

- [Polkadot / Paseo (DOT): Subscan](https://assethub-paseo.subscan.io/account)
- [Ethereum (ETH): Etherscan](https://sepolia.etherscan.io/) 
- [Solana (SOL): Solscan](https://solscan.io/?cluster=testnet)
- [Bitcoin (BTC): Mempool.space](https://mempool.space/testnet4)


The explorer will display transaction status, inclusion block, and fee information.

🔎 **Example Log Lines Containing Transaction Hashes**

Here are the log patterns to look for in each chain’s backend output:

### DOT
```bash
[2025-08-27T15:26:52Z DEBUG pallet_dot_client::pallet] [submit_extrinsic] RPC response: Object {"result": "0x1e58d3a0a3fdf08440a683b67248819a6a64c8249b486b3aae9a686e7ec8de3d"}
```
### ETH
```bash
2025-08-27T17:47:51.688957000Z [INFO  pallet_eth_client::pallet] send_transaction: OK: 0x6593fb0b75fb4eae41e6d918f1ab99dd011f4b1e95c6d913b607968d7f6a0471
```
### SOL
```bash
2025-08-27T18:38:52.145987000Z [INFO  pallet_sol_client::pallet] [send_transaction] Transaction sent with signature: 3QuGubLdzpSi6M3Xy2VxW5ZNJZPnxwy8MfRfvKurDA3MyNYMvgKFVPXt16xzDiHbbn4Px6hfYiq6t7haA6MdbdAb
```
### BTC
```bash
[INFO  pallet_btc_client::pallet] send_transaction: OK: txid=60e95abf0d674143fae1ef11f115386a6dadcb4438ee0ab5c1a4e26438844878
```


:::info Handling Insufficient Balance Errors  
When a transaction is attempted without enough funds to cover the transfer amount and network fees, the client aborts before submission.  

All chain clients (DOT, ETH, SOL, BTC) follow the same pattern: the **initialize_transaction** step fails, and the error is returned in the logs. For example, in the SOL client:  

```bash
[ERROR itp_stf_executor::executor] Stf execute failed: Dispatch("SolClient Initialize Transaction error: ... message: Some(\"InsufficientBalance\") })
```
At this stage of the app/SDK devellopement, if an insufficient balance error occurs, the VCA token is not transfered to the app, and the screen instead displays a generic “Something went wrong!” message.

This behavior ensures no invalid transactions are broadcast and provides a clear error message for debugging and verification.
:::





:::warning Low-end devices and emulator limitations
If you are using an emulator with low-end GPU, or a low-end or outdated Android device with limited GPU, the user experience may be significantly degraded. 
Although the validation screen may be harder to read in such conditions, 
you should still be able to complete the test process.
:::

:::info FUTURE ENHANCEMENT
In the future, we plan to introduce a **trusted beneficiary** feature. This will enable users 
to register known recipient addresses on-chain through a secure validation process, preventing attackers from substituting contact names with malicious public keys. This enhancement will make the wallet both more secure and user-friendly.
:::

---

> 🛠️ You can check the logs from your local stack to see whtat happen begind the hood when you interact with the blockchain: `extrinsics` sent

## 🛠️ Interpreting Logs

When interacting with the mobile app (e.g., authentication, transaction validation, recovery),
 key log messages are printed by both `integritee-node` and `integritee-service`. 


### Trusted Action Validation Highlight
 These logs help verify that **Trusted Action Validation** flows used both in transaction validation and recovery are working as expected.

### Key messages to look for:

#### Challenge screen rendering (garbled circuit evaluation):

```bash
[tx-validation] store_metadata_aux: message_digits = [9, 7], pinpad_digits = [8, 4, 6, 7, 3, 1, 5, 2, 9, 0]
```

#### Succesfull or Failed Validations (timing or incorrect code touchscreens positions)

- If you enter an invalid code:
  ```
  [tx-validation] TxFail
  ```
- If correct:
  ```
  [tx-validation] TxPass
  ```


### 🛠️ Mobile Registration

This log trace shows what happens when a new device connects to the system and is not yet registered under a root account. The backend detects the missing account and proceeds with registration:

```bash
[INFO  pallet_mobile_registry::pallet] ensure_has_root_account failed for  while checking if registered: Module(ModuleError { index: 16, error: [0, 0, 0, 0], message: Some("RootAccountNotFound") })  
[DEBUG pallet_mobile_registry::pallet] register_mobile start for    
[DEBUG pallet_mobile_registry::pallet] register_mobile: new registration for   
[DEBUG pallet_mobile_registry::pallet] register_mobile end  
```
---

#### ✅ What to Look For

- `RootAccountNotFound`: expected on first connection from a new mobile identity.
- `register_mobile start` → `register_mobile end`: confirms that registration was initiated and completed.
- These logs confirm that the system automatically falls back to registering the mobile when not yet linked to a root account.

:::info more details
Learn more on **[Account Abstraction Layer](/developers/category/aa-layer)**
:::


:::info MORE DETAILS
Learn more on **[Authentication Layer](/developers/category/authentication-layer)**

**[`computed_inputs_from_permuation`](/developers/Milestones/M1/demo-tutorial/cli-demo-with-docker#how-to-find-the-correct-code-for-the-node)** detailed
:::


import { Table, TableHeader, TableRow, TableCell, TableBody } from "@site/src/components/ui/table";
import { Badge } from "@site/src/components/ui/badge";

## 🛠️ Multi-chain Transaction Logs with threshold gated transfer

This section explains how to read the logs emitted during a **conditional TAVP-gated transfer** executed via the Interstellar transaction clients for **DOT, ETH, BTC, and SOL**.

As of M3, `pallet_tx_manager` decides whether a transfer must be **VCA-confirmed** depending on a per-chain configured threshold:

- **Below threshold:** transaction is **auto-approved** and broadcast directly.
- **Above threshold:** `pallet_tx_manager` generates a **VCA commitment**, waits for VCA input validation, then broadcasts.

> **Note**
>
> The same log structure applies regardless of the target network environment. The “threshold → (optional) VCA → broadcast” flow and its log markers remain identical.

---

## Common structure (applies to all chains)

<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Stage</TableCell>
      <TableCell>What happens</TableCell>
      <TableCell>Key log markers</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell><strong>1. Start</strong></TableCell>
      <TableCell>Transaction preparation begins (account + chain + amount in base units).</TableCell>
      <TableCell><code>[prepare_transaction] START</code></TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>2. Threshold check</strong></TableCell>
      <TableCell>Reads <code>TX_THRESHOLD_\*</code>, parses it to base units, compares with amount.</TableCell>
      <TableCell>
        <code>TX_THRESHOLD_\*</code>, <code>below_threshold=...</code>
      </TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>3. Build + sign</strong></TableCell>
      <TableCell>Chain-specific preflight, transaction construction, and signing.</TableCell>
      <TableCell>
        <code>...client::...</code> build/sign logs + <code>pallet_key_manager</code> signing markers
      </TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>4A. Below threshold path</strong></TableCell>
      <TableCell>Auto-approve and broadcast immediately (no VCA commitment).</TableCell>
      <TableCell>
        <code>Below threshold, auto-approving transaction</code> + broadcast success marker
      </TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>4B. Above threshold path</strong></TableCell>
      <TableCell>Create VCA commitment (message + digits), store metadata + pending tx.</TableCell>
      <TableCell>
        <code>Above threshold, requiring VCA confirmation</code>, <code>Commitment stored</code>
      </TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>5. VCA validation</strong></TableCell>
      <TableCell>Validate user input via the randomized pinpad permutation.</TableCell>
      <TableCell>
        <code>[tx-validation] check_input</code> + <code>TxPass</code>
      </TableCell>
    </TableRow>

    <TableRow>
      <TableCell><strong>6. Broadcast</strong></TableCell>
      <TableCell>Submit signed transaction/extrinsic and obtain a network tx hash / signature / txid.</TableCell>
      <TableCell>
        <code>Transaction broadcast successful</code> or <code>Auto-approved transaction broadcast successful</code>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>


### Fields worth recognizing
- <code>amount_base_units</code>: chain base unit amount (wei, sats, lamports, planck-like units, etc.).
- <code>TX_THRESHOLD_\{CHAIN\}</code>: environment variable used to configure the VCA threshold for that chain.
- <code>below_threshold=true|false</code>: the decision input; the explicit decision log line follows at INFO.
- <code>message_digits</code> and <code>pinpad_digits</code>: VCA challenge and pinpad permutation used to validate the user input.
- Final broadcast markers include a chain-native identifier:
  - DOT: extrinsic hash (<code>0x...</code>)
  - ETH: transaction hash (<code>0x...</code>)
  - BTC: transaction id (<code>txid=...</code>)
  - SOL: transaction signature (base58)





## DOT — Conditional VCA-gated transfer

### 1) Start + threshold evaluation

Anchor line:

- <code>[prepare_transaction] START - ... chain=DOT, amount_base_units=...</code>

Threshold resolution appears as:

- <code>env_var=TX_THRESHOLD_DOT</code>
- <code>Read value: ...</code>
- <code>Parsed ... to ... base units</code>
- <code>threshold=..., amount=..., below_threshold=...</code>

Decision line (INFO):
- If above: <code>Above threshold, requiring VCA confirmation</code>
- If below: <code>Below threshold, auto-approving transaction</code>

### 2) Build + sign (DOT client)

Typical DOT client markers include:
- Account/balance RPC reads: <code>state_getStorage</code>
- Chain context: <code>system_chain</code>, <code>system_properties</code>, <code>state_getRuntimeVersion</code>
- Extrinsic build/sign:
  - <code>build_call Balances.transfer_keep_alive</code>
  - <code>Generated hex payload</code>
  - <code>Encoded MultiSignature</code>
  - <code>Extrinsic hex</code>

### 3) Above threshold path: VCA commitment + validation + broadcast

Commitment creation:
- <code>[generate_tx_message] Generated message: Transfer ... DOT to ...</code>
- <code>[tx-validation] store_metadata_aux: ... message_pgarbled_cid="Qm..." message_digits=[...], pinpad_digits=[...]</code>
- <code>Commitment stored with cid="Qm..." digits=... pinpad_digits=...</code>
- <code>store_pending_transaction: SUCCESS</code>

Input validation:
- <code>[tx-validation] check_input: ... input_digits=[...]</code>
- <code>computed_inputs_from_permutation = [...], message_digits = [...]</code>
- <code>TxPass</code>
- <code>VCA validation successful</code>

Broadcast:
- <code>author_submitExtrinsic</code>
- <code>Transaction broadcast successful: 0x...</code>

### 4) Below threshold path: auto-approve broadcast

You should see:
- <code>Below threshold, auto-approving transaction</code>
- immediate submission + <code>Auto-approved transaction broadcast successful: ...</code> (or equivalent final marker)

---

## ETH — Conditional VCA-gated transfer (EIP-1559)

### 1) Start + threshold evaluation

Anchor line:
- <code>[prepare_transaction] START - ... chain=ETH, amount_base_units=...</code>

Threshold parsing:
- <code>env_var=TX_THRESHOLD_ETH</code>
- <code>Parsed ... to ... base units</code>
- <code>below_threshold=...</code>

Decision line (INFO):
- <code>Above threshold, requiring VCA confirmation</code>
  or
- <code>Below threshold, auto-approving transaction</code>

### 2) ETH preflight + build + sign

You will typically see:
- Fee discovery:
  - <code>fetch_latest_base_fee: got: ...</code>
  - <code>fetch_max_priority_fee: got: ...</code>
- Balance check:
  - <code>fetch_balance: formated address = "0x..."</code>
  - <code>fetch_balance: RPC response = ...</code>
- Signing:
  - <code>pallet_key_manager ... do_sign_prehashed</code>
  - <code>create_eip1559_signed_rlp: START</code>

### 3) Above threshold path: VCA commitment + validation + broadcast

Commitment creation:
- <code>[ETH] ... Entering garble_and_store_commitment</code>
- <code>Generated message: Transfer ... ETH to 0x...</code>
- <code>store_metadata_aux ... message_pgarbled_cid="Qm..." message_digits=[...], pinpad_digits=[...]</code>
- <code>Commitment stored ...</code>
- <code>store_pending_transaction: SUCCESS</code>

Validation:
- <code>check_input ...</code>
- <code>computed_inputs_from_permutation = [...], message_digits = [...]</code>
- <code>TxPass</code>

Broadcast:
- <code>send_raw_transaction: START</code>
- <code>Transaction broadcast successful: 0x...</code>

---

## BTC — Threshold-gated transfer (UTXO-based)

BTC differs structurally because transaction construction includes UTXO scanning, selection, and per-input signing.

### 1) Start + threshold evaluation

Anchor:
- <code>[prepare_transaction] START - ... chain=BTC, amount_base_units=...</code>

Threshold:
- <code>env_var=TX_THRESHOLD_BTC</code>
- <code>Parsed ... to ... base units</code>
- <code>below_threshold=...</code>

Decision line (INFO):
- If below: <code>Below threshold, auto-approving transaction</code>
- If above: <code>Above threshold, requiring VCA confirmation</code>

### 2) UTXO discovery + unsigned tx creation

Look for:
- <code>fetch_utxos_for_address: START</code>
- RPC scan:
  - <code>Making RPC call: method=scantxoutset</code>
- Parsing:
  - <code>parse_utxos_from_response: ... parsed UTXO ...</code>
  - <code>SUCCESS: parsed N UTXOs, total_value=... sats</code>
- UTXO selection:
  - <code>select_utxos: START for ... sats</code>
  - <code>Selected ... UTXOs ... change: ...</code>
- Unsigned tx created:
  - <code>Unsigned transaction created: inputs=..., outputs=...</code>

### 3) Signing (per-input) + broadcast

Per-input signing markers:
- <code>Signing input 0: txid:vout, amount=... sats</code>
- <code>Sighash for input 0: ...</code>
- <code>pallet_key_manager ... do_sign_prehashed</code>
- <code>Successfully converted to Bitcoin DER signature</code>
- <code>Created witness for input ...</code>
- End of signing:
  - <code>Transaction signing completed: ... inputs signed</code>

Below threshold auto-approve and broadcast:
- <code>[prepare_transaction] Below threshold, auto-approving transaction</code>
- <code>Broadcasting transaction to Bitcoin network ...</code>
- <code>Transaction broadcast successful: txid=...</code>
- <code>[prepare_transaction] Auto-approved transaction broadcast successful: ...</code>

Above threshold would insert the same VCA commitment + validation steps as described in DOT/ETH, then broadcast.

---

## SOL — Threshold-gated transfer (lamports + simulate + send)

SOL differs because a simulation step is performed before broadcast.

### 1) Start + threshold evaluation

Anchor:
- <code>[prepare_transaction] START - ... chain=SOL, amount_base_units=...</code>

Threshold:
- <code>env_var=TX_THRESHOLD_SOL</code>
- <code>Parsed ... to ... base units</code>
- <code>below_threshold=...</code>

Decision line (INFO):
- <code>Below threshold, auto-approving transaction</code>
  or
- <code>Above threshold, requiring VCA confirmation</code>

### 2) Balance check + build + sign

Look for:
- Address and balance:
  - <code>[get_balance_account_str] Fetching balance for account: ...</code>
  - <code>getBalance ... value=...</code>
  - <code>✓ balance check passed</code>
- Blockhash:
  - <code>getLatestBlockhash ... blockhash="..."</code>
- Signing:
  - <code>pallet_key_manager ... do_sign</code>
  - <code>[build_and_sign_transaction] transaction built and signed: ... bytes</code>

### 3) Below threshold path: simulate then broadcast

Auto-approve:
- <code>[prepare_transaction] Below threshold, auto-approving transaction</code>

Simulation:
- <code>[simulate_transaction] Simulating transaction</code>
- <code>simulateTransaction ... err=null</code>
- <code>✓ no error detected in simulation response</code>
- <code>Transaction simulation successful</code>

Broadcast:
- <code>sendTransaction ...</code>
- <code>Transaction sent with signature: ...</code>
- <code>[prepare_transaction] Auto-approved transaction broadcast successful: ...</code>

Above threshold would insert VCA commitment + validation before broadcast (same pattern as DOT/ETH).

---

### Quick troubleshooting markers

- If the transaction was above threshold but never broadcast:
  - Check for <code>store_pending_transaction: SUCCESS</code> then later <code>TxPass</code>.
- If VCA fails:
  - Compare <code>computed_inputs_from_permutation</code> and <code>message_digits</code>.
- If SOL broadcast fails:
  - Look for simulation <code>err</code> and <code>check_transaction_err</code> markers.
- If BTC broadcast fails:
  - Inspect RPC response from <code>sendrawtransaction</code> and whether signing completed for all inputs.




#### Parentchain Inclusion / Sync

> parentchain sync logs
```bash
2025-08-29T14:26:37.130937000Z [+] Received finalized header update (855), syncing parent chain...
2025-08-29T14:27:01.151365000Z [+] Received finalized header update (857), syncing parent chain...
```


✅ **What to look for**  
- Parentchain finalized headers advancing.  
- Event vectors synced.  



## Optional: Front-End Access

You can inspect chain state and transactions via:

- [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://localhost:9944)
- Or your preferred Substrate front-end UI

## Notes

- All services run in Docker containers and use local ports `9944`, `2090`, and `5001`
- This setup replicates the same runtime environment used in hosted testnets but fully self-contained
- Ideal for offline testing, developer evaluation, or deeper inspection of runtime logs



:::info Recovery Testing in Milestone 2  
Recovery was introduced in **M1** and remains part of the overall testnet scope. All subsequent milestones are designed to remain **compatible with the recovery flow**, but in **M2 we are not re-testing or refining recovery**.  

The focus of M2 is backend transaction generation and execution. Recovery will be revisited in future milestones (notably **M4**) and fully integrated with the **SDK delivery**, where its stability and developer usability can be validated in a realistic context.  

This avoids redundant effort at this stage, while ensuring continuity from M1 to later milestones.  
:::  









---
:::note Technical Preview – Foundation for Secure Mobile SDKs  
This Android application is provided as a technical demonstration of Interstellar’s secure Web3 account infrastructure. It serves as a foundation for the forthcoming Android and iOS SDKs, which are still under active development.  

Please note that the current user interface and experience are not representative of the final product. Both UI and UX will be significantly refined to align with Interstellar’s core mission: delivering the highest levels of simplicity and security in mobile self-custody.  
:::


:::info Follow-Up – Selective Docs Exploration

If you've jumped straight into the evaluation, we recommend consulting the **[Milestone 1 documentation](/Milestones/M1/Summary.md)** for key context. It outlines the core architecture, backend logic, and trusted execution flows implemented in this milestone.

The documentation is modular—feel free to explore only the sections most relevant to your review or interest.  
You can also use the **search bar** (top right corner) to locate specific topics quickly. Helpful keywords include:

- `VHDL`, `circuits`, `garbled`, `TEE`, `integritee`,`SE attestation`  
- `NFC`, `VCA`,`recovery`, `threshold`, `trusted UX`  
- `comparison`, `passkey`, `ledger`, `authentication`, `compliance`, `security`, `ATT&CK`

:::
