# TITAN --- Antigravity Master Development Prompt

**Product:** TITAN\
**Expansion:** Temporary Instant Trusted Anonymous Network\
**Tagline:** Connect privately. Chat freely. Leave no trace.\
**Document type:** End-to-end product, UI reverse-engineering,
architecture, implementation and verification brief\
**Primary development environment:** Google Antigravity\
**Primary reference skill:** Reverse Engineer Anything (REA), already
installed by the project owner\
**Initial release scope:** One fixed two-person interaction experience,
built around a LeetCode-inspired interface\
**Deployment target:** Vercel

------------------------------------------------------------------------

## 0. Instructions to the AI development agent

You are the lead product engineer, UI reverse engineer, interaction
designer, frontend architect, backend engineer, security engineer and
test engineer for TITAN.

Build the application in the existing Antigravity workspace. Do not
respond with only a plan, mockup, static screenshot or generic starter
template. Inspect the workspace, understand its current state, make an
implementation plan, then build and verify the working application in
small, coherent stages.

The user has explicitly selected one consistent LeetCode-inspired visual
language for the entire product. Do not build separate GitHub and
LeetCode themes. Do not add a theme chooser. Do not create a generic
WhatsApp-style interface. The product should feel like a coding-practice
platform whose special Problem 7 is a two-person private chat
experience.

The initial product is intentionally limited to two known participants.
Do not build public registration, user discovery, a public room
directory, multiple independently creatable rooms, group chats, or a
general-purpose social network in this first release.

Use the installed **Reverse Engineer Anything (REA)** skill to inspect
the current public LeetCode web experience and understand its interface
structure before implementing the UI. Follow the skill's documented
workflow and inspect the real reference rather than relying on memory.
Use the reference to understand layout, density, navigation, problem
workspace, editor, tabs, contest experience, responsive behavior and
visual hierarchy.

Do not copy LeetCode logos, proprietary illustrations, exact branding,
source code, private APIs or protected assets. Create TITAN-owned
branding and original components while closely following the requested
LeetCode-style interaction patterns and visual language. Never use REA
to access private accounts, bypass authentication, scrape private data
or violate website controls.

Do not invent completion. Run the application, inspect the result in a
browser, test the important flows and fix issues before declaring a
milestone complete.

## 1. Product vision and non-negotiable direction

TITAN is a private, two-person communication experience presented inside
a LeetCode-inspired coding workspace.

The product should look and behave like a coding platform first, with
communication integrated naturally into the problem-solving workflow.

The entire application uses one LeetCode-inspired dark interface. Every
page, panel, modal, tab, menu, editor, contest view and chat surface
must belong to the same design system.

The central interaction concept is that Problem 7 is the chat
destination. Selecting Problem 7 opens the two-person conversation
workspace.

The other numbered problems may be shown as visual navigation or future
placeholders, but do not implement unrelated coding problems as if they
were functional product features.

A message sent by Person 1 must arrive for Person 2 as a test-case-style
item. Person 2 can respond to that item, and the response must return to
Person 1 in the same test-case/reply interaction model.

The Contest area is a separate collaboration surface focused on sharing
images and other supported attachments between the same two
participants.

There is one fixed pair of participants in the initial release.
Configure the two identities through safe development configuration or a
first-run pairing flow; do not add public multi-user onboarding.

The product must remain usable on desktop first, while adapting cleanly
to tablet and mobile screens.

The product name and branding are TITAN --- Temporary Instant Trusted
Anonymous Network. The tagline is Connect privately. Chat freely. Leave
no trace.

The words 'SYMBOL', 'Room ID' and 'Secret Key' should be used only where
they are actually needed in the implementation. Do not turn the initial
experience into a multi-room creation product.

The initial experience should take the user directly into the
coding-platform shell and the shared two-person Problem 7 experience
after the configured pair is connected.

Keep the codebase modular so a future version can add more participants,
more problem spaces or more collaboration modes without rewriting the
core messaging layer.

## 2. Scope boundaries for the first release

IN SCOPE: one application URL, one fixed two-person pair, one shared
Problem 7 conversation, LeetCode-inspired workspace UI, test-case-style
message exchange, reply-to-message behavior, contest image sharing,
local saved preferences, real-time delivery, connection status, basic
privacy controls and Vercel deployment.

IN SCOPE: a small set of numbered problem navigation entries to
establish the visual context, with Problem 7 clearly identified as the
active communication feature.

IN SCOPE: a Contest navigation item with an image-sharing and
attachment-sharing experience.

IN SCOPE: text, code snippets, test-case-like structured content, image
attachments and file metadata where safe and feasible.

IN SCOPE: message states such as sending, sent, delivered, failed and
received, with truthful labels based on actual transport
acknowledgements.

IN SCOPE: reconnect behavior, session expiry behavior, empty states,
loading states, error states and responsive layouts.

OUT OF SCOPE: public account registration, social discovery, search for
strangers, public channels, group chat, user-generated room directory,
payment features, advertisements, voice/video calls and a mobile native
application.

OUT OF SCOPE: a full LeetCode judge, code execution sandbox, submissions
to LeetCode, scraping LeetCode problem content or integration with
private LeetCode APIs.

OUT OF SCOPE: a separate GitHub theme or any theme-switching feature.

OUT OF SCOPE: permanent server-side storage of chat messages or shared
images.

Do not expand scope without asking the product owner. If a feature is
not required for the first release, keep its architecture extensible but
do not build it prematurely.

## 3. Mandatory REA reverse-engineering workflow

