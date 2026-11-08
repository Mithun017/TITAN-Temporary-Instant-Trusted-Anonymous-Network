export type ParticipantSlot = 1 | 2;

export interface Participant {
  id: string;
  alias: string;
  slot: ParticipantSlot;
  isConnected: boolean;
  joinedAt: number;
  lastActiveAt: number;
}

export type RoomStatus =
  | "CREATING"
  | "WAITING_FOR_PARTNER"
  | "ACTIVE"
  | "RECONNECTING"
  | "EXPIRED"
  | "CLOSED";

export interface Room {
  roomId: string;
  roomCode: string;
  salt: string; // Used for key derivation
  createdAt: number;
  expiresAt: number;
  status: RoomStatus;
  participants: Participant[];
  maxParticipants: 2;
}

export type MessageType = "text" | "code" | "structured" | "system";

export type DeliveryStatus =
  | "composing"
  | "sending"
  | "sent"
  | "delivered"
  | "received"
  | "failed";

export interface StructuredTestCase {
  input: string;
  expected: string;
  notes?: string;
}

export interface EncryptedPayload {
  messageId: string;
  parentMessageId?: string;
  ciphertext: string;
  iv: string;
  messageType: MessageType;
  codeLanguage?: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderSlot: ParticipantSlot;
  senderAlias: string;
  messageType: MessageType;
  content: string; // Plaintext on decrypted client
  codeLanguage?: string;
  structured?: StructuredTestCase;
  parentMessageId?: string;
  sequenceNumber: number;
  timestamp: number;
  status: DeliveryStatus;
  replies?: Message[];
}

export interface ContestAttachment {
  id: string;
  roomId: string;
  senderId: string;
  senderAlias: string;
  senderSlot: ParticipantSlot;
  filename: string;
  mimeType: string;
  byteSize: number;
  caption?: string;
  dataUrl: string; // Decrypted client preview / encrypted payload
  timestamp: number;
  expiresAt: number;
}

export type EventType =
  | "connection.ready"
  | "room.state"
  | "participant.joined"
  | "participant.left"
  | "presence.update"
  | "typing.start"
  | "typing.stop"
  | "message.send"
  | "message.receive"
  | "message.ack"
  | "message.delivered"
  | "attachment.share"
  | "room.close"
  | "room.expired"
  | "error";

export interface EventEnvelope<T = unknown> {
  version: 1;
  eventId: string;
  type: EventType;
  roomId: string;
  sentAt: number;
  senderId?: string;
  payload: T;
}

