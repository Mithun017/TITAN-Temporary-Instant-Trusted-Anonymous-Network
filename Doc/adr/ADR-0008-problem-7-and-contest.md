# ADR-0008: Problem 7 as Chat Workspace and Contest as Ephemeral File Exchange

**Status:** Accepted  
**Date:** 2026-11-08  

## Context
A private communication tool disguised inside a developer platform needs specific destinations that map logically to practice features without arousing suspicion.

## Decision
1. **Problem 7 ("7. Private Communication"):** Designated as the active two-person text, code, and structured test-case exchange workspace. Messages arrive and display as test-case runs (`Case 1`, `Case 2`, etc.) with inline threaded replies. Non-7 problem entries exist as contextual placeholders.
2. **Contest Arena:** Repurposed as the temporary, encrypted image-sharing area between the same two participants, featuring drag-and-drop file upload, client-side encryption, and short-lived lifecycle destruction.

## Consequences
- Authentic LeetCode user workflow: participants navigate problems and contest challenges.
- Clear separation between textual/code messaging (Problem 7) and visual/attachment collaboration (Contest).
- Extensible architecture for future collaboration modes.

