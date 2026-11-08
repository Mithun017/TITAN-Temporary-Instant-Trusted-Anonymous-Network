import { z } from "zod";

export const CreateRoomSchema = z.object({
  alias: z.string().trim().min(1).max(24).default("Participant 1"),
  passphrase: z.string().min(4).max(64),
});

export const JoinRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(32),
  passphrase: z.string().min(4).max(64),
  alias: z.string().trim().min(1).max(24).default("Participant 2"),
});

export const EncryptedPayloadSchema = z.object({
  messageId: z.string().uuid().or(z.string().min(8)),
  parentMessageId: z.string().optional(),
  ciphertext: z.string().min(1),
  iv: z.string().min(12),
  messageType: z.enum(["text", "code", "structured", "system"]),
  codeLanguage: z.string().optional(),
});

export const EventEnvelopeSchema = z.object({
  version: z.literal(1),
  eventId: z.string(),
  type: z.enum([
    "connection.ready",
    "room.state",
    "participant.joined",
    "participant.left",
    "presence.update",
    "typing.start",
    "typing.stop",
    "message.send",
    "message.receive",
    "message.ack",
    "message.delivered",
    "attachment.share",
    "room.close",
    "room.expired",
    "error",
  ]),
  roomId: z.string(),
  sentAt: z.number(),
  senderId: z.string().optional(),
  payload: z.unknown(),
});

export const AttachmentShareSchema = z.object({
  id: z.string().uuid().or(z.string().min(8)),
  filename: z.string().max(128),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  byteSize: z.number().max(5 * 1024 * 1024), // Max 5MB
  caption: z.string().max(256).optional(),
  ciphertext: z.string(),
  iv: z.string(),
  expiresAt: z.number(),
});

