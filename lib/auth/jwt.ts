import { createHmac } from "crypto";

const JWT_SECRET = process.env.AUTH_SECRET || "default_development_secret_key_123456_super_secure_length_32_chars";

/**
 * Sign a payload as a JSON Web Token (HS256 signature).
 * Uses native Node.js crypto module.
 */
export function signJwt(payload: object, expiresInSeconds = 7 * 24 * 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  
  const enrichedPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(enrichedPayload)).toString("base64url");
  
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export interface JwtPayload {
  userId: string;
  exp: number;
}

/**
 * Verify a JSON Web Token.
 * Returns the decoded payload if valid and unexpired, otherwise null.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !signature) return null;
    
    // Verify signature
    const expectedSignature = createHmac("sha256", JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) return null;
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch {
    return null;
  }
}
