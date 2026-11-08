# TITAN — System Architecture

**Project:** TITAN — Temporary Instant Trusted Anonymous Network  
**Tagline:** Connect privately. Chat freely. Leave no trace.  
**Document:** Architecture and Engineering Specification  
**Version:** 1.0  
**Status:** Implementation baseline  
**Primary product constraint:** One consistent LeetCode-inspired interface; exactly two participants per room in the initial release.

---

## 1. Purpose

TITAN is a temporary, private, two-person communication workspace. It should feel familiar to developers by using a single LeetCode-inspired application shell: dark surfaces, restrained borders, compact navigation, problem-oriented content, editor-like panels, and clear status indicators.

TITAN is not a public social network, a permanent messaging archive, or a multi-person community platform. Its core promise is to let two participants connect, exchange messages and images, and leave the room when finished without creating a permanent server-side chat history.

The architecture prioritizes:

- A simple two-person connection model.
- Fast, real-time message delivery.
- Temporary room and coordination state.
- End-to-end encryption for private message content.
- Local-first handling of drafts and user-selected preferences.
- Explicit lifecycle and expiry behavior.
- A UI that remains visually consistent across every feature.

## 2. Product identity and terminology

**TITAN** means **Temporary Instant Trusted Anonymous Network**.

**Tagline:** “Connect privately. Chat freely. Leave no trace.”

Use these product terms consistently:

| Term | Meaning |
|---|---|
| Room | A temporary communication space for two participants |
| Participant | One of the two people connected to a room |
| Room code | A short, unguessable code or token used to join a room |
| Problem 7 | The primary message-exchange workspace |
| Test case | A message submitted by one participant in the Problem 7 interface |
| Reply | A response linked to a specific test case |
| Contest | The temporary image-sharing and collaborative challenge area |
| Session | The lifetime of a room and its connected participants |
| Presence | Temporary online/away/typing state |
| Attachment | An image or other explicitly supported file shared in a room |

Do not introduce alternate names such as “LinkRoom” in the product UI. TITAN is the product name.

## 3. Non-negotiable product requirements

1. The initial release supports exactly two participants in each room.
2. A third participant must not be admitted to an occupied room.
3. Problem 7 is the central chat experience and must open the actual conversation workspace.
4. Messages should be presented as test cases, with replies associated with the relevant original message.
5. Contest provides temporary image sharing; it is not a separate permanent gallery.
6. Every feature uses the same LeetCode-inspired visual language.
7. There is no theme selector and no second visual theme in the initial release.
8. Server-side message history must not be stored in a permanent database.
9. Room state, presence, typing indicators, and routing metadata must expire.
10. Message content should be end-to-end encrypted before it leaves the sender's device.
11. The product must communicate privacy limitations honestly. “Leave no trace” is a product aspiration, not a guarantee against screenshots, downloads, browser caches, operating-system backups, or infrastructure logs.
12. The system must fail safely when a room expires, a participant disconnects, or a cryptographic key cannot be verified.

## 4. High-level architecture

The system is divided into five layers:

1. **Presentation layer:** Next.js, React, TypeScript, Tailwind CSS, and reusable UI components.
2. **Client application layer:** room state, message composition, encryption, attachment preparation, local drafts, and WebSocket client.
3. **Realtime gateway:** authenticated WebSocket connections, event validation, room membership enforcement, and message relay.
4. **Temporary coordination layer:** Redis with TTL for room membership, presence, rate limits, connection routing, and short-lived attachment metadata.
5. **Deployment and operations layer:** Vercel or an equivalent frontend host, a persistent WebSocket-capable backend, managed Redis, object storage with short-lived lifecycle rules, and privacy-conscious observability.

The relay should handle encrypted payloads without needing to understand message plaintext. Redis is coordination infrastructure, not a message archive.

```text
Participant A browser                         Participant B browser
        |                                               |
        |  UI / local state / Web Crypto                |
        |                                               |
        +---------------- TLS / WebSocket --------------+
                                |
                         Realtime gateway
                                |
                    Room authorization / validation
                                |
                     Temporary Redis coordination
                                |
                    Encrypted payload relay only
                                |
                  Optional short-lived image storage
```

## 5. Recommended technology stack

