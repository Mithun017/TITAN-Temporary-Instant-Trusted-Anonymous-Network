/**
 * TITAN Cryptographic Subsystem
 * Web Crypto API implementation for AES-256-GCM authenticated encryption.
 * Passphrase & Room Salt -> PBKDF2 (SHA-256, 100,000 iterations) -> AES-256-GCM Key.
 */

// Helper: Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Helper: Convert string to UTF-8 buffer
export function strToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper: Convert UTF-8 buffer to string
export function bufferToStr(buffer: ArrayBuffer | Uint8Array): string {
  return new TextDecoder().decode(buffer);
}

// Generate a random cryptographically secure salt (16 bytes)
export function generateSalt(): string {
  const salt = new Uint8Array(16);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(salt);
  } else {
    // Node.js fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require("crypto");
    const bytes = nodeCrypto.randomBytes(16);
    return bufferToBase64(bytes);
  }
  return bufferToBase64(salt);
}

// Derive an AES-256-GCM CryptoKey from passphrase and salt
export async function deriveKey(passphrase: string, saltBase64: string): Promise<CryptoKey> {
  const subtle = typeof window !== "undefined" ? window.crypto.subtle : (await import("crypto")).webcrypto.subtle;
  const salt = base64ToBuffer(saltBase64);
  const passphraseBytes = strToBuffer(passphrase);

  // Import raw passphrase as key material
  const baseKey = await subtle.importKey(
    "raw",
    passphraseBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive AES-GCM 256-bit key
  const derivedKey = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true, // Extractable for fingerprint verification
    ["encrypt", "decrypt"]
  );

  return derivedKey;
}

// Compute Safety Fingerprint (Human-readable verification blocks)
export async function computeFingerprint(key: CryptoKey, saltBase64: string): Promise<string> {
  const subtle = typeof window !== "undefined" ? window.crypto.subtle : (await import("crypto")).webcrypto.subtle;
  const rawKey = await subtle.exportKey("raw", key);
  const combined = new Uint8Array(rawKey.byteLength + 16);
  combined.set(new Uint8Array(rawKey), 0);
  combined.set(base64ToBuffer(saltBase64), rawKey.byteLength);

  const hashBuffer = await subtle.digest("SHA-256", combined);
  const hashBytes = new Uint8Array(hashBuffer);

  // Format into 4 chunks of 4 digits
  let digits = "";
  for (let i = 0; i < 8; i++) {
    const val = (hashBytes[i * 2] << 8) | hashBytes[i * 2 + 1];
    digits += (val % 10000).toString().padStart(4, "0");
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
}

// Encrypt plaintext string -> { ciphertext, iv }
export async function encryptText(
  key: CryptoKey,
  plaintext: string
): Promise<{ ciphertext: string; iv: string }> {
  const subtle = typeof window !== "undefined" ? window.crypto.subtle : (await import("crypto")).webcrypto.subtle;
  const iv = new Uint8Array(12); // Recommended 96-bit IV for AES-GCM
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(iv);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require("crypto");
    const bytes = nodeCrypto.randomBytes(12);
    iv.set(bytes);
  }

  const encoded = strToBuffer(plaintext);
  const cipherBuffer = await subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded
  );

  return {
    ciphertext: bufferToBase64(cipherBuffer),
    iv: bufferToBase64(iv),
  };
}

// Decrypt ciphertext string -> plaintext string
export async function decryptText(
  key: CryptoKey,
  ciphertextBase64: string,
  ivBase64: string
): Promise<string> {
  const subtle = typeof window !== "undefined" ? window.crypto.subtle : (await import("crypto")).webcrypto.subtle;
  const iv = base64ToBuffer(ivBase64);
  const cipherBytes = base64ToBuffer(ciphertextBase64);

  const decryptedBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    cipherBytes
  );

  return bufferToStr(decryptedBuffer);
}

// Encrypt file bytes / data URL
export async function encryptDataUrl(
  key: CryptoKey,
  dataUrl: string
): Promise<{ ciphertext: string; iv: string }> {
  return encryptText(key, dataUrl);
}

// Decrypt file bytes / data URL
export async function decryptDataUrl(
  key: CryptoKey,
  ciphertext: string,
  iv: string
): Promise<string> {
  return decryptText(key, ciphertext, iv);
}

