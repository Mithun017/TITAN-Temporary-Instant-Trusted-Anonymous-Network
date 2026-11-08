const http = require("http");
const { parse } = require("url");
const { WebSocket } = require("ws");

async function runLiveE2ETest(host = "127.0.0.1:3001") {
  console.log(`Starting Live E2E Integration Test against http://${host}...`);

  // 1. Check health
  const healthRes = await fetch(`http://${host}/api/health`);
  const healthData = await healthRes.json();
  console.log("1. Health Check:", healthData);
  if (healthData.status !== "ok") throw new Error("Health check failed");

  // 2. Create room (Participant 1: Alice)
  const createRes = await fetch(`http://${host}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alias: "Alice",
      passphrase: "shared-e2e-secret-key-1234",
    }),
  });
  const createData = await createRes.json();
  console.log("2. Room Created:", {
    roomId: createData.roomId,
    roomCode: createData.roomCode,
    expiresAt: createData.expiresAt,
  });
  if (!createData.roomCode) throw new Error("Room creation failed");

  // 3. Join room (Participant 2: Bob)
  const joinRes = await fetch(`http://${host}/api/rooms/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomCode: createData.roomCode,
      passphrase: "shared-e2e-secret-key-1234",
      alias: "Bob",
    }),
  });
  const joinData = await joinRes.json();
  console.log("3. Bob Joined:", {
    participantId: joinData.participantId,
    slot: joinData.slot,
    participants: joinData.participants?.map((p) => p.alias),
  });
  if (joinData.slot !== 2) throw new Error("Join failed to allocate slot 2");

  // 4. Test 3rd participant rejection (Eve)
  const eveRes = await fetch(`http://${host}/api/rooms/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomCode: createData.roomCode,
      passphrase: "shared-e2e-secret-key-1234",
      alias: "Eve",
    }),
  });
  console.log("4. Third participant rejection status:", eveRes.status);
  if (eveRes.status !== 409) {
    throw new Error(`Expected 409 Room Full for 3rd participant, got ${eveRes.status}`);
  }

  // 5. Connect WebSockets for Alice and Bob
  const aliceWs = new WebSocket(
    `ws://${host}/ws?roomId=${createData.roomId}&participantId=${createData.participantId}`
  );
  const bobWs = new WebSocket(
    `ws://${host}/ws?roomId=${createData.roomId}&participantId=${joinData.participantId}`
  );

  await Promise.all([
    new Promise((resolve) => aliceWs.on("open", resolve)),
    new Promise((resolve) => bobWs.on("open", resolve)),
  ]);
  console.log("5. Both Alice and Bob WebSockets connected.");

  // 6. Test message exchange: Alice sends testcase message -> Bob receives it
  const messagePromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Bob did not receive message in time")), 5000);

    bobWs.on("message", (raw) => {
      const data = JSON.parse(raw.toString());
      if (data.type === "message.receive") {
        clearTimeout(timeout);
        console.log("6. Bob received message envelope:", {
          messageId: data.payload.messageId,
          ciphertext: data.payload.ciphertext,
          senderAlias: data.payload.senderAlias,
          sequence: data.payload.sequenceNumber,
        });
        resolve(data);
      }
    });
  });

  const testMessageId = "msg-e2e-" + Date.now();
  aliceWs.send(
    JSON.stringify({
      version: 1,
      eventId: "evt-1",
      type: "message.send",
      roomId: createData.roomId,
      sentAt: Date.now(),
      senderId: createData.participantId,
      payload: {
        messageId: testMessageId,
        ciphertext: "ENCRYPTED_CIPHERTEXT_SIMULATION==",
        iv: "IV_SIMULATION==",
        messageType: "text",
        senderAlias: "Alice",
      },
    })
  );

  await messagePromise;

  // 7. Test attachment exchange: Bob sends attachment -> Alice receives it
  const attachmentPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Alice did not receive attachment in time")), 5000);

    aliceWs.on("message", (raw) => {
      const data = JSON.parse(raw.toString());
      if (data.type === "attachment.share") {
        clearTimeout(timeout);
        console.log("7. Alice received attachment envelope:", {
          filename: data.payload.filename,
          mimeType: data.payload.mimeType,
          senderAlias: data.payload.senderAlias,
        });
        resolve(data);
      }
    });
  });

  bobWs.send(
    JSON.stringify({
      version: 1,
      eventId: "evt-att-1",
      type: "attachment.share",
      roomId: createData.roomId,
      sentAt: Date.now(),
      senderId: joinData.participantId,
      payload: {
        id: "att-e2e-" + Date.now(),
        filename: "test_diagram.png",
        mimeType: "image/png",
        byteSize: 1024,
        caption: "Trace Diagram",
        ciphertext: "ENCRYPTED_ATTACHMENT_BYTES==",
        iv: "IV_ATT==",
        senderAlias: "Bob",
        expiresAt: createData.expiresAt,
      },
    })
  );

  await attachmentPromise;

  aliceWs.close();
  bobWs.close();

  console.log("ALL LIVE E2E TESTS PASSED SUCCESSFULLY!");
}

if (require.main === module) {
  runLiveE2ETest().catch((err) => {
    console.error("E2E Test Failed:", err);
    process.exit(1);
  });
}

module.exports = { runLiveE2ETest };