| Area | Recommended technology | Responsibility |
|---|---|---|
| Web application | Next.js + React | Routing, rendering, application shell |
| Language | TypeScript | Shared types and safer event contracts |
| Styling | Tailwind CSS | Consistent LeetCode-inspired design system |
| Components | Accessible custom components / shadcn primitives | Dialogs, menus, tabs, tooltips |
| Client state | Zustand or React state | Room, connection, and view state |
| Validation | Zod | Validate forms and incoming/outgoing event shapes |
| Realtime | WebSocket | Low-latency event transport |
| Backend | Node.js with Fastify or NestJS | Realtime gateway and HTTP APIs |
| Temporary state | Upstash Redis or managed Redis | TTL-based room coordination |
| Cryptography | Web Crypto API with a reviewed protocol/library | Client-side encryption |
| Local persistence | IndexedDB | Optional local drafts and short-lived encrypted cache |
| Attachment storage | Private object storage with lifecycle expiry | Temporary encrypted image objects |
| Frontend hosting | Vercel | Web app deployment |
| Backend hosting | WebSocket-capable container/platform | Long-lived realtime connections |
| Monitoring | OpenTelemetry-compatible metrics and privacy-safe logs | Availability and performance |

The frontend and realtime backend may be deployed separately. Do not assume a serverless function is suitable for holding long-lived WebSocket connections unless the selected platform explicitly supports that model.

## 6. Application information architecture

The application should resemble a focused coding workspace rather than a conventional chat application.

Suggested primary navigation:

- **Workspace:** room overview and connection state.
- **Problem 7:** the main message exchange.
- **Contest:** temporary image-sharing area.
- **Settings:** limited session and privacy controls.
- **Help / About:** concise explanation of room behavior and privacy limitations.

The navigation must not create separate design systems. Buttons, panels, typography, spacing, borders, icons, and feedback states should be shared.

## 7. LeetCode-inspired UI design system

Use one consistent dark interface inspired by the information hierarchy and density of LeetCode. Do not copy proprietary logos, exact branding, or protected artwork.

### 7.1 Visual principles

- Dark neutral page background.
- Slightly lighter panels and cards.
- Subtle one-pixel borders.
- Clear text hierarchy and restrained accent colors.
- Compact but readable spacing.
- Monospaced type only for code-like identifiers, timestamps, and test-case labels.
- Strong focus states and keyboard accessibility.
- No excessive gradients, glass effects, decorative animations, or unrelated visual themes.

### 7.2 Suggested design tokens

```css
:root {
  --titan-bg: #1a1a1a;
  --titan-panel: #242424;
  --titan-panel-raised: #2b2b2b;
  --titan-border: #3a3a3a;
  --titan-text: #eff1f3;
  --titan-muted: #a1a1aa;
  --titan-accent: #2cbb5d;
  --titan-danger: #ef4444;
  --titan-warning: #eab308;
  --titan-radius: 8px;
}
```

Treat these as initial tokens. Centralize them so the palette can be tuned without rewriting component styles.

### 7.3 Shared components

Build and reuse:

- `AppShell`
- `TopBar`
- `SideNavigation`
- `RoomStatus`
- `ParticipantBadge`
- `Panel`
- `Button`
- `IconButton`
- `Tooltip`
- `Dialog`
- `Toast`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `MessageCard`
- `ReplyThread`
- `AttachmentPreview`
- `ConnectionIndicator`

### 7.4 Responsive behavior

On desktop, use a compact left navigation and a central workspace. On smaller screens, collapse navigation into a drawer or bottom navigation while keeping the same theme and information hierarchy. Message composition and attachment previews must remain usable on touch devices.

## 8. Room creation and joining

A room is a temporary two-person session.

### 8.1 Room creation

1. Participant A selects **Create room**.
2. The client requests a room from the backend over HTTPS.
3. The backend creates a cryptographically random room identifier and a short-lived room record.
4. The backend returns a room code or invite URL and the expiry policy.
5. Participant A connects to the room over WebSocket.
6. Participant A shares the invite with Participant B using an external channel of their choice.

Do not use sequential room IDs. Room identifiers must be generated from a cryptographically secure random source and must be unguessable.

### 8.2 Joining

1. Participant B opens the invite URL or enters the room code.
2. The backend validates the room and its expiry.
3. The backend checks whether a participant slot is available.
4. If the room already has two active participants, reject the join.
5. If admitted, the client establishes its session and performs the key agreement / identity verification flow.
6. Both clients receive updated presence state.

### 8.3 Two-person enforcement

The room membership operation must be atomic. Do not implement capacity checks as separate “read count, then insert” operations, because two simultaneous join requests could both pass.

Use a Redis transaction, Lua script, or another atomic operation to reserve a participant slot. A room has a maximum capacity of two, enforced by the backend rather than by UI logic alone.

## 9. Room and session lifecycle

Suggested room states:

- `CREATING`
- `WAITING_FOR_PARTNER`
- `ACTIVE`
- `RECONNECTING`
- `EXPIRED`
- `CLOSED`

Suggested lifecycle:

```text
CREATE
  |
  v
WAITING_FOR_PARTNER
  |
  | second participant joins
  v
ACTIVE <---- reconnect within grace period
  |
  | participant leaves / TTL reached / owner closes
  v
CLOSED or EXPIRED
```

Define configurable TTL values in one backend configuration module. Example starting policy:

- Waiting room expiry: 10 minutes.
- Active room idle expiry: 30 minutes.
- Disconnect grace period: 60–120 seconds.
- Attachment object expiry: short-lived lifecycle policy, such as 15 minutes, subject to product needs.

These are initial engineering defaults, not promises. The UI must display the actual expiry policy returned by the backend.

When a room expires, invalidate its join capability, remove temporary coordination keys, close active sockets, and make old invite links unusable. Expiry must be enforced server-side even if a client remains open.

## 10. Authentication and participant identity

TITAN should minimize identity collection.

For the initial release, use a room-scoped participant credential rather than requiring a full public profile. The backend issues a short-lived, signed session token after a valid room join.

Requirements:

- Tokens must have short expiry.
- Tokens must be scoped to one room and one participant slot.
- Tokens must not grant access to other rooms.
- Tokens must be revocable when the room closes.
- Do not put secrets in URLs that may be copied into referrer headers or analytics.
- Avoid collecting names, phone numbers, email addresses, or other profile information unless a later product requirement truly needs them.

A display label such as “You” and “Participant 2” is sufficient for the first release.

## 11. End-to-end encryption

Message privacy depends on encrypting content on the clients before transmission.

### 11.1 Security requirement

The backend should relay ciphertext and the minimum metadata needed to route events. It should not receive message plaintext or private encryption keys.

### 11.2 Protocol guidance

Do not invent a cryptographic protocol. Use a reviewed implementation and documented protocol appropriate to the threat model. Use Web Crypto only as a primitive API where appropriate; do not assemble an ad-hoc messaging protocol from primitives without expert review.

A sound design should include:

- Authenticated key agreement.
- Forward secrecy where supported by the chosen protocol.
- Authenticated encryption.
- Unique nonces / correct nonce management.
- Key rotation and session re-establishment behavior.
- Explicit peer-key verification or safety-number comparison.
- Protection against replay and message substitution.
- Secure random number generation.
- Clear handling of key loss and device refresh.

### 11.3 Key verification

Show a verification indicator only when the client has completed the defined verification procedure. If the peer key changes unexpectedly, show a warning and pause sensitive sending until the user verifies or deliberately continues.

### 11.4 Metadata

Encryption does not hide all metadata. The service may still observe connection times, approximate network information, room membership, message sizes, and traffic patterns. Explain this accurately in the privacy notice.

## 12. Problem 7 — primary messaging workspace

Problem 7 is the main communication feature. It should behave like a coding-problem workspace whose test cases are messages.

### 12.1 Layout

Recommended desktop layout:

- Left: problem navigation / room context.
- Center: message timeline presented as test-case cards.
- Right: selected message details or reply thread, where space permits.
- Bottom: message composer.

The exact layout may collapse on mobile, but the same visual language and message semantics must remain.

### 12.2 Message-as-test-case model

Each submitted message becomes a test-case-like item:

- Test case number or short identifier.
- Sender label.
- Message content.
- Local timestamp.
- Delivery / acknowledgement state.
- Reply count.
- Optional attachment preview.
- Optional parent message identifier.

A message must be a normal text message semantically, even if the UI labels it as a test case. Do not execute user content as code.

### 12.3 Reply behavior

Replies must reference the original message ID. A reply should not be represented as an unrelated message with only a visual indentation.

When a participant chooses **Reply**, the composer enters reply mode and displays the parent message excerpt. On send, the event includes `parentMessageId`.

### 12.4 Message states

Suggested client states:

- `COMPOSING`
- `QUEUED`
- `SENDING`
- `SENT_TO_GATEWAY`
- `DELIVERED_TO_PEER`
- `FAILED`
- `RETRYING`

Do not display “Delivered” merely because the backend accepted a packet. Distinguish gateway acknowledgement from peer acknowledgement.

### 12.5 Ordering and duplicate handling

Every message has a client-generated unique ID. The receiving client deduplicates by that ID. The server may assign a room-scoped sequence number for ordering while the room is active. Do not rely only on wall-clock timestamps for ordering.

### 12.6 Editing and deletion