### Use the installed skill

Before coding the visual shell, locate and invoke the installed Reverse
Engineer Anything skill using the Antigravity skill interface. Read its
instructions and follow its workflow. If the skill is not discoverable,
report that fact and ask the user how to access it; do not pretend it
was used.

### Inspect the public reference

Use the skill to inspect the publicly accessible LeetCode website and
its current interface. Focus on the logged-out or publicly accessible
surfaces that can be inspected without using another person's
credentials.

### Capture reference evidence

Record screenshots or observations for the global navigation, problem
list, problem detail workspace, editor/testcase region, tabs, split
panes, contest page, menus, buttons, typography, colors, spacing and
responsive behavior.

### Create a reference map

Produce a concise internal reference map describing the major regions,
relative widths, heights, alignment, scroll behavior, sticky elements
and interaction patterns.

### Separate reference from product

Map each reference pattern to its TITAN equivalent. Problem 7 becomes
TITAN chat; the contest surface becomes TITAN sharing; unrelated
LeetCode functionality is not copied as a working feature.

### Use original branding

Replace all LeetCode brand marks, wordmarks, logos and proprietary
artwork with TITAN branding. The UI may be LeetCode-inspired, but it
must clearly be TITAN.

### Do not fake inspection

Do not claim pixel-level accuracy without comparing the implementation
against actual inspected reference screenshots.

### Iterate visually

After the first implementation, open TITAN in a browser, compare it with
the REA reference observations and refine spacing, proportions,
hierarchy, colors and interaction behavior.

### Respect technical and legal boundaries

Do not bypass authentication, evade anti-bot controls, extract private
data, call undocumented private APIs or copy proprietary source code.

## 4. Product information architecture

The application shell has a persistent top navigation/header inspired by
the reference platform.

The primary navigation should include a TITAN brand mark, Problems,
Contest, and a compact profile/connection area.

The Problems area should present a numbered problem list or problem
navigation panel.

Problem 7 is the dedicated two-person chat experience. It must be
visually discoverable and clearly named without breaking the
coding-platform aesthetic.

Selecting Problem 7 opens the problem workspace with a left-side
problem/context panel and a right-side interaction panel, adapting to
the inspected reference layout.

The right-side interaction panel is the conversation area. It must feel
native to the coding workspace rather than like an embedded unrelated
messenger.

The Contest area opens an image and attachment sharing experience for
the same two people.

A compact global connection indicator should show whether the other
participant is online, offline, reconnecting or unavailable.

A settings or overflow menu should provide privacy, local preferences,
clear local data and disconnect actions.

Avoid a separate multi-room dashboard. The initial release has one
shared pair conversation and one main Problem 7 destination.

## 5. Global visual design system

### Visual direction

Use the current LeetCode dark interface as the primary visual reference.
The target is a dense, technical, polished coding workspace with dark
neutral surfaces, restrained borders, muted labels, high-contrast text
and a warm orange accent where appropriate.

### Color tokens

Inspect the current reference and derive a consistent TITAN token set.
Start with near-black/dark charcoal backgrounds, slightly lighter panel
surfaces, subtle neutral borders, readable primary text, muted secondary
text, an orange primary accent and clear semantic success/warning/error
colors. Verify contrast rather than choosing colors only by appearance.

### Typography

Use a compact, readable UI sans-serif for navigation and labels, and a
monospace font for code, test-case identifiers and structured payloads.
Establish a consistent scale for page titles, section labels, body text,
metadata and tiny status labels.

### Spacing

Use a deliberate compact spacing system consistent with a professional
coding workspace. Avoid oversized cards, excessive rounded corners, huge
marketing headings or excessive empty space.

### Borders and surfaces

Prefer thin, subtle borders and layered dark surfaces. Use shadows
sparingly. The UI should feel precise and functional, not glossy or
playful.

### Icons

Use Lucide React icons or original SVGs. Keep icon size, stroke weight
and alignment consistent. Do not copy proprietary icon artwork.

### Buttons

Provide clear primary, secondary, ghost and destructive button variants.
Include hover, focus, pressed, disabled and loading states.

### Inputs

Use consistent dark inputs with visible labels, keyboard focus states,
clear errors and accessible hit areas.

### Motion

Use subtle transitions for panel changes, message arrival, tabs and
overlays. Avoid distracting animations or excessive spring effects.

### Responsive behavior

Preserve the coding-workspace identity on desktop. On smaller screens,
convert side panels into drawers or stacked sections while keeping the
Problem 7 chat easy to use.

### Accessibility

Maintain keyboard navigation, visible focus indicators, semantic
landmarks, accessible labels, sufficient contrast and screen-reader
announcements for connection and message status.

## 6. Global application shell

Build a reusable application shell that wraps Problems and Contest
views.

The header should include TITAN branding, primary navigation, a compact
pair connection status and a profile/settings control.

The header must remain visually stable during navigation and should
follow the sticky behavior observed during REA inspection where
appropriate.

Use a central content container with a width and responsive behavior
based on the reference platform.

The shell should avoid a large hero/marketing section after the user
enters the application.

Provide a minimal first-load screen only if the fixed pair needs to be
initialized or a connection needs to be established.

Show a clear but unobtrusive loading state while the app initializes.

If the partner is offline, do not block access to the UI. Show the
offline state and explain whether messages can be queued locally or
cannot be sent.

Do not silently queue messages for later delivery unless that behavior
is explicitly implemented, disclosed and tested.

Use a single source of truth for the active navigation item and active
workspace.

## 7. Problems page and numbered problem navigation

