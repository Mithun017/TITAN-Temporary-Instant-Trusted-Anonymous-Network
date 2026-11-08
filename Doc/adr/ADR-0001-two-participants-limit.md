# ADR-0001: Exactly Two Participants Per Room in Initial Release

**Status:** Accepted  
**Date:** 2026-11-08  

## Context
TITAN is designed for private, high-trust, two-person communication and collaboration disguised as a LeetCode coding workspace. Supporting open groups or multi-party chat in v1 introduces key distribution complexities, metadata leakage, and breaks the focused "paired developer" interaction model.

## Decision
Strictly enforce a maximum room capacity of two participants. Membership checks must be enforced atomically on the backend rather than on the client. Any attempt by a third client to enter an occupied room is rejected with HTTP 409 (`Room is full`).

## Consequences
- Eliminates group key exchange overhead; enables symmetric pair key derivation via PBKDF2 / AES-256-GCM.
- Keeps message fan-out strictly 1-to-1.
- Clear, predictable lifecycle: when both leave or the room expires, the session is terminated.

