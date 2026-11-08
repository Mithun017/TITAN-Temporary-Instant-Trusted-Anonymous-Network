# TITAN — Code Architecture & Implementation Guide

> **Live Deployment:** [Problems - LeetCode](https://leetcodecom.vercel.app/)

TITAN is a dual-function system pairing a pixel-perfect [LeetCode](https://leetcodecom.vercel.app/) clone with an ephemeral, zero-knowledge, end-to-end encrypted peer chat tunnel.

---

## 🌟 Production Deployment

Access the deployed application:
👉 **[Problems - LeetCode](https://leetcodecom.vercel.app/)**

---

## 🔑 Key Features & Enhancements

### 1. Direct-Link Chat (No Room IDs, No Passphrases)
- Users can initiate or join encrypted peer sessions instantly via a direct link (`/problems/7?room=TITAN-XXXX-YYYY`).
- No modal or password prompt interrupts the user.
- The AES-256-GCM encryption key is derived automatically upon joining.

### 2. Built-in Console Chat Interface
- Integrated directly into the problem console drawer alongside the standard LeetCode tabs:
  - **`Testcase`**: Edit problem inputs or inject disguised signals.
  - **`Test Result`**: Output console showing runtime metrics and `Runtime Error` stealth view.
  - **`Chat 💬`**: Full real-time message stream with sent/delivered status, live typing indicator (`Running test...`), timestamping, and instant disguise mode.

### 3. Pixel-Perfect LeetCode Design System
- Dark mode palette: `#1a1a1a` canvas, `#222222` panels, `#282828` elevated cards, `#ffa116` LeetCode gold.
- **Problem 7 (7. Reverse Integer):** Replicates the authentic LeetCode interface and stealth `Runtime Error` screen (`IndentationError: expected an indented block after function definition on line 60`).
- **Problem 1 (1. Two Sum):** Starter code matching the optimal hash map solution, split `nums =` and `target =` input cards, and `Accepted (0 ms)` test results.
- **Problem 1267 (1267. Count Servers that Communicate):** Complete solution with retro CRT server network illustrations.

### 4. Dynamic Profile Page (`/u/[username]`)
- Route: `/u/Mithun1706`
- **Guardian Contest Rating:** Graph peaking at **`2,308`** (`Top 0.52%`, Global Rank `4,390/891,547`).
- **Solved Metrics:** Donut chart (**`77.29% Acceptance`**, `1157 Problems Solved`: `312 Easy`, `635 Medium`, `210 Hard`).
- **Heatmap:** 52-week green activity grid (**`474 submissions in past year`**, `332 active days`, `streak 41`).

---

## 🛡️ Cryptographic Architecture

```text
[Plaintext Message]
         │
         ▼
[Web Crypto API: PBKDF2 (SHA-256, 100,000 iter)] ──> [AES-256-GCM Key]
         │
         ▼
[AES-256-GCM Encryption (Unique 96-bit IV)]
         │
         ▼
[Base64 Encrypted Envelope] ──> [WebSocket Transport (/ws)] ──> [Peer Client]
                                                                     │
                                                                     ▼
                                                      [AES-256-GCM Decryption]
                                                                     │
                                                                     ▼
                                                            [Plaintext Display]
```

---

## 📁 Source Code Organization

```text
src/
├── app/
│   ├── layout.tsx                     # Global HTML layout with LeetCode theme
│   ├── globals.css                    # Tailwind CSS custom styles & scrollbars
│   ├── page.tsx                       # Problem Catalog
│   ├── problems/
│   │   ├── page.tsx                   # Problem Catalog route
│   │   └── [id]/page.tsx              # Universal workspace router (1, 7, 1267...)
│   ├── problemset/                    # LeetCode problemset route alias
│   ├── u/[username]/                  # Dynamic user profile page
│   ├── contest/                       # Ephemeral attachment exchange
│   └── api/
│       ├── rooms/direct/              # Instant direct-link join endpoint
│       ├── rooms/                     # Standard room creation endpoint
│       ├── rooms/join/                # Passphrase-validated room join endpoint
│       └── health/                    # System health endpoint
├── components/
│   ├── problem/
│   │   ├── UniversalProblemWorkspace.tsx  # Dual-pane code editor & chat console
│   │   ├── ProblemCatalog.tsx             # Catalog, search, banners, calendar
│   │   └── ProblemWorkspace.tsx           # Legacy problem component
│   ├── profile/
│   │   └── UserProfileView.tsx            # Full LeetCode profile page
│   └── shell/
│       ├── AppShell.tsx               # Wrapper with global modals
│       ├── TopBar.tsx                 # Official LeetCode navigation header
│       └── UsernamePromptModal.tsx    # Initial username setup modal
├── hooks/
│   └── useRealtime.ts                 # Real-time WebSocket hook with heartbeat
├── lib/
│   ├── crypto.ts                      # Client-side AES-256-GCM & PBKDF2
│   ├── problemsData.ts                # LeetCode problem data, testcases, stubs
│   └── utils.ts                       # UI utility functions
├── server/
│   └── roomManager.ts                 # Atomic 2-person room coordination
└── stores/
    ├── roomStore.ts                   # Zustand store for room & chat state
    └── userProfileStore.ts            # Zustand store for user profile metrics
```

---

## ⚙️ Running & Verification

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Build production bundle
npm run build

# Start production server
node server.js
```

Application runs on **Port 3001** (`http://localhost:3001`).

---

## 🌐 Online Reference
- **Production URL:** [Problems - LeetCode](https://leetcodecom.vercel.app/)