Recreate the overall problem-navigation pattern observed through REA,
using TITAN-owned content and labels.

Show a compact list/table of numbered entries to establish the familiar
coding-platform experience.

Problem 7 must be the primary functional entry and should have a title
such as 'Private Communication' or another product-owner-approved label.

Problem 7 should have a clear selected/active state when open.

Other problem entries may be clearly marked as coming soon or
non-functional placeholders. Do not make them look operational if they
are not implemented.

Do not import LeetCode's proprietary problem statements or reproduce its
full problem catalogue.

Clicking Problem 7 must navigate to the Problem 7 workspace without
reloading the entire application.

Direct navigation to the Problem 7 route should work after refresh.

The active problem number should be reflected in the URL using a stable
route such as /problems/7.

The Problems navigation should preserve the same application shell and
design tokens.

On mobile, problem navigation should collapse into a drawer or compact
selector.

## 8. Problem 7 --- the core chat experience

### Core definition

Problem 7 is the chat feature. It is not a normal coding problem and it
is not a separate messenger website. It is a communication workspace
presented as a problem detail page.

### Layout

Use the reference's problem workspace proportions and panel behavior.
The left region should contain Problem 7's title, short description,
collaboration context and optional instructions. The main/right region
should contain the two-person message and test-case interaction
interface.

### Chat identity

Show the two configured participant identities using safe display names
or aliases. Do not expose sensitive account details.

### Conversation header

Include the Problem 7 title, partner display name, connection state, a
compact menu and a clear indication that this is the shared two-person
space.

### Message timeline

Render messages in chronological order with stable identifiers,
timestamps, sender identity, delivery state and reply relationships.

### Message composer

Provide a compact input area with text entry, code formatting, optional
attachment action and send action. Match the visual density of the
coding platform.

### Keyboard behavior

Enter should send only when the user preference and accessibility
behavior make that clear. Shift+Enter should create a newline. Provide a
visible send button and do not make keyboard-only sending mandatory.

### Message editing

Do not implement editing in the first release unless it can be done
safely and consistently. If omitted, keep the menu free of fake edit
actions.

### Message deletion

Allow local deletion only if it is clearly labeled as local. A sender
cannot erase a message already received and displayed on another device
unless a deliberate deletion protocol is implemented.

### Reply behavior

Allow a participant to reply to a specific incoming test-case-style
message. Show a compact quoted reference to the original item.

### Empty state

When no messages exist, show a concise explanation that Problem 7 is the
shared private conversation. Do not display fake messages.

### Scroll behavior

Keep the latest messages visible when appropriate, but do not forcibly
jump the user to the bottom when they are reading older content.

### Unread state

If unread tracking is implemented, store it locally and make its
limitations clear. Do not create a fake server-side account system just
to show unread counts.

### Connection loss

Show a non-blocking reconnect banner and preserve unsent draft text
locally for the current browser session where practical.

### Message ordering

Use server-assigned sequence numbers or another reliable ordering
strategy within the active session. Do not rely only on client clocks
for cross-device ordering.

## 9. Test-case-style message exchange protocol

### Essential product behavior

Every ordinary chat message sent by Person 1 should be rendered to
Person 2 as a test-case-style card or item. Person 2 should be able to
respond directly to that item. Person 1 receives the response in the
same test-case/reply model. Apply the same symmetric behavior in the
opposite direction.

### Do not confuse presentation with execution

A test-case-style message is a visual and interaction format. It is not
automatically executable code, a real unit test, a code judge submission
or an instruction to run arbitrary code.

### Message model

Represent each message as a typed envelope with a unique message ID,
conversation ID, sender participant ID, message type, encrypted payload,
client-created timestamp, optional reply-to ID, optional attachment
references and delivery metadata.

### Suggested message types

Support text, code, test-case, image-reference, attachment-reference and
system-event message types. Keep the schema extensible.

### Test-case card structure

Each card should show a test-case number or short ID, sender alias,
timestamp, message body, optional code/input/output sections, and a
reply action.

### Text conversion

Plain text from Person 1 should be displayed as the body of a test-case
card for Person 2. Preserve line breaks and text content. Do not
silently reinterpret text as executable code.

### Code conversion

If the sender explicitly selects code mode or uses a code block, display
syntax-highlighted code in the test-case card. Preserve language
metadata when provided.

### Structured case conversion

If the sender chooses a structured test-case composer, allow optional
Input, Expected Output and Notes fields. These are user-authored fields,
not inferred facts.

### Reply model

Person 2's reply should reference the exact originating message ID.
Display the reply as a linked response card in the original thread.

### Symmetry

Person 2 can send a new test-case card to Person 1 using the same
composer. Person 1 can respond to it. No participant should have a
privileged or one-way role.

### Thread grouping

Group a message and its replies into a compact test-case thread. Keep
the chronological conversation timeline understandable.

### Status labels

Use labels such as Pending, Sent, Delivered, Reply received and Failed
only when the transport layer confirms those states.

### Validation

Validate message type, maximum payload size, text length, code length,
attachment metadata and reply references on both client and server.

### Safety

Never execute received code automatically. Never evaluate arbitrary
JavaScript, shell commands or user-submitted snippets in the browser or
backend.

### Rendering safety

Render message content as text or sanitized Markdown. Prevent XSS, HTML
injection, script execution and unsafe links.

### Example flow

Person 1 sends 'Check this edge case: nums = \[0, 0\], target = 0'.
Person 2 sees a test-case card containing that exact text, selects
Reply, and sends an explanation or corrected case. Person 1 sees the
reply attached to the original item.

