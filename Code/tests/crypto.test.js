const { test, describe } = require("node:test");
const assert = require("node:assert");
const crypto = require("node:crypto");

// Node.js Web Crypto implementation of our crypto subsystem
async function deriveKeyNode(passphrase, saltBase64) {
  const subtle = crypto.webcrypto.subtle;
  const salt = Buffer.from(saltBase64, "base64");
  const passphraseBytes = Buffer.from(passphrase, "utf-8");

  const baseKey = await subtle.importKey(
    "raw",
    passphraseBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptNode(key, plaintext) {
  const subtle = crypto.webcrypto.subtle;
  const iv = crypto.randomBytes(12);
  const encoded = Buffer.from(plaintext, "utf-8");

  const cipherBuffer = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    ciphertext: Buffer.from(cipherBuffer).toString("base64"),
    iv: iv.toString("base64"),
  };
}

async function decryptNode(key, ciphertextBase64, ivBase64) {
  const subtle = crypto.webcrypto.subtle;
  const iv = Buffer.from(ivBase64, "base64");
  const cipherBytes = Buffer.from(ciphertextBase64, "base64");

  const decryptedBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBytes
  );

  return Buffer.from(decryptedBuffer).toString("utf-8");
}

async function computeFingerprintNode(key, saltBase64) {
  const subtle = crypto.webcrypto.subtle;
  const rawKey = await subtle.exportKey("raw", key);
  const salt = Buffer.from(saltBase64, "base64");
  const combined = Buffer.concat([Buffer.from(rawKey), salt]);

  const hashBuffer = await subtle.digest("SHA-256", combined);
  const hashBytes = new Uint8Array(hashBuffer);

  let digits = "";
  for (let i = 0; i < 8; i++) {
    const val = (hashBytes[i * 2] << 8) | hashBytes[i * 2 + 1];
    digits += (val % 10000).toString().padStart(4, "0");
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
}

describe("TITAN Cryptographic Subsystem Tests", () => {
  const passphrase = "CORRECT-HORSE-BATTERY-STAPLE-789";
  const saltBase64 = crypto.randomBytes(16).toString("base64");

  test("derives valid AES-256-GCM CryptoKey from passphrase and salt", async () => {
    const key = await deriveKeyNode(passphrase, saltBase64);
    assert.strictEqual(key.type, "secret");
    assert.strictEqual(key.algorithm.name, "AES-GCM");
    assert.strictEqual(key.algorithm.length, 256);
  });

  test("encrypts and decrypts text payload correctly (round-trip)", async () => {
    const key = await deriveKeyNode(passphrase, saltBase64);
    const originalText = "Testcase #7: Edge case with target = 0 and nums = [0, 0]";

    const { ciphertext, iv } = await encryptNode(key, originalText);
    assert.notStrictEqual(ciphertext, originalText);
    assert.ok(ciphertext.length > 0);
    assert.strictEqual(Buffer.from(iv, "base64").length, 12);

    const decrypted = await decryptNode(key, ciphertext, iv);
    assert.strictEqual(decrypted, originalText);
  });

  test("fails decryption with wrong passphrase/key (authentication tag mismatch)", async () => {
    const correctKey = await deriveKeyNode(passphrase, saltBase64);
    const wrongKey = await deriveKeyNode("WRONG-PASS-1234", saltBase64);

    const { ciphertext, iv } = await encryptNode(correctKey, "Secret Message");

    await assert.rejects(
      async () => {
        await decryptNode(wrongKey, ciphertext, iv);
      },
      /operation failed|tag mismatch|decrypt/i
    );
  });

  test("computes identical safety fingerprint for identical keys", async () => {
    const key1 = await deriveKeyNode(passphrase, saltBase64);
    const key2 = await deriveKeyNode(passphrase, saltBase64);

    const fp1 = await computeFingerprintNode(key1, saltBase64);
    const fp2 = await computeFingerprintNode(key2, saltBase64);

    assert.strictEqual(fp1, fp2);
    assert.match(fp1, /^\d{4} \d{4} \d{4} \d{4}$/);
  });

  test("computes different safety fingerprint for different passphrase", async () => {
    const key1 = await deriveKeyNode(passphrase, saltBase64);
    const key2 = await deriveKeyNode("DIFFERENT-PASS", saltBase64);

    const fp1 = await computeFingerprintNode(key1, saltBase64);
    const fp2 = await computeFingerprintNode(key2, saltBase64);

    assert.notStrictEqual(fp1, fp2);
  });
});

