import crypto from "crypto";

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyToken(token: string, hashedToken: string): boolean {
  const tokenHash = hashToken(token);
  return tokenHash === hashedToken;
}