For the initial release, prefer immutable sent messages. If deletion is supported, communicate that deletion cannot erase a screenshot, downloaded file, or plaintext already copied by the recipient. A “delete for everyone” operation must be an explicit protocol event and must not be presented as guaranteed remote erasure.

## 13. Contest — temporary image sharing

Contest is a temporary image-sharing area inside the same room.

### 13.1 Initial scope

- Select an image from the device.
- Preview before sending.
- Validate file type and size.
- Encrypt the image on the client where the selected attachment design supports it.
- Upload encrypted bytes to private, short-lived storage.
- Send the peer an encrypted or protected attachment reference.
- Display the image in the room.
- Expire the stored object according to the configured lifecycle.

### 13.2 Upload flow

1. Client validates the selected file.
2. Client prepares a preview and performs client-side encryption.
3. Client requests a short-lived upload authorization.
4. Backend checks room membership and attachment limits.
5. Client uploads the encrypted object directly to private object storage using a short-lived signed URL.
6. Client sends an attachment event through the WebSocket connection.
7. Peer fetches the encrypted object using a short-lived download authorization and decrypts locally.

### 13.3 Security controls

- Private bucket/container; no public listing.
- Short-lived signed URLs.
- Strict content-size limits.
- MIME type and file-signature checks.
- Random object keys; never use user filenames as storage keys.
- Rate limits and per-room quotas.
- No permanent public CDN URLs.
- Lifecycle expiry and cleanup verification.
- Avoid logging signed URLs or attachment secrets.

### 13.4 Image preview

The UI should show a preview card with sender, timestamp, file size, and loading/error states. Do not automatically download files. Do not create a permanent gallery outside the active room.

## 14. Realtime transport architecture

Use WebSockets for low-latency bidirectional events.

### 14.1 Connection establishment

1. Client requests a short-lived connection credential.
2. Client opens a secure WebSocket connection (`wss://`).
3. Gateway validates the token and room membership.
4. Gateway binds the socket to the authenticated participant slot.
5. Gateway sends a `connection.ready` event.
6. Client begins heartbeat and presence updates.

### 14.2 Gateway responsibilities

- Authenticate the connection.
- Validate room membership and capacity.
- Validate every event against a schema.
- Enforce rate limits and payload limits.
- Relay encrypted message payloads only to the other participant.
- Send acknowledgements.
- Maintain temporary connection routing.
- Close unauthorized, malformed, or expired connections.
- Avoid writing message plaintext to logs or persistent storage.

### 14.3 Reconnection

Use exponential backoff with jitter. On reconnect, the client must re-authenticate and revalidate room state. The server should not promise historical replay if it does not store message history. The client may retain a short-lived local encrypted view, subject to the user’s local-device privacy settings.

### 14.4 Heartbeats

Use ping/pong or application-level heartbeat events. Expire presence when the heartbeat lease expires. Do not treat a stale “online” flag as proof that the participant is connected.

## 15. Event protocol

Use versioned, typed event envelopes. Example:

```ts
type EventEnvelope<TType extends string, TPayload> = {
  version: 1;
  eventId: string;
  type: TType;
  roomId: string;
  sentAt: number;
  payload: TPayload;
};

type EncryptedMessagePayload = {
  messageId: string;
  parentMessageId?: string;
  ciphertext: string;
  nonce?: string;
  cryptoSessionId: string;
};

type SendMessageEvent =
  EventEnvelope<"message.send", EncryptedMessagePayload>;

type MessageAckEvent =
  EventEnvelope<"message.ack", {
    messageId: string;
    status: "accepted" | "rejected";
    roomSequence?: number;
    reason?: string;
  }>;
```

The exact cryptographic payload shape must match the selected encryption protocol. Do not assume that a generic `nonce` field is sufficient for a secure protocol.

Suggested event names:

| Event | Direction | Purpose |
|---|---|---|
| `connection.ready` | Server → client | Connection accepted |
| `room.state` | Server → client | Current room lifecycle state |
| `participant.joined` | Server → client | Peer joined |
| `participant.left` | Server → client | Peer left |
| `presence.update` | Both | Online / away state |
| `typing.start` | Client → server → peer | Typing indicator |
| `typing.stop` | Client → server → peer | Stop typing indicator |
| `message.send` | Client → server | Submit encrypted message |
| `message.ack` | Server → client | Gateway acceptance / rejection |
| `message.delivered` | Server → sender | Peer delivery acknowledgement |
| `message.receive` | Server → peer | Relay encrypted message |
| `message.delete` | Client → server → peer | Optional deletion signal |
| `attachment.create` | Client → server | Request upload authorization |
| `attachment.ready` | Server → client | Upload authorization response |
| `attachment.share` | Client → server → peer | Share attachment reference |
| `room.close` | Client → server | Close room |
| `room.expired` | Server → clients | Room expiry notice |
| `error` | Server → client | Structured failure |

