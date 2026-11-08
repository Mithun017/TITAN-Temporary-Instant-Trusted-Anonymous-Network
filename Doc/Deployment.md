# TITAN — Production Deployment Guide

**Product:** TITAN — Temporary Instant Trusted Anonymous Network  
**Tagline:** Connect privately. Chat freely. Leave no trace.  
**Version:** 1.0  

---

## 1. Overview of Deployment Topologies

TITAN combines a modern Next.js frontend with an ephemeral WebSocket relay backend that requires long-lived stateful connections.

Depending on your infrastructure preferences, TITAN supports two deployment models:

### Model A: Unified Standalone Container (Recommended)
Both the Next.js web application and the WebSocket server run inside a single long-lived Node.js container using `server.js`.
- **Platforms:** Railway, Render, Fly.io, DigitalOcean App Platform, AWS ECS, or standard Docker VPS.
- **Port:** Single HTTP/WS port (e.g., `3001` or `8080`).
- **Complexity:** Low — zero decoupled services required.

### Model B: Decoupled Vercel + Realtime Relay
The Next.js App Router frontend is deployed to Vercel, while the WebSocket relay (`server.js` or standalone WS service) is deployed to a WebSocket-friendly container platform.
- **Frontend:** Vercel (Next.js serverless).
- **Backend:** Node.js WebSocket service on Railway/Render.
- **Coordination:** In-memory or optional Upstash Redis for multi-instance routing.
- **Configuration:** Set `NEXT_PUBLIC_WS_URL=wss://relay.yourdomain.com/ws` in the Vercel dashboard.

---

## 2. Environment Variables

Create your production environment file based on `.env.example`:

| Variable | Required | Default | Purpose |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | Yes | `production` | Node environment runtime |
| `PORT` | Yes | `3001` | HTTP and WebSocket server listening port |
| `NEXT_PUBLIC_APP_URL` | Optional | `http://localhost:3001` | Canonical frontend domain |
| `NEXT_PUBLIC_WS_URL` | Optional | `ws://localhost:3001` | Public WebSocket endpoint (`wss://...` in production) |
| `ROOM_TTL_SECONDS` | No | `1800` | Session lifetime (30 minutes) |
| `WAITING_ROOM_TTL_SECONDS` | No | `600` | Expiry for unoccupied rooms (10 minutes) |
| `MAX_ROOM_PARTICIPANTS` | No | `2` | Strict two-participant room limit |
| `MAX_MESSAGE_BYTES` | No | `65536` | Max message payload size (64 KB) |
| `MAX_ATTACHMENT_BYTES` | No | `5242880` | Max attachment size (5 MB) |
| `REDIS_URL` | Optional | `undefined` | Ephemeral coordination URL (Upstash Redis) |

> [!WARNING]
> Never prefix private credentials or server secrets with `NEXT_PUBLIC_`. All message payloads are encrypted client-side using Web Crypto, so the server never handles plaintext encryption keys.

---

## 3. Docker Deployment

A minimal `Dockerfile` for container deployment:

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/src/server ./src/server

EXPOSE 3001
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t titan-app .
docker run -p 3001:3001 -e NODE_ENV=production titan-app
```

---

## 4. Deploying to Vercel + Persistent WebSocket Relay

1. **Deploy Frontend to Vercel:**
   - Import the repository into Vercel.
   - Set Root Directory to `Code`.
   - Add environment variable: `NEXT_PUBLIC_WS_URL=wss://your-ws-relay.railway.app`.
   - Deploy.

2. **Deploy WebSocket Relay to Railway / Render:**
   - Deploy the same repo to Railway or Render.
   - Build command: `npm install && npm run build`.
   - Start command: `node server.js`.
   - Copy the generated public domain (e.g. `https://your-ws-relay.railway.app`) and configure it as `NEXT_PUBLIC_WS_URL` in Vercel.

---

## 5. Security & TLS Checklist

- [x] Enforce `https://` and `wss://` on all production domains.
- [x] Verify that CORS/Origin header matches the frontend domain.
- [x] Verify atomic 2-participant limit is active (`MAX_ROOM_PARTICIPANTS=2`).
- [x] Verify that room sessions purge automatically upon TTL expiration.
- [x] Confirm that no database connection strings or message storage tables are configured.

