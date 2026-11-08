# TITAN — Temporary Instant Trusted Anonymous Network

> **Connect privately. Chat freely. Leave no trace.**

TITAN is a temporary, private, two-person communication and file-sharing workspace disguised within a high-density, LeetCode-inspired coding platform.

Rather than looking like a conventional messaging app, the entire product is presented as a developer practice platform where **Problem 7 ("7. Private Communication")** functions as the secure two-person communication channel, and **Contest** serves as the temporary encrypted attachment exchange area.

---

## Key Architectural Principles

1. **Strict Two-Person Pair Constraint:** Every room admits strictly up to two authenticated participants (atomic backend validation). Any attempt by a third client to enter is instantly rejected.
2. **Zero Permanent Server-Side Chat History:** The backend acts strictly as an in-memory, volatile ciphertext relay. Plaintext messages and image contents are never written to disk, database, or server logs.
3. **End-to-End Authenticated Encryption (AES-256-GCM):** Plaintext messages and attachments are encrypted directly in the browser via the Web Crypto API before leaving the client device. Keys are derived from a shared secret passphrase + room salt using PBKDF2 with SHA-256 (100,000 iterations).
4. **Safety Fingerprints:** A 16-digit human-verifiable security fingerprint allows both peers to verify out-of-band that they share the exact same cryptographic key without exposing the key material.
5. **LeetCode-Inspired Design System:** One single dark theme across the entire application:
   - Deep canvas (`#1a1a1a`), raised card panels (`#242424`), subtle borders (`#333333`)
   - LeetCode orange primary accent (`#ffa116`) and status indicators (`#2cbb5d`, `#ffc01e`, `#ff375f`)
   - Monospace typography for test cases, code snippets, and session tokens
6. **Messages as Test Cases:** Chronological conversation stream formatted as testcase runs (`Case 1`, `Case 2`, etc.) with support for plain text, syntax-highlighted code snippets, and structured input/output parameters.
7. **Threaded Replies:** Responses reference specific parent test-case IDs and remain attached to their originating items.
8. **Contest Ephemeral File Exchange:** Drag-and-drop client-side encrypted image sharing (PNG, JPEG, WebP up to 5MB) with automatic lifecycle destruction.

---

## Directory Structure

```text
Code/
├── public/                 # Static brand assets
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root HTML layout with dark theme
│   │   ├── globals.css     # LeetCode dark tokens & custom scrollbars
│   │   ├── page.tsx        # Home route (Problem Catalog)
│   │   ├── problems/
│   │   │   ├── page.tsx    # Problem Catalog
│   │   │   └── 7/page.tsx  # Problem 7 (Private Communication Workspace)
│   │   ├── contest/
│   │   │   └── page.tsx    # Contest (Ephemeral Image Sharing)
│   │   └── api/
│   │       ├── health/     # Health check endpoint
│   │       ├── rooms/      # Room creation API
│   │       └── rooms/join/ # Atomic room join API
│   ├── components/
│   │   ├── shell/          # AppShell, TopBar navigation
│   │   ├── problem/        # ProblemCatalog, ProblemWorkspace (Problem 7)
│   │   ├── contest/        # ContestView, file uploader, gallery
│   │   └── modals/         # JoinCreateModal, SettingsModal, PrivacyModal
│   ├── hooks/
│   │   └── useRealtime.ts  # WebSocket client with heartbeat & reconnect
│   ├── lib/
│   │   ├── crypto.ts       # Web Crypto API: PBKDF2 + AES-256-GCM
│   │   ├── db.ts           # IndexedDB helper for local drafts/prefs
│   │   └── utils.ts        # Formatting & tailwind-merge helper
│   ├── schemas/            # Zod runtime validation schemas
│   ├── server/
│   │   └── roomManager.ts  # Atomic room coordination & TTL cleaner
│   ├── stores/
│   │   └── roomStore.ts    # Zustand store for room, messages, crypto keys
│   └── types/              # TypeScript event & data contracts
├── tests/                  # Unit and integration test suite
├── server.js               # Unified Next.js + WebSocket relay server
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm or pnpm

### 1. Installation
```bash
cd Code
npm install
```

### 2. Environment Configuration
Copy the template to `.env.local`:
```bash
cp .env.example .env.local
```

Key environment variables:
- `PORT`: Server port (default: `3001`)
- `ROOM_TTL_SECONDS`: Maximum session duration in seconds (default: `1800` / 30 mins)
- `MAX_ROOM_PARTICIPANTS`: Strict limit per room (`2`)
- `MAX_MESSAGE_BYTES`: Max plaintext/ciphertext payload (`65536` / 64KB)
- `MAX_ATTACHMENT_BYTES`: Max image attachment size (`5242880` / 5MB)

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Run Test Suite
```bash
npm test
```
Executes all unit and integration tests covering:
- Cryptographic key derivation, AES-256-GCM encryption/decryption, fingerprint calculation, and authentication tag mismatch rejection.
- Atomic room creation, 2-participant capacity enforcement, and rejection of 3rd participant.
- Zod schema validation for event envelopes and payloads.

### 5. Production Build & Start
```bash
npm run build
npm start
```

---

## Two-Person Pairing Workflow

1. **Participant 1 (Room Creator):**
   - Clicks **Pair Session** or **Initialize / Pair Session**.
   - Selects **Create New Room**.
   - Chooses a display alias and a Secret Passphrase (or generates a secure random one).
   - Receives an unguessable Room Code (e.g., `TITAN-8921-XQ`).
   - Shares the Room Code and Passphrase with Participant 2 out-of-band.
2. **Participant 2 (Joiner):**
   - Opens the application in a separate browser context or device.
   - Clicks **Pair Session** -> **Join Existing Room**.
   - Enters the Room Code, Secret Passphrase, and their alias.
   - The gateway validates credentials and atomically assigns Slot 2.
3. **Problem 7 Unlocks:**
   - Both participants are redirected to **Problem 7 (Private Communication)**.
   - The top bar displays `Connected (2/2)` with a pulsing green indicator.
   - Both participants can verify their 16-digit Safety Fingerprint under the Shield icon.
   - Messages sent by Participant 1 arrive for Participant 2 as numbered test cases.
   - Either participant can reply directly to any test case.
   - Either participant can switch to **Contest** to share encrypted images.

---

## Security & Privacy Notice

- **Ephemeral Memory Only:** Chat history is never stored in any database. Closing the browser or allowing the 30-minute room TTL to expire purges all transient state.
- **Client-Side Encryption:** The server relays only AES-256-GCM ciphertext. It does not have access to your private key or plaintext.
- **Honest Limitations:** "Leave no trace" means zero server-side retention. However, TITAN cannot prevent physical actions on recipient devices (e.g. screenshots, photographs, external downloads). Always chat with trusted peers.

