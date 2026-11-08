# TITAN — REA Reference Map & Design Specification
**Reference Target:** LeetCode Modern Web Experience (Problem Workspace, Problem List & Contest Surfaces)  
**Product:** TITAN (Temporary Instant Trusted Anonymous Network)  
**Date:** 2026-11-08  
**Status:** Milestone 1 Baseline Verified

---

## 1. Executive Summary & Mapping Philosophy

The core concept of TITAN is an end-to-end encrypted, ephemeral two-person communication and file-sharing tool concealed within a high-density, professional LeetCode-inspired coding workspace.

Rather than presenting a conventional chat bubble interface (like WhatsApp or Telegram), TITAN transforms:
1. **The Problem Catalog:** Navigation hub presenting coding challenges, featuring **Problem 7 ("7. Private Communication")** as the dedicated two-person conversation destination.
2. **Problem 7 Workspace:** A LeetCode Problem Detail page where the traditional "Testcase / Result" console becomes the chronological test-case message stream and reply engine.
3. **Messages as Test Cases:** Each outgoing message is styled as a Test Case submission (e.g. `Case 1`, `Case 2`) with inputs, expected outputs, or code blocks.
4. **Contest Surface:** The LeetCode Contest arena repurposed for ephemeral image and attachment exchange between the two connected peers.

---

## 2. Inspected Reference Patterns (LeetCode Web Experience)

### 2.1 Global Application Shell & Top Navigation
- **Height & Stickiness:** Fixed/Sticky top navigation bar (`50px` height) with `border-b` subtle dark separator (`#333333`).
- **Background:** Solid dark neutral (`#1a1a1a` / `#121212`), high visual stability during page transitions.
- **Left Navigation Items:**
  - Brand Mark: Minimal geometric glyph + text.
  - Primary links: **Explore**, **Problems**, **Contest**, **Discuss**.
  - Active item state: High-contrast white text (`#eff1f3`) with bold weight and subtle bottom accent or highlight.
- **Right Navigation Items:**
  - Status indicator / Connection pill (green dot for active, amber for reconnecting, red/gray for disconnected).
  - Quick action buttons (Run/Submit/Timer).
  - Profile avatar / session indicator dropdown.

### 2.2 Problems Catalog Surface (`/problems`)
- **Layout:** Centered container (`max-w-7xl` ~ `1200px`) with compact padding (`py-6 px-4`).
- **Table / List View:**
  - Column headers: Status (`Status`), Title (`Title`), Solution (`Solution`), Acceptance (`Acceptance`), Difficulty (`Difficulty`), Frequency (`Frequency`).
  - Row density: Compact `44px` height per row, subtle hover state (`#282828`).
  - Problem 7 representation:
    - Number: `7`
    - Title: `Private Communication` (or `Two-Person Network Protocol`)
    - Difficulty: `Hard` (LeetCode Red `#ff375f`) or `Medium` (LeetCode Amber `#ffc01e`)
    - Status: Locked/Key icon indicating encrypted channel; green checkmark when active session established.

### 2.3 Problem 7 Workspace Layout (`/problems/7`)
- **Two-Column Split Layout:**
  - **Left Pane (Problem Context & Security Info) [40% - 45% width]:**
    - Header with tab bar: `Description`, `Editorial`, `Solutions`, `Submissions`.
    - Title: `7. Private Communication` with difficulty pill (`Medium` / `Hard`).
    - Problem Brief: Explaining the zero-knowledge session, ephemeral keys, safety verification number, and peer connection state.
    - Constraints section: Expiry TTL countdown, max payload size (64KB text, 5MB image), max participants: 2.
  - **Right Pane (Interaction & Console Area) [55% - 60% width]:**
    - Split into vertical halves:
      - **Upper Region (Code / Message Workspace):** Monaco-style dark code view or active message thread view.
      - **Lower Region (Testcase Console / Reply Thread):**
        - Tabs: `Testcase` (active message list), `Result` (delivery receipts, crypto status).
        - Individual Testcase Tabs (`Case 1`, `Case 2`, `Case 3...`).
        - Card content displaying sender ("You" vs "Participant 2"), timestamp, encrypted transmission indicator, and reply history.
        - Reply action button linking directly to the specific test case ID.
    - **Bottom Action Bar:**
      - "Run" button (styled as LeetCode gray secondary) -> Preview/Dry Run.
      - "Submit" button (styled as LeetCode vibrant green/orange `#2cbb5d` or `#ffa116`) -> Send Encrypted Testcase.

