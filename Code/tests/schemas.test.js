const { test, describe } = require("node:test");
const assert = require("node:assert");
const { z } = require("zod");

// Mirror schemas
const CreateRoomSchema = z.object({
  alias: z.string().trim().min(1).max(24).default("Participant 1"),
  passphrase: z.string().min(4).max(64),
});

const JoinRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(32),
  passphrase: z.string().min(4).max(64),
  alias: z.string().trim().min(1).max(24).default("Participant 2"),
});

const EncryptedPayloadSchema = z.object({
  messageId: z.string().uuid().or(z.string().min(8)),
  parentMessageId: z.string().optional(),
  ciphertext: z.string().min(1),
  iv: z.string().min(12),
  messageType: z.enum(["text", "code", "structured", "system"]),
  codeLanguage: z.string().optional(),
});

describe("TITAN Event & Payload Schema Tests", () => {
  test("validates valid room creation payload", () => {
    const valid = { alias: "DevAlice", passphrase: "secure-passphrase-99" };
    const res = CreateRoomSchema.safeParse(valid);
    assert.strictEqual(res.success, true);
  });

  test("rejects too short passphrase", () => {
    const invalid = { alias: "DevAlice", passphrase: "abc" };
    const res = CreateRoomSchema.safeParse(invalid);
    assert.strictEqual(res.success, false);
  });

  test("validates join payload with room code", () => {
    const valid = { roomCode: "TITAN-8921-KP", passphrase: "secure-passphrase-99", alias: "DevBob" };
    const res = JoinRoomSchema.safeParse(valid);
    assert.strictEqual(res.success, true);
  });

  test("validates encrypted message envelope payload", () => {
    const valid = {
      messageId: "msg-12345678",
      ciphertext: "Base64Ciphertext==",
      iv: "Base64IV123456==",
      messageType: "code",
      codeLanguage: "typescript",
    };
    const res = EncryptedPayloadSchema.safeParse(valid);
    assert.strictEqual(res.success, true);
  });

  test("rejects invalid message type in envelope", () => {
    const invalid = {
      messageId: "msg-12345678",
      ciphertext: "Base64Ciphertext==",
      iv: "Base64IV123456==",
      messageType: "unsupported_type",
    };
    const res = EncryptedPayloadSchema.safeParse(invalid);
    assert.strictEqual(res.success, false);
  });
});