All events must be schema-validated. Reject unknown versions and malformed payloads safely.

## 16. HTTP API outline

HTTP endpoints should be small and focused. Example routes:

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/rooms` | Create a room |
| `POST` | `/api/rooms/join` | Join using invite/code |
| `GET` | `/api/rooms/:roomId` | Read permitted room state |
| `POST` | `/api/rooms/:roomId/connection-token` | Issue short-lived WebSocket credential |
| `POST` | `/api/rooms/:roomId/attachments` | Request upload authorization |
| `POST` | `/api/rooms/:roomId/attachments/:id/complete` | Confirm upload completion |
| `POST` | `/api/rooms/:roomId/close` | Close room |
| `GET` | `/api/health` | Liveness / readiness check |

Do not add a `GET /messages` history endpoint if the product requirement is no server-side message history. Do not create a permanent messages table.

## 17. Temporary Redis data model

Redis stores coordination state with mandatory expiry. Example logical keys:

```text
titan:room:{roomId}                 -> room state, TTL
titan:room:{roomId}:members         -> two participant slots, TTL
titan:room:{roomId}:presence        -> presence leases, TTL
titan:room:{roomId}:connections     -> gateway routing metadata, TTL
titan:room:{roomId}:sequence        -> active-room sequence counter, TTL
titan:rate:{scope}:{subject}        -> rate-limit counters, TTL
titan:attachment:{attachmentId}    -> short-lived attachment metadata, TTL
```

Rules:

- Every room-scoped key must have an expiry.
- Refresh TTL only when policy allows.
- Do not store plaintext message bodies.
- Do not use Redis persistence as a hidden chat archive.
- Configure backups and persistence deliberately; if the privacy model requires volatile-only coordination, select and verify the appropriate Redis configuration.
- Do not assume TTL alone guarantees immediate physical deletion from backups or provider infrastructure. State the provider's actual retention behavior in the privacy documentation.

## 18. Local browser storage

IndexedDB may be used for local drafts, UI preferences, and a limited encrypted cache.

Rules:

- Store encrypted message material only where feasible.
- Do not store room secrets in `localStorage`.
- Clear room-scoped local data when the user leaves or the room expires, subject to explicit product behavior.
- Handle multiple tabs and stale sessions.
- Explain that clearing application storage cannot remove screenshots, exports, browser-level backups, or data copied elsewhere.
- Keep local retention short and configurable.

## 19. Privacy and data-retention policy

The privacy model must be precise and testable.

### 19.1 Data minimization

Collect only what is needed to create the room, authorize the two participants, relay encrypted traffic, enforce abuse controls, and operate the service.

### 19.2 No permanent chat archive

The backend must not persist message plaintext or build a permanent message-history database. Encrypted payloads should be relayed in memory and discarded after delivery or a very short retry window, if such a window is explicitly implemented.

### 19.3 Operational metadata

Some operational metadata may exist temporarily: room IDs, connection state, timestamps, rate-limit counters, and attachment references. Set TTLs and document the exact categories.

### 19.4 Logs

Never log plaintext message content, encryption keys, access tokens, signed attachment URLs, or full invite secrets. Use redacted structured logs. Restrict access to operational logs and define their retention period.

### 19.5 Honest privacy language

Do not claim “zero data,” “impossible to trace,” or guaranteed erasure. A more accurate statement is: “TITAN is designed not to retain a permanent server-side chat history. Temporary operational data expires according to the session policy. Recipients can still capture or copy content, and network or infrastructure metadata may be processed.”

## 20. Security threat model

Threats to consider:

- Room-code guessing or enumeration.
- Unauthorized third participant joining.
- Stolen or replayed session token.
- WebSocket event spoofing.
- Cross-room message delivery.
- Replay or duplicate message submission.
- Malicious attachment or oversized upload.
- XSS and malicious user content.
- CSRF on HTTP endpoints.
- Rate-limit bypass.
- Redis key leakage.
- Signed URL leakage.
- Peer key substitution / man-in-the-middle.
- Browser extension or compromised endpoint access.
- Denial of service through connection or message floods.

Mitigations:

- High-entropy room identifiers.
- Atomic two-slot membership enforcement.
- Short-lived room-scoped tokens.
- TLS everywhere.
- Strict origin checks for WebSockets.
- Schema validation and output encoding.
- CSP and secure frontend headers.
- Per-room and per-IP rate limits, with privacy-conscious handling.
- Payload and attachment size caps.
- Idempotency and replay protection.
- Reviewed E2EE protocol and peer verification.
- Least-privilege Redis and object-storage credentials.
- Dependency scanning and security updates.
- Abuse reporting / room termination controls where appropriate.

## 21. Backend module boundaries

Suggested backend modules:

```text
backend/
  src/
    app.ts
    config/
      env.ts
      limits.ts
      retention.ts
    http/
      routes/
        health.routes.ts
        room.routes.ts
        attachment.routes.ts
    realtime/
      websocket.server.ts
      connection.manager.ts
      event.router.ts
      event.schemas.ts
    rooms/
      room.service.ts
      room.repository.ts
      room.lifecycle.ts
      room.capacity.ts
    participants/
      participant.service.ts
      participant.tokens.ts
    messaging/
      message.relay.ts
      message.acknowledgements.ts
    attachments/
      attachment.service.ts
      object-storage.ts
    security/
      rate-limiter.ts
      origin-check.ts
      audit-redaction.ts
    infrastructure/
      redis.client.ts
      logger.ts
    tests/
