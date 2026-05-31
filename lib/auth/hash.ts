import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Hash a password using Node.js's built-in scrypt algorithm.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored "salt:hash" string.
 * Uses a constant-time comparison (timingSafeEqual) to prevent timing attacks.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    
    const testHash = scryptSync(password, salt, 64).toString("hex");
    
    return timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(testHash, "hex")
    );
  } catch {
    return false;
  }
}