### 2.4 Contest Surface (`/contest`)
- **Layout:** High-density banner and card grid.
- **Header:** "TITAN Weekly Contest — Secure Attachment Exchange".
- **Interaction Model:**
  - File Dropzone matching LeetCode code submission box: drag-and-drop support for PNG, JPEG, WebP.
  - Client-side encryption with progress bar.
  - Active submission gallery showing received attachments with thumbnail, file metadata, sender signature, and countdown to expiration.
  - Lightbox modal with zoom, inspection, and one-click download/clear.

---

## 3. Design Tokens & Visual Hierarchy

```css
:root {
  /* Surface Layers */
  --titan-bg: #1a1a1a;              /* Deep neutral app canvas */
  --titan-surface-card: #242424;    /* Primary card & pane background */
  --titan-surface-raised: #2a2a2a;  /* Elevated inputs, dropdowns, headers */
  --titan-surface-hover: #323232;   /* Hover states on interactive rows */
  
  /* Borders */
  --titan-border-subtle: #333333;  /* Dividing lines between panes */
  --titan-border-focus: #4a4a4a;   /* Active tab border */
  
  /* Text */
  --titan-text-primary: #eff1f3;    /* Main labels, high-contrast readable */
  --titan-text-secondary: #9da3af;  /* Metadata, timestamps, muted labels */
  --titan-text-code: #f8f8f2;       /* Monospace code snippet text */
  
  /* LeetCode Accents */
  --titan-accent-orange: #ffa116;   /* LeetCode primary action / run button */
  --titan-accent-green: #2cbb5d;    /* Easy difficulty / success / connected */
  --titan-accent-amber: #ffc01e;    /* Medium difficulty / reconnecting */
  --titan-accent-red: #ff375f;      /* Hard difficulty / danger / disconnect */
  
  /* Typography */
  --titan-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --titan-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

---

## 4. Component Mapping & Responsibilities

| Reference UI Element | TITAN Component | Behavior |
| :--- | :--- | :--- |
| **Top Navbar** | `<AppShellHeader />` | Shows TITAN brand, Problems/Contest nav, connection dot, copy room code button, settings. |
| **Problem List Table** | `<ProblemCatalog />` | Renders problem numbers 1-10; Problem 7 is clickable and highlighted as Active. |
| **Problem Description Pane** | `<ProblemContextPanel />` | Displays Problem 7 requirements, active session duration, E2EE verification code. |
| **Testcase Selector Tabs** | `<TestCaseTabs />` | Shows received messages as `Case 1`, `Case 2`, etc., with unread indicators. |
| **Testcase Card / Body** | `<TestCaseCard />` | Formats payload as text, code block, or structured inputs/expected values; has "Reply" button. |
| **Console Run / Submit Bar**| `<MessageComposer />` | Multiline editor with mode switcher (Text, Code, Structured Case) and "Submit Testcase" button. |
| **Contest Arena** | `<ContestAttachmentView />` | Ephemeral encrypted image transfer, thumbnail grid, image lightbox modal. |
| **Session / Status Bar** | `<ConnectionStatusBanner />` | Persistent feedback: Connected, Reconnecting, Partner Offline, Expired. |

---

## 5. Architectural Verification Plan
- **Milestone 1:** Workspace inspection & REA Reference Map (Complete).
- **Milestone 2:** Design foundation, LeetCode theme tokens, AppShell, and Header.
- **Milestone 3:** Problems Catalog and `/problems/7` routing.
- **Milestone 4:** Problem 7 Chat UI with Test-Case formatting & thread replies.
- **Milestone 5:** Two-person WebSocket realtime gateway with atomic 2-participant limit.
- **Milestone 6:** Symmetric test-case exchange and acknowledgement events.
- **Milestone 7:** Contest image sharing with client-side encryption and expiry.
- **Milestone 8:** End-to-end security, PBKDF2/AES-GCM encryption, and local session management.
- **Milestone 9 & 10:** Integration testing, multi-client verification, and production readiness.

