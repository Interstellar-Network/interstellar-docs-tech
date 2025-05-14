---
sidebar_label: 'NFC Tag Registry'
sidebar_position: 3
---

# NFC Tag Registry

The NFC Tag Registry enables users to register **hardware recovery tokens**—such as NFC cards, stickers, or embedded secure elements—as part of their decentralized recovery strategy. These tags act as **verifiable recovery items** and can be used in multi-factor recovery policies without requiring custodial services or passphrases.

## Purpose

NFC tags offer a simple, user-friendly way to:
- Anchor a recovery factor to a physical device
- Use common, inexpensive hardware (e.g. NTAG-based tags)
- Extend recovery logic into **2-of-3** or higher threshold configurations

The registry binds an NFC tag’s unique ID to an **on-chain item account**, used by the extended recovery pallet.

## Registration Flow

1. **Scan & Extract UID**  
   During setup, the mobile app scans the NFC tag and reads its unique hardware identifier (UID). This ID is **never stored in plaintext on-chain**.

2. **Hash and Derive Item Account**  
   The UID is hashed and mapped to a deterministic **item account ID**. This ensures that the NFC tag can later be verified by re-scanning, without exposing metadata.

3. **Register with Root Identity**  
   A transaction is sent to the NFC Tag Registry pallet within the trusted TEE runtime:
   - Associates the derived item account ID with the user’s proxy/root identity
   - Marks the tag as an eligible recovery factor

## Security Considerations

- **No private data stored on-chain**: All tag identifiers are hashed client-side before registration.
- **Offline-compatible**: NFC tags do not require active electronics or connectivity.
- **TEE-verified**: Registration and future verification are processed securely inside the TEE.

## Usage in Recovery

Once registered, the NFC tag may be used to:
- Satisfy threshold-based recovery policies (e.g., 2-of-3)
- Serve as a physical factor in biometric-plus-hardware authentication
- Be combined with cloud-backed VCA tokens or other secure files

---

The NFC Tag Registry allows everyday physical objects to become secure, verifiable recovery devices—enhancing resilience without compromising user sovereignty.