### Example code flow

Person 1 sends a Python code block. Person 2 receives a code-style
test-case card and can reply with a failing input, expected output or
suggested correction. The application must not run the code.

### Persistence

The server relays encrypted message payloads only during the active
session and does not write them to a permanent message database.
Browser-local caching must be explicit and must not be described as
server-side persistence.

## 10. Problem 7 visual component details

Use a compact problem title row with the number 7, the TITAN chat
feature name and a small status indicator.

Include a description panel that explains the interaction model in
concise product language.

Use tabs only where they add value, such as Description, Conversation
and Details. Conversation should be the default active panel when
Problem 7 is opened.

The message timeline should visually resemble a coding platform's
test-case/results area rather than a consumer messenger bubble layout.

Use sender alignment or sender color markers sparingly so the two
participants remain easy to distinguish.

Use monospace blocks for code and structured test-case values.

Provide copy-to-clipboard for code or test-case text where appropriate.

Provide a reply control on every received message card.

Provide a small composer toolbar for text, code and structured test-case
modes.

Provide a visible connection state in the header, not repeated on every
message.

Avoid unnecessary gradients, oversized avatars, decorative stickers or
consumer-social UI patterns.

Ensure that the main interaction remains comfortable at common laptop
widths and at mobile widths.

## 11. Contest section --- image and attachment sharing

### Purpose

The Contest section is a collaboration and sharing area for the same two
participants. Its initial purpose is to share images and related
materials, not to create public contests or competitive leaderboards.

### Visual direction

Use the same LeetCode-inspired dark visual system, navigation,
typography, spacing, surfaces and accent color as Problems and Problem
7.

### Layout

Use a contest-like workspace with a title/header, compact information
panel, shared activity area and attachment gallery/list. Do not build a
separate visual theme.

### Image sharing

Allow either participant to select an image from their device, preview
it, add an optional caption and send it to the other participant.

### Image preview

Show image thumbnails with filename, size, sender and timestamp. Open a
larger preview in an accessible lightbox or modal.

### Supported formats

Initially support common safe image formats such as JPEG, PNG and WebP.
Reject unsupported formats with a clear error. Do not trust file
extensions alone; validate MIME type and file signatures where possible.

### Size limits

Define a conservative configurable maximum image size and show it before
upload. Compress or resize images client-side only if the user is
informed and image quality is preserved appropriately.

### Other attachments

The architecture may support future PDFs or text files, but do not claim
they work until upload, validation, preview and cleanup are implemented
and tested.

### Caption and replies

Allow an optional caption and a reply/comment to a shared image. Keep
comments in the same temporary message protocol.

### Gallery organization

Show recent shared images in a compact grid or list consistent with the
reference contest workspace. Include a chronological activity view.

### Temporary delivery

Images must be transferred using a temporary transport/storage mechanism
with an explicit expiry. Do not place permanent public image URLs in the
interface.

### No permanent storage

If an object-storage provider is used for temporary transfer, configure
lifecycle deletion and short-lived signed access. Explain that
provider-side deletion timing may not be instantaneous.

### No false promises

Do not claim an image leaves no trace if the recipient can download,
screenshot, photograph or otherwise copy it.

### Offline behavior

If the partner is offline, explain whether the upload is unavailable or
whether a temporary transfer is pending. Do not imply successful
delivery without confirmation.

### Privacy

Avoid exposing uploaded file URLs, credentials or signed tokens in logs,
analytics or client-visible error messages.

## 12. Two-person identity and pairing

The first release is designed for exactly two configured participants.

Do not build a public signup form or public room-creation marketplace.

Provide a safe pairing mechanism appropriate for the first release. The
product owner may configure two participant aliases and pairing
credentials through environment variables or a one-time secure setup
process.

Never hardcode a real secret into source code, client-side bundles,
screenshots or the repository.

Never expose the Secret Key to analytics or application logs.

Use cryptographically secure random values for any generated pairing
secret or session token.

Store only the minimum temporary server-side state needed to
authenticate and route the pair.

Rate-limit failed pairing attempts and room/session creation attempts.

Provide a way to revoke or rotate pairing credentials.

If the user later chooses to use the SYMBOL terminology in the UI, treat
SYMBOL as the room creation/authentication component name. Do not
introduce multiple room creation flows in this first release.

Keep the pairing flow short and visually consistent with the
LeetCode-inspired UI.

## 13. Session and room lifecycle

The initial product has one logical two-person conversation session.

The active session should be created or initialized only after the two
configured participants are authenticated.

Track participant connection state, last activity, active socket
identity and session expiry in temporary memory or ephemeral
coordination storage.

Use a heartbeat or ping/pong mechanism to detect dead connections.

Allow reconnect during a configurable grace period.

Define a clear session expiration policy for inactivity and server
restart.

On expiration, remove temporary room membership, socket routing and any
transient message buffers.

Do not preserve chat history on the server after session expiry.

Do not promise that an in-memory session survives a deployment, server
restart, function cold start or infrastructure failure.

If the selected Vercel architecture uses ephemeral coordination storage,
set explicit TTLs for all keys and test expiry.

Ensure cleanup is idempotent and safe when both participants disconnect
at nearly the same time.

Do not delete a session simply because one participant temporarily loses
connectivity if the reconnect grace period has not elapsed.

Expose session status to the frontend so users understand whether they
are connected, reconnecting, expired or required to re-pair.

## 14. Real-time architecture and Vercel constraints

### Frontend and server

