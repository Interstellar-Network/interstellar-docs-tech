---
sidebar_label: 'CLI Demo with Local Docker'
sidebar_position: 4
---

:::warning Demo Not Functional
This demo tutorial is provided for reference and future use only.  
**App download links and Docker Compose commands are currently non-functional.**  
Do not rely on this version for testing or deployment.
:::


# CLI-Based Demo with Local Docker (for future use)

This guide allows you to test the backend components of Interstellar’s secure Web3 account system directly from your terminal, without relying on the Android app. It runs the full stack locally using Docker or Podman, and walks through account registration, recovery and transaction validation using a CLI script.


:::info
This method is ideal for reviewers who either do not have access to an Android device or emulator, or who want to explore the Milestone 1 runtime logic in greater depth — including log inspection and backend validation — after testing the mobile demo via the hosted VPS.
:::


---

## Prerequisites

| Install Docker | Install Podman |
| -------------- | -------------- |
| [docker](https://docs.docker.com/engine/install/) | [podman](https://podman.io/getting-started/installation.html) |
| [docker-compose](https://docs.docker.com/compose/install/) | [podman-compose](https://github.com/containers/podman-compose#podman-compose) |

:::warning
When using `docker` or `docker-compose`, you usually need to run as `sudo`.  
When using `podman` or `podman-compose`, you **must not** be root.
:::

Also install:
```bash
sudo apt-get install jq curl wget
```

---

## 1. Launch the Blockchain Stack

```bash
mkdir interstellar_demo && cd interstellar_demo
curl -L -o docker-compose.yml https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/add-compose/docker-compose.yml
curl -L -o docker-ipfs-init.sh https://raw.githubusercontent.com/Interstellar-Network/containers/refs/heads/add-compose/docker-ipfs-init.sh
chmod +x docker-ipfs-init.sh
```
Ensure both files `docker-compose.yml` and `docker-ipfs-init.sh` are in the same directory:

```bash
ls -al
```

If using Docker:
```bash
sudo service docker start
```

Then launch the full stack:

```bash
sudo docker compose down --timeout 1 && sudo docker compose up --force-recreate
```

> Replace `docker compose` with `podman-compose` if using Podman.

Wait until you see repeated log lines like:

```
[ocw-circuits] Hello from pallet-ocw-circuits.
🛌 Idle (0 peers), best: #6 (...), finalized #3 (...), ⬇ 0 ⬆ 0
```

---

## [Optional] 1.5 Launch a Substrate Frontend

You can inspect chain state via a browser UI:

- [Polkadot.js](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2Flocalhost%3A9990#/chainstate)
- Or your prefered Substrate front end UI

:::note
When using WSL, **use `localhost`**, not `127.0.0.1`, or the port forwarding may fail.
:::

---

## 2. Run the Integritee CLI Demo Script

Use the CLI to run the demo script inside the container:

```bash
sudo docker compose run --entrypoint /usr/local/worker-cli/demo_interstellar.sh integritee_cli -P 2090 -p 9990 -u ws://integritee_node -V wss://integritee_service -R http://integritee_node:8990
```

> Replace `sudo docker compose` with `podman-compose` if using Podman.

### On first run:

You may see:

```
OCW_CIRCUITS_STORAGE is NOT initialized
MUST call extrinsic 'submitConfigDisplayCircuitsPackageSigned'
Calling extrinsic...
```

Wait ~45–60 seconds, then re-run the command.
>or check the front-end: Query for `DisplaySkcdValue`

You should eventually see a successful message:
```
callback_new_skcd_signed sent number : 1
```

If the result is `0`, the circuit has not been initialized properly.

---

## 3. Interactive Code Input

After re-running the script, you’ll be prompted to input digits:

```
Inputs to use? [space separated list of int; eg 0 1 2 3]
```

### How to Find the Correct Code for the node

When the script pauses for input, check logs like this:

```
[tx-validation] store_metadata_aux: message_digits = [9, 7], pinpad_digits = [8, 4, 6, 7, 3, 1, 5, 2, 9, 0]
```

#### The Node is waiting for the correct position in the randomized pinpad of the correct code for the user.


In this example:

- **Correct code displayed to the user** = `9 7`
- **Randomized pinpad order** = `[8, 4, 6, 7, 3, 1, 5, 2, 9, 0]`

This matches the visual logic used in the Android app.

![random keypad](/img/random-keypad.svg)


- `9` is the **eighth** digit in the list(0-indexed) and `7` the **third** one.


- **You must enter** `8 3` **when prompted to validate**
  
## 4 Check if the code is correct

**Go to the integritee service logs again and look for:** 


- If you enter an invalid code:
  ```
  [tx-validation] TxFail
  ```
- If correct:
  ```
  [tx-validation] TxPass
  ```

---





:::info
If you’ve jumped directly into evaluation without first reading the documentation, we recommend reviewing the [**Milestone 1 documentation**](/Milestones/M1/Summary.md). It provides essential context on the architecture, backend logic, and trusted execution flows implemented in Milestone 1.
:::

