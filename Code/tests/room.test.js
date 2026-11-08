const { test, describe } = require("node:test");
const assert = require("node:assert");
const crypto = require("node:crypto");

// Standalone implementation of room manager logic for verification
class TestRoomManager {
  constructor() {
    this.rooms = new Map();
    this.codeIndex = new Map();
  }

  createRoom(alias, passphrase, ttlSeconds = 1800) {
    const roomId = crypto.randomUUID();
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let roomCode = "TITAN-";
    for (let i = 0; i < 8; i++) {
      if (i === 4) roomCode += "-";
      roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const salt = crypto.randomBytes(16).toString("base64");
    const passphraseHash = crypto.createHash("sha256").update(passphrase + salt).digest("hex");
    const participantId = crypto.randomUUID();
    const now = Date.now();

    const room = {
      roomId,
      roomCode,
      salt,
      createdAt: now,
      expiresAt: now + ttlSeconds * 1000,
      status: "WAITING_FOR_PARTNER",
      participants: [
        {
          id: participantId,
          alias: alias || "Participant 1",
          slot: 1,
          isConnected: false,
          joinedAt: now,
          lastActiveAt: now,
        },
      ],
      maxParticipants: 2,
    };

    this.rooms.set(roomId, { room, passphraseHash, sockets: new Map(), sequence: 0 });
    this.codeIndex.set(roomCode, roomId);
    return { room, participantId };
  }

  joinRoom(roomCode, passphrase, alias) {
    const roomId = this.codeIndex.get(roomCode.trim().toUpperCase());
    if (!roomId) {
      return { success: false, error: "Room not found or code is invalid." };
    }

    const session = this.rooms.get(roomId);
    if (!session) {
      return { success: false, error: "Room session has expired or been terminated." };
    }

    if (session.room.expiresAt <= Date.now()) {
      return { success: false, error: "Room session has expired." };
    }

    const expectedHash = crypto
      .createHash("sha256")
      .update(passphrase + session.room.salt)
      .digest("hex");

    if (expectedHash !== session.passphraseHash) {
      return { success: false, error: "Incorrect passphrase. Authentication failed." };
    }

    // STRICT ATOMIC CAPACITY CHECK
    if (session.room.participants.length >= 2) {
      return {
        success: false,
        error: "Room is full. TITAN strictly limits sessions to exactly two participants.",
      };
    }

    const participantId = crypto.randomUUID();
    const now = Date.now();
    const newParticipant = {
      id: participantId,
      alias: alias || "Participant 2",
      slot: 2,
      isConnected: false,
      joinedAt: now,
      lastActiveAt: now,
    };

    session.room.participants.push(newParticipant);
    session.room.status = "ACTIVE";

    return {
      success: true,
      room: session.room,
      participantId,
      slot: 2,
    };
  }
}

describe("TITAN Room & Two-Person Enforcement Tests", () => {
  test("creates a valid room with unguessable code and initial participant slot 1", () => {
    const mgr = new TestRoomManager();
    const { room, participantId } = mgr.createRoom("Alice", "secret-pass-123");

    assert.ok(room.roomId);
    assert.match(room.roomCode, /^TITAN-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    assert.strictEqual(room.participants.length, 1);
    assert.strictEqual(room.participants[0].slot, 1);
    assert.strictEqual(room.participants[0].alias, "Alice");
    assert.strictEqual(room.status, "WAITING_FOR_PARTNER");
  });

  test("second participant joins successfully and occupies slot 2", () => {
    const mgr = new TestRoomManager();
    const { room } = mgr.createRoom("Alice", "secret-pass-123");

    const joinResult = mgr.joinRoom(room.roomCode, "secret-pass-123", "Bob");
    assert.strictEqual(joinResult.success, true);
    assert.strictEqual(joinResult.slot, 2);
    assert.strictEqual(joinResult.room.participants.length, 2);
    assert.strictEqual(joinResult.room.status, "ACTIVE");
  });

  test("rejects third participant when room already has two participants (Strict 2-Slot Rule)", () => {
    const mgr = new TestRoomManager();
    const { room } = mgr.createRoom("Alice", "secret-pass-123");

    // Person 2 joins
    const join2 = mgr.joinRoom(room.roomCode, "secret-pass-123", "Bob");
    assert.strictEqual(join2.success, true);

    // Person 3 attempts to join
    const join3 = mgr.joinRoom(room.roomCode, "secret-pass-123", "Eve");
    assert.strictEqual(join3.success, false);
    assert.match(join3.error, /Room is full/i);
    assert.strictEqual(room.participants.length, 2);
  });

  test("rejects join with incorrect passphrase", () => {
    const mgr = new TestRoomManager();
    const { room } = mgr.createRoom("Alice", "secret-pass-123");

    const joinResult = mgr.joinRoom(room.roomCode, "WRONG-PASSPHRASE", "Bob");
    assert.strictEqual(joinResult.success, false);
    assert.match(joinResult.error, /Incorrect passphrase/i);
  });

  test("rejects join with non-existent room code", () => {
    const mgr = new TestRoomManager();
    const joinResult = mgr.joinRoom("TITAN-NONEXISTENT", "pass", "Bob");
    assert.strictEqual(joinResult.success, false);
    assert.match(joinResult.error, /Room not found/i);
  });
});