Use Next.js with TypeScript and the App Router. Keep UI components
separate from transport and server logic.

### Vercel deployment

Deploy the web application and supported server functions to Vercel.
Verify current Vercel WebSocket support, function runtime behavior,
duration limits, connection handling, regional behavior and platform
constraints before relying on it.

### Connection routing

Do not assume two WebSocket connections will be handled by the same
serverless function instance. Do not rely on process memory as a
cross-instance room registry.

### Ephemeral coordination

If the Vercel deployment requires cross-instance coordination, use a
small ephemeral Redis-compatible service such as Upstash Redis with TTL
and Pub/Sub. Store routing metadata and presence only, not durable
message history.

### Strict no-shared-store alternative

If the product owner requires literally no shared server-side state, use
a dedicated long-lived WebSocket server on a platform that supports it.
Document that this may be deployed separately from the Vercel frontend.

### Transport protocol

Use secure WebSockets (WSS) in production. Define a typed event protocol
and validate every incoming event.

### Connection authentication

Authenticate the socket using a short-lived, scoped session token. Avoid
putting long-lived secrets in query strings.

### Message routing

Route a message only to the authenticated counterpart in the same active
pair session.

### Acknowledgements

Return a server acknowledgement only after the relay has accepted the
payload. Distinguish accepted, delivered and read states.

### Backpressure

Set message size limits, rate limits and per-connection backpressure
controls. Prevent one participant from flooding the other.

### Reconnect

Use exponential backoff with jitter, a maximum retry policy and clear
user-visible connection states.

### Ordering

Use per-session sequence numbers or another deterministic ordering
mechanism for active-session messages.

### Idempotency

Use unique message IDs so reconnect retries do not create duplicate
visible messages.

### No hidden queue

Do not keep an indefinite server-side offline message queue. If
temporary queuing is implemented, define its TTL and disclose it.

### Observability

Log connection lifecycle metadata and error codes only. Do not log
message bodies, image contents, secrets or encryption keys.

## 15. Technology stack --- implementation choices

### Application framework

Next.js with the App Router. Use the current stable release compatible
with the deployment environment.

### Language

TypeScript with strict mode enabled. Avoid using any unless there is a
documented reason.

### Styling

Tailwind CSS with CSS variables/design tokens for the single
LeetCode-inspired TITAN theme.

### Component library

shadcn/ui where it accelerates accessible primitives. Customize it to
match the reference rather than leaving default component styling.

### Icons

Lucide React.

### Client state

Zustand for UI and conversation state where shared state is required.
Keep server-derived state and local-only preferences distinct.

### Validation

Zod for runtime validation of client forms, WebSocket events and API
payloads.

### Realtime

WebSockets for two-person message relay. Evaluate Vercel's current
connection constraints and use ephemeral coordination where necessary.

### Local persistence

IndexedDB for locally saved display preferences, drafts and optional
local conversation shortcuts. Do not put secrets in unprotected
localStorage.

### Cryptography

Web Crypto API for cryptographic primitives. Prefer an established,
reviewed protocol or library for end-to-end messaging rather than
inventing a custom cryptographic protocol.

### Temporary coordination

Upstash Redis only if needed for ephemeral cross-instance room routing
and presence. Use TTLs and do not store chat history.

### Deployment

Vercel for the Next.js app and supported server functions.

### Repository

GitHub for version control and CI/CD.

### Testing

Vitest or the current project-compatible unit test runner, plus
Playwright for end-to-end browser tests.

### Linting

ESLint and TypeScript checks.

### Formatting

Prettier or the existing workspace formatter.

### Package manager

Respect the existing repository lockfile and package manager. Do not
replace it without a reason.

## 16. Suggested source-code organization

