# TITAN — End-to-End Verification & Test Report

**Product:** TITAN — Temporary Instant Trusted Anonymous Network  
**Tagline:** Connect privately. Chat freely. Leave no trace.  
**Document Type:** Milestone 9 & 10 Verification Report  
**Execution Environment:** Node.js v24.19.0, Windows 64-bit  
**Status:** All Tests Passed (15/15 Unit Tests, 7/7 Live Integration Steps)

---

## 1. Executive Summary

This report documents the verification and test suite executed against the TITAN communication platform. 

The test coverage spans:
1. **Cryptographic primitives & Web Crypto API integration:** Key derivation (PBKDF2), authenticated encryption (AES-256-GCM), tamper detection, and 16-digit safety fingerprint computation.
2. **Room lifecycle & capacity constraints:** Atomic two-participant limit enforcement, rejection of unauthorized third participants (HTTP 409), unguessable room code generation, and session TTL expiration.
3. **Payload schema validation:** Zod runtime validation of room creation, join, encrypted message envelopes, and attachment size constraints.
4. **Live bidirectional multi-client integration:** Live simulated two-browser interaction (Alice & Bob) testing WebSocket handshakes, encrypted message relays, delivery receipts, and ephemeral file exchange.

---

## 2. Test Suite 1: Cryptographic Subsystem (`crypto.test.js`)

| Test Case | Description | Result | Execution Time |
| :--- | :--- | :---: | :---: |
| `TC-CRYPTO-01` | Derives valid 256-bit AES-GCM CryptoKey using PBKDF2 (SHA-256, 100,000 iterations) from secret passphrase and salt. | **PASS** | 15.05 ms |
| `TC-CRYPTO-02` | Encrypts and decrypts text payload correctly (round-trip plaintext identity). | **PASS** | 13.64 ms |
| `TC-CRYPTO-03` | Authentication tag failure: Verifies that decrypting ciphertext with a mismatched passphrase fails. | **PASS** | 25.81 ms |
| `TC-CRYPTO-04` | Safety Fingerprint Determinism: Identical keys produce identical 16-digit human-verifiable fingerprints. | **PASS** | 24.66 ms |
| `TC-CRYPTO-05` | Safety Fingerprint Divergence: Different keys produce divergent fingerprints. | **PASS** | 23.98 ms |

**Total Suite 1:** 5 tests, 5 passed, 0 failed.

---

## 3. Test Suite 2: Room Capacity & Enforcement (`room.test.js`)

| Test Case | Description | Result | Execution Time |
| :--- | :--- | :---: | :---: |
| `TC-ROOM-01` | Creates valid room with unguessable code (`TITAN-XXXX-XXXX`) and assigns Participant 1 (Slot 1). | **PASS** | 1.24 ms |
| `TC-ROOM-02` | Second participant joins with valid credentials and is assigned Slot 2 (`ACTIVE` status). | **PASS** | 0.26 ms |
| `TC-ROOM-03` | **Strict 2-Slot Rule:** A third client attempting to join an active room is atomically rejected with a capacity error. | **PASS** | 0.22 ms |
| `TC-ROOM-04` | Join rejection on incorrect passphrase (HTTP 403 / auth failure). | **PASS** | 0.20 ms |
| `TC-ROOM-05` | Join rejection on non-existent or expired room code. | **PASS** | 0.11 ms |

**Total Suite 2:** 5 tests, 5 passed, 0 failed.

---

## 4. Test Suite 3: Schema Validation (`schemas.test.js`)

| Test Case | Description | Result | Execution Time |
| :--- | :--- | :---: | :---: |
| `TC-SCHEMA-01` | Validates valid room creation payload with display alias and passphrase. | **PASS** | 1.07 ms |
| `TC-SCHEMA-02` | Rejects passphrase shorter than minimum required length. | **PASS** | 0.38 ms |
| `TC-SCHEMA-03` | Validates join payload containing room code, passphrase, and alias. | **PASS** | 0.14 ms |
| `TC-SCHEMA-04` | Validates encrypted message envelope schema with UUID, ciphertext, IV, and type. | **PASS** | 0.36 ms |
| `TC-SCHEMA-05` | Rejects unrecognized message types. | **PASS** | 0.22 ms |

**Total Suite 3:** 5 tests, 5 passed, 0 failed.

---

## 5. Live Automated End-to-End Test (`live-e2e.js`)

A live test was executed against a running TITAN server (`http://127.0.0.1:3001`) with two independent client connections:

```text
[LIVE-E2E] Step 1: Health check endpoint GET /api/health -> HTTP 200 OK
[LIVE-E2E] Step 2: Participant 1 (Alice) creates room -> Room Code TITAN-QT6B-9SBC, Slot 1 assigned
[LIVE-E2E] Step 3: Participant 2 (Bob) joins room -> Authenticated, Slot 2 assigned
[LIVE-E2E] Step 4: Participant 3 (Eve) attempts to join -> Rejected with HTTP 409 (Room Full)
[LIVE-E2E] Step 5: Both Alice and Bob establish WebSocket connections at ws://127.0.0.1:3001/ws
[LIVE-E2E] Step 6: Alice submits test-case message -> Server acks (ack-1) -> Bob receives message.receive envelope in real-time
[LIVE-E2E] Step 7: Bob submits encrypted attachment (test_diagram.png) -> Alice receives attachment.share in real-time
[LIVE-E2E] Result: ALL LIVE E2E TESTS PASSED SUCCESSFULLY!
```

---

## 6. Known Boundaries & Limitations

1. **Client-Side Physical Capture:** "Leave no trace" guarantees that the server retains 0 bytes of persistent chat or image data. However, recipients can take screenshots, record screens, or download decrypted images. Users must communicate only with trusted peers.
2. **Session Expiry:** Rooms expire automatically after the configured TTL (default: 30 minutes). Once expired, active WebSocket sockets are terminated and all temporary in-memory routing keys are deleted.
3. **Decoupled WebSocket Deployment:** In production, if deploying to Vercel, the Next.js frontend runs serverless while the realtime WebSocket gateway (`server.js`) runs in a persistent container (e.g. Railway, Render, Fly.io, or Docker), connected via `NEXT_PUBLIC_WS_URL`.