```

Keep business rules out of route handlers. Room capacity and expiry rules belong in the room domain/service layer and must be covered by tests.

## 22. Frontend module boundaries

Suggested frontend structure:

```text
frontend/
  app/
    page.tsx
    create/
      page.tsx
    join/
      page.tsx
    room/
      [roomId]/
        layout.tsx
        page.tsx
        problem-7/
          page.tsx
        contest/
          page.tsx
        settings/
          page.tsx
  components/
    layout/
    navigation/
    room/
    problem-seven/
    contest/
    messaging/
    attachments/
    feedback/
    ui/
  features/
    room/
    participant/
    realtime/
    messaging/
    encryption/
    attachments/
    presence/
  hooks/
  lib/
    api/
    crypto/
    validation/
    formatting/
  stores/
  styles/
  types/
  tests/
```

Keep UI components presentational where possible. Put network and cryptographic behavior in dedicated feature modules, not inside large page components.

## 23. Suggested repository structure

A monorepo is recommended for shared event contracts and coordinated releases:

```text
titan/
  apps/
    web/
    realtime-api/
  packages/
    contracts/
    ui/
    config/
  docs/
    ARCHITECTURE.md
    SECURITY.md
    PRIVACY.md
    DEPLOYMENT.md
    INCIDENT-RESPONSE.md
  infrastructure/
    redis/
    hosting/
    storage/
  scripts/
  .github/
    workflows/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  README.md
```

The `contracts` package should contain versioned event types and validation schemas shared by frontend and backend. Do not share server secrets or privileged backend modules with the browser bundle.

## 24. Error handling and user feedback

Use predictable, user-safe errors.

Examples:

| Code | Meaning | UI behavior |
|---|---|---|
| `ROOM_NOT_FOUND` | Room does not exist | Explain that the invite may be invalid |
| `ROOM_EXPIRED` | Room expired | Show expiry screen and disable sending |
| `ROOM_FULL` | Two slots are occupied | Explain that only two participants are allowed |
| `UNAUTHORIZED` | Token invalid or expired | Ask the user to rejoin |
| `PEER_DISCONNECTED` | Peer connection lost | Show reconnecting / offline state |
| `MESSAGE_TOO_LARGE` | Message exceeds limit | Keep draft and show size guidance |
| `ATTACHMENT_REJECTED` | File invalid or too large | Explain supported limits |
| `RATE_LIMITED` | Too many requests | Show retry guidance |
| `CRYPTO_VERIFICATION_REQUIRED` | Peer key needs verification | Pause sensitive sending and show verification flow |
| `INTERNAL_ERROR` | Unexpected server failure | Show a generic error and safe retry option |

Never expose stack traces, internal hostnames, Redis keys, tokens, or secrets to the browser.

## 25. Performance and scalability

The two-person model keeps room fan-out simple: each accepted message is relayed to at most one peer.

Performance priorities:

- Keep WebSocket payloads small.
- Upload images directly to object storage rather than through the realtime gateway.
- Use Redis only for short-lived coordination.
- Avoid unnecessary polling.
- Batch UI updates where appropriate.
- Lazy-load nonessential screens and image previews.
- Apply message and attachment limits.
- Use backpressure and bounded queues for slow clients.
- Close stale connections and expired rooms.

If the backend runs multiple instances, use shared Redis coordination and a deliberate cross-instance message-routing strategy. A process-local map alone is not sufficient for multi-instance deployment.

## 26. Deployment architecture

Recommended deployment topology:

- Next.js frontend on Vercel.
- Realtime API on a platform that supports persistent WebSocket connections.
- Managed Redis / Upstash for temporary coordination.
- Private object storage for encrypted attachments.
- DNS and TLS configured for all public endpoints.

Example environment variables:

```text
# Frontend
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_WS_URL=