``` text
TITAN/
├── public/
│   ├── brand/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── problems/
│   │   │   ├── page.tsx
│   │   │   └── 7/
│   │   │       └── page.tsx
│   │   ├── contest/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── session/
│   ├── components/
│   │   ├── shell/
│   │   ├── navigation/
│   │   ├── problem/
│   │   ├── chat/
│   │   ├── test-case/
│   │   ├── contest/
│   │   ├── attachments/
│   │   ├── status/
│   │   └── ui/
│   ├── features/
│   │   ├── pairing/
│   │   ├── session/
│   │   ├── messaging/
│   │   ├── test-case-exchange/
│   │   ├── image-sharing/
│   │   └── encryption/
│   ├── server/
│   │   ├── realtime/
│   │   ├── routing/
│   │   ├── validation/
│   │   ├── security/
│   │   └── ephemeral-store/
│   ├── hooks/
│   ├── stores/
│   ├── lib/
│   ├── schemas/
│   ├── types/
│   └── styles/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

Keep components small and purposeful. Do not put all chat logic,
WebSocket logic and rendering logic into one giant page component.

Separate client-only code from server-only code. Add explicit
server-only boundaries for secrets and privileged operations.

Use feature folders for domain logic and shared components for reusable
presentation.

Keep the transport provider replaceable so the app can move from a
Vercel-compatible relay to a dedicated WebSocket service later.

## 17. Data models and event contracts

### Participant

A participant has an opaque participant ID, safe display alias and role
within the fixed pair. Do not store unnecessary personal information.

### Session

A session has an opaque session ID, pair identity, creation time, last
activity, expiry time and participant connection state.

### Message envelope

A message envelope contains message ID, session ID, sender ID, recipient
ID, message type, encrypted payload, sequence number, client timestamp,
optional reply-to ID and attachment metadata.

### Attachment metadata

An attachment reference contains opaque attachment ID, MIME type, byte
size, original filename if needed, expiry timestamp and short-lived
access metadata. Never treat a client-provided filename or MIME type as
trusted.

### Test-case thread

A test-case thread links an originating message to zero or more replies.
The thread ID may be the originating message ID.

### Connection event

Connection events include participant connected, participant
disconnected, reconnecting, session expired and counterpart unavailable.

### Delivery event

Delivery events include accepted, delivered and failed. A read receipt
is optional and must be explicitly implemented.

### Validation

Use Zod schemas shared where possible between client and server.
Validate event type, payload size, identifiers and session membership.

### Versioning

Include a protocol version in the event envelope so future changes can
be introduced without ambiguous parsing.

### No sensitive logs

Never serialize an entire message envelope into logs if it contains
encrypted content, tokens or private attachment URLs.

## 18. End-to-end encryption and privacy requirements

Use HTTPS and WSS for all production communication.

Design for end-to-end encryption so the server relays ciphertext and
cannot read message contents.

Do not invent a cryptographic protocol. Use a reviewed protocol/library
suitable for the browser environment, or clearly scope an initial
audited implementation plan before claiming end-to-end encryption.

Use Web Crypto API primitives only as building blocks under a documented
key agreement and authenticated encryption design.

Use unique nonces/IVs as required by the selected algorithm. Never reuse
an AES-GCM IV with the same key.

Keep private keys and message encryption keys on participant devices
wherever possible.

Do not send encryption secrets to analytics, error reporting, server
logs or URL query parameters.

Authenticate participants separately from encrypting message content.

Use authenticated encryption and verify message integrity before
rendering content.

Provide a clear security explanation in the UI. Do not claim the
application is anonymous, untraceable or impossible to monitor without a
rigorous threat model.

A temporary session and no permanent database do not guarantee that all
traces disappear. Browser caches, screenshots, downloaded files, network
infrastructure, hosting logs and recipient devices may retain
information.

Use a clear privacy notice explaining what is held in memory, what is
stored locally, what temporary providers process and what can remain on
participant devices.

Do not claim 'Leave no trace' as an absolute technical guarantee. Treat
it as brand language and explain the actual limits in product privacy
information.

Provide a local clear-data action that removes the app's locally stored
shortcuts and drafts where technically possible.

Provide a disconnect action that closes the current session and clears
transient in-memory client state where appropriate.

## 19. Local storage and saved state

The first release does not need a permanent server-side database.

Use IndexedDB for local preferences, the selected participant alias,
saved UI state and optional locally stored shortcuts.

Do not store plaintext secret keys in localStorage.

If a reusable credential must be saved, protect it using a suitable
device-local key strategy and explain that browser storage is not
equivalent to hardware-backed secure storage.

Keep local storage schema versioned so future migrations are possible.

Provide a clear-data action and handle quota errors.

Do not store chat history locally by default unless the product owner
explicitly chooses that behavior.

If local chat caching is enabled later, make it opt-in, encrypted where
feasible and deletable by the user.

Do not promise that browser data survives private browsing, browser
profile deletion, device reset or storage eviction.

## 20. Contest image-sharing implementation details

Create a dedicated Contest route that uses the same global shell.

Show a concise header such as 'Contest' and a short description that
this is the shared image and attachment area.

Include an upload button, drag-and-drop target on desktop and file
picker on mobile.

Show upload progress only when actual progress information is available.

Validate file type, size and file signature.

Generate a local preview before sending, and revoke temporary object
URLs when no longer needed.

Encrypt image data client-side before transferring it if the chosen
transport/storage flow supports this correctly.

If using temporary object storage, upload ciphertext, use short-lived
signed URLs and configure automatic lifecycle cleanup.

Do not expose permanent public object URLs.

After successful transfer, notify the other participant through the same
realtime event channel.

The receiver should see a preview card with sender, timestamp, caption
and download/open action.

Provide an accessible image viewer with close, previous/next where
relevant, and keyboard controls.

Handle upload cancellation, failed upload, unsupported format, oversized
file, expired attachment and disconnected partner states.

Do not show an image as delivered until the transfer and recipient
notification have actually succeeded.

Add optional image replies/comments using the same message thread model.

Do not create public contest rankings, leaderboards or registration in
the initial release.

## 21. Interaction details and microcopy

Use concise product language that fits a developer workspace.

Primary navigation labels should be short: Problems and Contest.

The Problem 7 label should communicate that it is the private two-person
communication feature.

Connection statuses should be precise: Connected, Partner offline,
Reconnecting, Session expired or Connection failed.

Avoid vague labels such as 'Magic connected' or 'Invisible mode'.

For an empty Problem 7 conversation, use copy such as 'No test cases
yet. Send the first message to start the conversation.'

For a received message, use a compact 'New test case' label or
equivalent.

For a reply, show 'Reply to case #...' with the original item preview.

For a failed send, show a retry action and retain the unsent draft where
possible.

For an expired session, explain that a new session must be established;
do not imply the old server-side history can be restored.

For Contest with no images, explain that shared images will appear here
after either participant sends one.

For local data deletion, clearly state that this deletes local app data
on this device and does not delete copies already received by the other
participant.

## 22. Responsive and accessibility requirements

Desktop is the primary layout target. Verify common widths such as
1280px, 1440px and 1920px.

Tablet layouts must keep the main workspace readable and allow panels to
collapse.

Mobile layouts must avoid horizontal overflow and keep the message
composer accessible above the on-screen keyboard.

Use drawers or stacked panes for the problem context and chat area on
narrow screens.

Ensure the header navigation collapses cleanly.

Make all interactive controls keyboard accessible.

Use semantic buttons, links, labels, headings, lists and landmarks.

Provide accessible names for icon-only buttons.

Do not rely on color alone to communicate sender identity, delivery
state or errors.

Respect reduced-motion preferences.

Ensure dialogs trap focus appropriately and restore focus when closed.

Announce new incoming messages through an appropriate accessible live
region without overwhelming screen-reader users.

Provide clear validation and upload errors.

## 23. Security and abuse-resistance checklist

Use secure random generation for session IDs, pairing credentials and
message IDs where required.

Use HTTPS/WSS only in production.

Validate authentication and session membership on every server event.

Rate-limit pairing attempts, connection attempts, messages and uploads.

Enforce maximum message size and maximum attachment size.

Prevent cross-session message routing.

Prevent duplicate event processing using message IDs and idempotency
checks.

Sanitize or safely render Markdown and links.

Never execute received code.

Validate image content and do not trust filenames.

Protect signed attachment URLs and expire them.

Do not place secrets in client bundles.

Do not expose secrets in browser console logs.

Do not log message content or decrypted payloads.

Set appropriate Content Security Policy and security headers.

Protect state-changing HTTP endpoints against CSRF where applicable.

Validate origin and connection policy for WebSocket handshakes.

Handle malformed and oversized frames safely.

Do not rely on a hidden frontend control as an authorization boundary.

Document the threat model and known limitations.

## 24. Performance and reliability requirements

Keep the initial application bundle lean. Load code editor or
syntax-highlighting packages only where needed.

Use dynamic imports for heavy image viewers or optional syntax tools.

Avoid rerendering the entire conversation when a single message status
changes.

Virtualize long message timelines only if real usage demonstrates the
need.

Use optimized image previews and sensible thumbnail dimensions.

Clean up WebSocket listeners, timers, object URLs and event
subscriptions on unmount.

Avoid memory leaks when switching between Problems and Contest.

Handle duplicate WebSocket events and reconnect retries idempotently.

Provide a bounded client-side retry strategy.

Do not silently discard a draft when a connection drops.

Use error boundaries for unexpected UI failures.

Show a recoverable error state rather than a blank screen.

Measure basic performance locally and verify the production build.

## 25. Testing plan

### Unit tests

Test message schema validation, test-case card mapping, reply linking,
local storage helpers, session state transitions, theme tokens and
attachment validation.

### Integration tests

Test pairing authentication, socket event validation, message relay,
acknowledgements, reconnect behavior, session expiry and cleanup.

### End-to-end tests

Run two independent browser contexts representing Person 1 and Person 2.
Verify that both connect to the same Problem 7 session.

### Test-case exchange

Send a plain text message from Person 1 and verify Person 2 receives it
as a test-case-style card. Reply from Person 2 and verify Person 1 sees
the linked reply.

### Symmetric exchange

Repeat the same flow with Person 2 initiating the test-case item.

### Code message

Send a code snippet and verify safe syntax display without executing it.

### Image sharing

Send an allowed image in Contest and verify preview, delivery, recipient
visibility, expiry and failure handling.

### Unauthorized access

Verify that a third browser context cannot join the pair using invalid
credentials.

### Session expiry

Verify that expired sessions reject new message delivery and temporary
state is cleaned up.

### Reconnect

Disconnect one browser briefly, reconnect within the grace period and
verify the UI reports the correct state.

### Cross-instance behavior

If deploying multiple Vercel function instances, test routing across
separate instances. Do not assume local development proves production
routing.

### Responsive tests

Verify desktop, tablet and mobile layouts.

### Accessibility tests

Check keyboard navigation, labels, focus states and contrast.

### Security tests

Check XSS payload rendering, oversized messages, invalid file types,
unauthorized event injection and secret leakage.

## 26. Vercel deployment and environment configuration

Create a production-ready Next.js build and deploy through the project's
GitHub repository to Vercel.

Use environment variables for all server-side secrets and provider
credentials.

Create a .env.example containing variable names and safe placeholder
values only.

Never commit .env.local, real API keys, pairing secrets, signing secrets
or private credentials.

Document which variables are required for local development and
production.

Use separate development and production credentials.

Set appropriate deployment regions based on expected participant
geography and provider capabilities.

Verify WebSocket connection behavior in the actual deployed environment.

If using Upstash, configure a dedicated database/Redis instance for
ephemeral coordination only, set TTLs and avoid persistent message
storage.

If the Vercel WebSocket deployment model is unsuitable after testing,
keep the frontend on Vercel and deploy the long-lived WebSocket relay
separately. Document this architecture clearly.

Set up a custom domain only when the product owner provides one.

Verify HTTPS, routing, direct page refresh, environment configuration
and production error handling.

Do not claim the deployment is production-ready until two real
browser/device clients have completed the end-to-end pairing and
messaging test.

## 27. Implementation milestones and acceptance criteria

### Milestone 1 --- Workspace inspection

Inspect the existing project, identify framework/package manager, read
the REA skill, inspect the LeetCode reference and write a reference map.
Acceptance: the agent can explain the intended page layout and has
evidence from the current reference.

### Milestone 2 --- Design foundation

Implement TITAN branding, global shell, tokens, navigation and
responsive layout. Acceptance: all pages share one consistent
LeetCode-inspired visual system.

### Milestone 3 --- Problems navigation

Implement the numbered problem navigation and Problem 7 route.
Acceptance: selecting Problem 7 opens the chat workspace and direct
refresh works.

### Milestone 4 --- Chat UI

Implement message timeline, test-case cards, reply interaction and
composer using mock data only. Acceptance: UI behavior works locally
before realtime integration.

### Milestone 5 --- Two-person realtime

Implement the secure pair session, WebSocket transport, event validation
and message acknowledgements. Acceptance: two independent clients can
exchange messages.

### Milestone 6 --- Test-case exchange

Map messages into test-case-style cards and replies. Acceptance: both
directions work and reply references remain correct.

### Milestone 7 --- Contest sharing

Implement image selection, validation, preview, temporary transfer and
recipient display. Acceptance: both participants can share and receive
images.

### Milestone 8 --- Security and lifecycle

Implement encryption design, session expiry, reconnect, rate limits,
cleanup and privacy explanations. Acceptance: security and lifecycle
tests pass.

### Milestone 9 --- Deployment

Deploy to Vercel and verify production behavior with two clients.
Acceptance: production pairing, messaging, reply and image sharing work
reliably.

### Milestone 10 --- Polish

Compare screenshots with REA observations, fix layout differences,
improve accessibility and resolve bugs. Acceptance: no known critical
visual or functional issues remain.

## 28. Definition of done

The app is recognizably TITAN and uses one LeetCode-inspired theme
throughout.

There is no GitHub theme or theme switcher.

The Problems navigation exists and Problem 7 is the functional
two-person chat destination.

There is no public multi-room creation flow in the initial release.

The two configured participants can connect securely.

Person 1 messages appear to Person 2 as test-case-style cards.

Person 2 can reply to a specific card and Person 1 receives the linked
reply.

Person 2 can initiate the same interaction in the opposite direction.

Code snippets render safely and are never executed automatically.

The Contest section supports validated image sharing between the same
pair.

The UI handles offline, reconnecting, failed, expired and connected
states.

The server does not persist chat history in a permanent database.

Any ephemeral coordination storage has explicit TTLs and does not store
message history.

Local storage behavior is documented and clearable.

The privacy language accurately describes screenshots, device copies,
hosting logs and temporary provider processing limitations.

The production deployment is tested with two separate clients.

The README explains local development, environment variables, deployment
and known limitations.

## 29. Agent working rules

Start by inspecting the existing workspace. Do not overwrite or delete
existing project work without understanding it.

Use the installed Reverse Engineer Anything skill for the LeetCode UI
investigation before designing the final layout.

Keep a short implementation checklist and update it as milestones are
completed.

Build a working vertical slice rather than generating hundreds of
disconnected files.

Prefer reusable components and typed domain models.

Do not add a database because it is convenient. Preserve the
no-permanent-chat-database requirement.

Do not claim that in-memory state is globally shared across serverless
instances.

Do not claim WebSockets work in production until the deployed two-client
test passes.

Do not claim end-to-end encryption until the key exchange, encryption,
authentication and verification flow is implemented and tested.

Do not claim images are permanently deleted from all infrastructure
unless that is verified and contractually supported.

Do not add fake functionality, placeholder buttons that look active,
fake online indicators or simulated delivery states in production.

When a feature cannot be completed because an external service or
credential is missing, implement the safe interface boundary, document
the missing configuration and ask the user for the required input.

Use realistic local mock data only during UI development and clearly
separate it from production behavior.

Run type checks, linting, unit tests and production build after
meaningful implementation stages.

Use browser inspection after UI milestones. Compare screenshots with the
REA reference map.

Keep the owner informed with concise summaries of completed work,
changed files, tests run and blockers.

Do not stop after writing a plan. Continue through implementation unless
blocked by a genuinely missing user decision or credential.

## 30. Required final deliverables from Antigravity

A working Next.js TITAN application in the existing workspace.

A single LeetCode-inspired visual theme with TITAN branding.

A functional Problems navigation and Problem 7 two-person chat
workspace.

A test-case-style message exchange and reply flow for both participants.

A Contest image-sharing workspace using the same design system.

A tested realtime transport and documented deployment architecture.

A privacy and security explanation that avoids absolute 'no trace'
guarantees.

A .env.example file with safe placeholders.

A README with setup, development, deployment, environment configuration
and architecture notes.

A concise REA reference map or design notes file documenting the
inspected public UI patterns.

A test report describing the two-client end-to-end checks and any
remaining limitations.

A final summary listing implemented features, files changed, commands
run, tests passed, deployment status and outstanding blockers.

------------------------------------------------------------------------

## 31. Start execution now

Begin by checking the existing Antigravity workspace and reading the
installed Reverse Engineer Anything skill instructions. Then inspect the
current public LeetCode interface using that skill and produce the
reference map.

After that, implement the TITAN design foundation and the Problem 7
workspace. Build the UI with mock messages first, then connect the two
configured participants through the realtime transport. Implement the
test-case-style message/reply protocol next, followed by the Contest
image-sharing area.

Keep the entire application in one LeetCode-inspired visual system. Do
not create a second theme. Do not add public room creation or multi-user
functionality. The first release is for exactly two people.

Make sensible engineering decisions where details are unspecified, but
do not violate the scope, privacy or deployment constraints in this
document. Ask the owner only when a decision or credential is genuinely
required.

**The product identity is final:**

# TITAN

### Temporary Instant Trusted Anonymous Network

**Connect privately. Chat freely. Leave no trace.**

Build the real application, verify it in the browser, test it with two
independent clients and prepare it for Vercel deployment.
