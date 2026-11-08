import { Room, Participant } from "@/types";
import crypto from "crypto";

export interface ActiveSession {
  room: Room;
  passphraseHash: string; // SHA-256 hash of passphrase for authentication
  sockets: Map<string, any>; // participantId -> WebSocket instance
  sequence: number;
}

// Global in-memory coordination map (persists across requests in Node process)
declare global {
  // eslint-disable-next-line no-var
  var __titan_rooms: Map<string, ActiveSession> | undefined;
  // eslint-disable-next-line no-var
  var __titan_code_index: Map<string, string> | undefined; // roomCode -> roomId
}

if (!global.__titan_rooms) {
  global.__titan_rooms = new Map();
}
if (!global.__titan_code_index) {
  global.__titan_code_index = new Map();
}

const rooms = global.__titan_rooms;
const codeIndex = global.__titan_code_index;

// Clean up expired rooms every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [roomId, session] of rooms.entries()) {
    if (session.room.expiresAt <= now) {
      // Notify connected sockets before cleanup
      for (const socket of session.sockets.values()) {
        try {
          socket.send(
            JSON.stringify({
              version: 1,
              eventId: crypto.randomUUID(),
              type: "room.expired",
              roomId,
              sentAt: now,
              payload: { reason: "Session TTL elapsed" },
            })
          );
          socket.close(4004, "Room Expired");
        } catch {
          // Ignore
        }
      }
      codeIndex.delete(session.room.roomCode);
      rooms.delete(roomId);
    }
  }
}, 60000);

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TITAN-${part1}-${part2}`;
}

export function createRoom(alias: string, passphrase: string, ttlSeconds = 1800): {
  room: Room;
  participantId: string;
} {
  const roomId = crypto.randomUUID();
  let roomCode = generateRoomCode();
  while (codeIndex.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const salt = crypto.randomBytes(16).toString("base64");
  const passphraseHash = crypto.createHash("sha256").update(passphrase + salt).digest("hex");
  const participantId = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = now + ttlSeconds * 1000;

  const participant: Participant = {
    id: participantId,
    alias: alias || "Participant 1",
    slot: 1,
    isConnected: false,
    joinedAt: now,
    lastActiveAt: now,
  };

  const room: Room = {
    roomId,
    roomCode,
    salt,
    createdAt: now,
    expiresAt,
    status: "WAITING_FOR_PARTNER",
    participants: [participant],
    maxParticipants: 2,
  };

  const session: ActiveSession = {
    room,
    passphraseHash,
    sockets: new Map(),
    sequence: 0,
  };

  rooms.set(roomId, session);
  codeIndex.set(roomCode, roomId);

  return { room, participantId };
}

export function joinRoom(
  roomCode: string,
  passphrase: string,
  alias: string
): {
  success: boolean;
  error?: string;
  room?: Room;
  participantId?: string;
  slot?: 1 | 2;
} {
  const roomId = codeIndex.get(roomCode.trim().toUpperCase());
  if (!roomId) {
    return { success: false, error: "Room not found or code is invalid." };
  }

  const session = rooms.get(roomId);
  if (!session) {
    return { success: false, error: "Room session has expired or been terminated." };
  }

  if (session.room.expiresAt <= Date.now()) {
    codeIndex.delete(roomCode);
    rooms.delete(roomId);
    return { success: false, error: "Room session has expired." };
  }

  // Verify passphrase
  const expectedHash = crypto
    .createHash("sha256")
    .update(passphrase + session.room.salt)
    .digest("hex");

  if (expectedHash !== session.passphraseHash) {
    return { success: false, error: "Incorrect passphrase. Authentication failed." };
  }

  // ATOMIC CAPACITY CHECK: strictly maximum 2 participants
  if (session.room.participants.length >= 2) {
    return {
      success: false,
      error: "Room is full. TITAN strictly limits sessions to exactly two participants.",
    };
  }

  const participantId = crypto.randomUUID();
  const now = Date.now();
  const newParticipant: Participant = {
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

export function getSession(roomId: string): ActiveSession | undefined {
  return rooms.get(roomId);
}

export function getSessionByCode(roomCode: string): ActiveSession | undefined {
  const roomId = codeIndex.get(roomCode.trim().toUpperCase());
  if (!roomId) return undefined;
  return rooms.get(roomId);
}

export function getDirectPassphrase(roomCode: string): string {
  return `direct-session-${roomCode.trim().toUpperCase()}-key`;
}

export function createOrJoinDirectRoom(
  roomCode?: string,
  alias?: string
): {
  success: boolean;
  error?: string;
  isCreator: boolean;
  room?: Room;
  participantId?: string;
  slot?: 1 | 2;
  passphrase?: string;
} {
  if (roomCode) {
    const code = roomCode.trim().toUpperCase();
    const roomId = codeIndex.get(code);
    if (roomId) {
      const session = rooms.get(roomId);
      if (session && session.room.expiresAt > Date.now()) {
        const passphrase = getDirectPassphrase(code);
        if (session.room.participants.length < 2) {
          const res = joinRoom(code, passphrase, alias || "Partner");
          return {
            success: res.success,
            error: res.error,
            isCreator: false,
            room: res.room,
            participantId: res.participantId,
            slot: res.slot,
            passphrase,
          };
        } else {
          return {
            success: false,
            error: "This pair session is already full (maximum 2 participants).",
            isCreator: false,
          };
        }
      }
    }
  }

  // Create new direct room with 2 hours TTL
  const newCode = generateRoomCode();
  const passphrase = getDirectPassphrase(newCode);
  const { room, participantId } = createRoom(alias || "Host", passphrase, 7200);
  return {
    success: true,
    isCreator: true,
    room,
    participantId,
    slot: 1,
    passphrase,
  };
}