# Backend
NODE_ENV=
PORT=
ALLOWED_ORIGINS=
REDIS_URL=
ROOM_TTL_SECONDS=
WAITING_ROOM_TTL_SECONDS=
DISCONNECT_GRACE_SECONDS=
MAX_ROOM_PARTICIPANTS=2
MAX_MESSAGE_BYTES=
MAX_ATTACHMENT_BYTES=
OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_ACCESS_KEY=
OBJECT_STORAGE_SECRET_KEY=
```

Never prefix secrets with `NEXT_PUBLIC_`. Keep production secrets in the hosting provider's secret manager. Use separate credentials and resources for development, staging, and production.

## 27. CI/CD and engineering quality

Every pull request should run:

1. Formatting.
2. Linting.
3. Type checking.
4. Unit tests.
5. Contract/schema tests.
6. Frontend production build.
7. Backend production build.
8. Dependency and secret scanning.

Deployment should promote a tested build. Use environment-specific configuration and a rollback procedure. Do not run destructive data migrations because the architecture intentionally avoids a permanent message database; infrastructure changes still require review.

## 28. Testing strategy

### 28.1 Unit tests

Test room capacity, room expiry, token scope, event validation, message deduplication, rate limits, and attachment policy.

### 28.2 Integration tests

Test room creation, two-person join, third-person rejection, WebSocket authentication, message relay, acknowledgement, disconnect, reconnect, room close, and expiry.

### 28.3 End-to-end tests

Use two independent browser contexts:

- Participant A creates a room.
- Participant B joins.
- Both see the active state.
- A sends a Problem 7 test case.
- B receives it and replies to the correct parent.
- A receives the reply.
- Both share an image through Contest.
- A third browser is rejected.
- Expired rooms cannot be reopened.
- Refresh and reconnect behavior matches the documented policy.

### 28.4 Security tests

Test room-code entropy assumptions, token replay, cross-room access, malformed events, oversized payloads, XSS payload rendering, attachment MIME spoofing, signed URL expiry, and peer-key change warnings.

### 28.5 Privacy tests

Assert that message plaintext and encryption keys never appear in backend logs, Redis values, analytics events, or object metadata. Verify TTL configuration and attachment lifecycle behavior.

## 29. Observability and operations

Collect operational metrics without collecting message content.

Useful metrics:

- Active WebSocket connections.
- Active rooms.
- Room creation and join success rates.
- Third-participant rejection count.
- WebSocket disconnect and reconnect rates.
- Message relay latency.
- Delivery acknowledgement latency.
- Attachment upload failure rate.
- Expired room cleanup count.
- Redis latency and error rate.
- Rate-limit events.

Logs should contain correlation IDs and safe event categories, not plaintext payloads or credentials. Define alert thresholds for gateway availability, Redis failures, elevated reconnect rates, and attachment-service errors.

## 30. Accessibility and usability

- All actions must be keyboard accessible.
- Provide visible focus states.
- Use semantic buttons and form controls.
- Announce connection and delivery changes to assistive technology without flooding the screen reader.
- Do not communicate status using color alone.
- Provide accessible labels for icon-only controls.
- Respect reduced-motion preferences.
- Maintain readable contrast in the dark theme.
- Ensure the message composer works with keyboard-only and touch input.

## 31. Implementation roadmap

### Phase 1 — Foundation

- Create monorepo and shared TypeScript configuration.
- Build the LeetCode-inspired design tokens and AppShell.
- Implement create-room and join-room screens.
- Add backend room lifecycle and atomic two-person capacity enforcement.
- Add temporary Redis coordination and TTL tests.

**Exit criteria:** Two users can join the same room; a third user is rejected; expired rooms cannot be joined.

### Phase 2 — Realtime core

- Implement authenticated WebSocket connections.
- Add event contracts and validation.
- Add presence, heartbeat, and reconnect behavior.
- Implement encrypted-payload relay and acknowledgements.

**Exit criteria:** Two clients can exchange test messages in real time without server-side message history.

### Phase 3 — Problem 7

- Build test-case message cards.
- Implement message composer.
- Add parent-linked replies.
- Add ordering, deduplication, delivery states, and failure recovery.

**Exit criteria:** Both participants can exchange messages and reply to the correct message.

### Phase 4 — Security and encryption

- Integrate a reviewed E2EE protocol/library.
- Implement peer verification UX.
- Add key/session lifecycle handling.
- Add security and privacy tests.

**Exit criteria:** Plaintext is not sent to or stored by the backend; verification and key-change behavior are tested.

### Phase 5 — Contest attachments

- Build image selection and preview.
- Add encrypted upload and short-lived object storage.
- Add attachment sharing events and expiry.
- Add size/type validation and abuse controls.

**Exit criteria:** Both participants can view a shared image during the active room; the object expires according to policy.

### Phase 6 — Production readiness

- Add rate limits and security headers.
- Configure observability and alerting.
- Complete cross-browser and responsive tests.
- Verify deployment, rollback, TTL cleanup, and privacy documentation.

**Exit criteria:** Production deployment meets the definition of done below.

## 32. Definition of done

The initial TITAN release is complete only when all of the following are true:

- [ ] Product name and tagline are used consistently.
- [ ] One LeetCode-inspired dark UI is used throughout.
- [ ] No theme switcher or unrelated alternate theme is present.
- [ ] A room admits exactly two participants.
- [ ] Room capacity is enforced atomically on the backend.
- [ ] Room codes are unguessable and short-lived.
- [ ] Problem 7 opens the primary messaging workspace.
- [ ] Messages render as test-case cards.
- [ ] Replies are linked to their parent message IDs.
- [ ] Message delivery states are accurate.
- [ ] WebSocket connections are authenticated and validated.
- [ ] Reconnection and expiry behavior are tested.
- [ ] Message content is encrypted client-side using a reviewed protocol.
- [ ] Peer verification and key-change warnings are implemented.
- [ ] No permanent server-side chat history exists.
- [ ] Redis coordination keys have explicit TTLs.
- [ ] Contest supports temporary image sharing.
- [ ] Attachment storage is private and expires.
- [ ] Plaintext, keys, tokens, and signed URLs are excluded from logs.
- [ ] Rate limits, payload limits, and security headers are configured.
- [ ] Privacy language accurately describes metadata and recipient-side risks.
- [ ] Unit, integration, end-to-end, security, and privacy tests pass.
- [ ] Production deployment and rollback procedures are documented.

## 33. Architecture decision records

Record significant decisions in `docs/adr/` using a short template:

```text
# ADR-0001: Decision title

