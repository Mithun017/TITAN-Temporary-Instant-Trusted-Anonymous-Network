# ADR-0002: Zero Permanent Server-Side Message History

**Status:** Accepted  
**Date:** 2026-11-08  

## Context
Standard messaging applications persist conversations in permanent databases (PostgreSQL, MongoDB, DynamoDB). For TITAN, the fundamental value proposition is "Connect privately. Chat freely. Leave no trace." Storing chat archives creates long-term risk of subpoena, breach, or accidental data exposure.

## Decision
The backend operates strictly as an in-memory, volatile ciphertext relay. No message bodies, plaintext, or encrypted archives are ever written to a permanent disk, SQL database, or document store.

## Consequences
- Server memory requirements remain negligible and bounded.
- Message history is transient: refreshing the page or closing the room empties the conversation.
- The system honestly explains to users that "Leave no trace" applies to server-side retention; physical actions on recipient devices (screenshots) remain outside cryptographic control.

