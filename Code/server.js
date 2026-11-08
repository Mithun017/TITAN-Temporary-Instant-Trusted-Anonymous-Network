const http = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");

const fs = require("fs");
const path = require("path");

const hasBuild = fs.existsSync(path.join(__dirname, ".next", "BUILD_ID"));
const dev = process.env.NODE_ENV === "development" || (!hasBuild && process.env.NODE_ENV !== "production");
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3001", 10);

if (!global.__titan_rooms) {
  global.__titan_rooms = new Map();
}
if (!global.__titan_code_index) {
  global.__titan_code_index = new Map();
}

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("HTTP Request Error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  // Attach WebSocket Server
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const { pathname, query } = parse(req.url, true);

    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req, query);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws, req, query) => {
    const roomId = query?.roomId || "problem-7";
    const participantId = query?.participantId || `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const username = query?.username || "Anonymous";

    const rooms = global.__titan_rooms;
    if (!rooms) {
      ws.close(4004, "Server State Not Initialized");
      return;
    }

    let session = rooms.get(roomId);
    if (!session) {
      session = {
        room: {
          roomId,
          roomCode: roomId.toUpperCase(),
          salt: "leetcode-channel-salt-v1",
          createdAt: Date.now(),
          expiresAt: Date.now() + 86400000 * 365,
          status: "ACTIVE",
          participants: [],
          maxParticipants: 10000,
        },
        passphraseHash: "open-channel-hash",
        sockets: new Map(),
        sequence: 0,
      };
      rooms.set(roomId, session);
    }

    // Register active participant
    let participant = session.room.participants.find((p) => p.id === participantId);
    if (!participant) {
      participant = {
        id: participantId,
        alias: username,
        slot: session.room.participants.length + 1,
        isConnected: true,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      };
      session.room.participants.push(participant);
    } else {
      participant.alias = username;
      participant.isConnected = true;
      participant.lastActiveAt = Date.now();
    }

    session.sockets.set(participantId, ws);

    // Send connection.ready
    ws.send(
      JSON.stringify({
        version: 1,
        eventId: "ready-" + Date.now(),
        type: "connection.ready",
        roomId,
        sentAt: Date.now(),
        payload: { participantId, slot: participant.slot, username },
      })
    );

    // Broadcast room.state to all connected participants in this room
    const statePayload = {
      version: 1,
      eventId: "state-" + Date.now(),
      type: "room.state",
      roomId,
      sentAt: Date.now(),
      payload: {
        status: session.room.status,
        participants: session.room.participants,
      },
    };

    for (const [pId, sock] of session.sockets.entries()) {
      if (sock.readyState === 1) {
        sock.send(JSON.stringify(statePayload));
      }
    }

    // Notify peer that a participant joined
    for (const [pId, sock] of session.sockets.entries()) {
      if (pId !== participantId && sock.readyState === 1) {
        sock.send(
          JSON.stringify({
            version: 1,
            eventId: "join-" + Date.now(),
            type: "participant.joined",
            roomId,
            sentAt: Date.now(),
            senderId: participantId,
            payload: participant,
          })
        );
      }
    }

    // Handle incoming frames
    ws.on("message", (raw) => {
      try {
        const text = raw.toString();
        const data = JSON.parse(text);

        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          return;
        }

        // Validate basic event shape
        if (!data.type || data.roomId !== roomId) return;

        participant.lastActiveAt = Date.now();

        switch (data.type) {
          case "message.send": {
            session.sequence += 1;
            const seq = session.sequence;

            // Acknowledge receipt to sender
            ws.send(
              JSON.stringify({
                version: 1,
                eventId: "ack-" + Date.now(),
                type: "message.ack",
                roomId,
                sentAt: Date.now(),
                payload: {
                  messageId: data.payload.messageId,
                  roomSequence: seq,
                  status: "accepted",
                },
              })
            );

            // Forward ciphertext payload ONLY to peer (never decrypt or log content!)
            for (const [pId, sock] of session.sockets.entries()) {
              if (pId !== participantId && sock.readyState === 1) {
                sock.send(
                  JSON.stringify({
                    version: 1,
                    eventId: data.eventId,
                    type: "message.receive",
                    roomId,
                    sentAt: data.sentAt || Date.now(),
                    senderId: participantId,
                    payload: {
                      ...data.payload,
                      senderAlias: participant.alias || username || "Peer",
                      sequenceNumber: seq,
                    },
                  })
                );
              }
            }
            break;
          }

          case "message.delivered": {
            for (const [pId, sock] of session.sockets.entries()) {
              if (pId !== participantId && sock.readyState === 1) {
                sock.send(JSON.stringify(data));
              }
            }
            break;
          }

          case "attachment.share": {
            for (const [pId, sock] of session.sockets.entries()) {
              if (pId !== participantId && sock.readyState === 1) {
                sock.send(JSON.stringify(data));
              }
            }
            break;
          }

          case "typing.start":
          case "typing.stop": {
            for (const [pId, sock] of session.sockets.entries()) {
              if (pId !== participantId && sock.readyState === 1) {
                sock.send(JSON.stringify(data));
              }
            }
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error("WebSocket Message Relay Error:", err);
      }
    });

    ws.on("close", () => {
      session.sockets.delete(participantId);
      participant.isConnected = false;

      // Broadcast participant.left to peer
      for (const [pId, sock] of session.sockets.entries()) {
        if (sock.readyState === 1) {
          sock.send(
            JSON.stringify({
              version: 1,
              eventId: "left-" + Date.now(),
              type: "participant.left",
              roomId,
              sentAt: Date.now(),
              senderId: participantId,
              payload: { participantId },
            })
          );
        }
      }
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> Environment: production (port ${port})`);
  });
});