Status: Proposed | Accepted | Superseded

## Context
What problem are we solving?

## Decision
What are we choosing?

## Alternatives
What alternatives were considered?

## Consequences
What becomes easier, harder, or more constrained?
```

Initial decisions to record:

- ADR-0001: Exactly two participants per room in v1.
- ADR-0002: No permanent server-side message history.
- ADR-0003: Redis used for temporary coordination only.
- ADR-0004: WebSocket transport for realtime communication.
- ADR-0005: Reviewed E2EE protocol rather than custom cryptography.
- ADR-0006: Private object storage with short-lived attachment lifecycle.
- ADR-0007: One LeetCode-inspired UI system.
- ADR-0008: Problem 7 as the primary message workspace and Contest as the image-sharing area.

## 34. Engineering rules

1. Do not weaken two-person room enforcement for UI convenience.
2. Do not add a permanent message database.
3. Do not store plaintext messages in Redis, logs, analytics, or object metadata.
4. Do not implement custom cryptography.
5. Do not expose backend secrets to the frontend.
6. Do not trust client-side room-capacity checks.
7. Do not treat a gateway acknowledgement as peer delivery.
8. Do not use unbounded in-memory queues.
9. Do not use public attachment buckets.
10. Do not claim that screenshots or recipient copies can be prevented.
11. Do not introduce a second UI theme.
12. Keep event contracts versioned and validated.
13. Keep TTL and retention policy centralized and tested.
14. Prefer small modules with explicit responsibilities over large page or server files.
15. Document any change that affects the privacy promise or room lifecycle.

## 35. Final architecture principle

TITAN should be built as a **temporary, two-person, end-to-end encrypted communication workspace**, not as a conventional messaging platform with a hidden permanent archive.

The product experience is centered on Problem 7, where messages behave like test cases and replies remain attached to their parent messages. Contest provides temporary image sharing. The entire interface uses one consistent LeetCode-inspired visual system.

The backend coordinates rooms, verifies membership, routes ciphertext, enforces limits, and expires temporary state. It should not become the owner of users' conversations.

**TITAN — Connect privately. Chat freely. Leave no trace.**