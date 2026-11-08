# ADR-0005: Standard Web Crypto API (PBKDF2 + AES-256-GCM)

**Status:** Accepted  
**Date:** 2026-11-08  

## Context
Rolling a custom cryptographic cipher or inventing an unreviewed key-agreement protocol is a well-known anti-pattern in security engineering.

## Decision
Utilize the standardized W3C Web Crypto API (`window.crypto.subtle`) available natively in all modern browsers and Node.js:
1. **Key Derivation:** PBKDF2 with SHA-256 and 100,000 iterations to derive a 256-bit AES-GCM key from the secret passphrase and room salt.
2. **Authenticated Encryption:** AES-256-GCM with a fresh 12-byte random IV for every single message and attachment.
3. **Safety Verification:** Compute a deterministic 16-digit hexadecimal/numeric fingerprint of the derived key and salt for out-of-band peer verification.

## Consequences
- High cryptographic assurance verified by browser vendors.
- Hardware-accelerated encryption/decryption in the browser sandbox.
- The relay server never possesses the secret key and forwards only ciphertext envelopes.

