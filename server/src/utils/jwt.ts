import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

export const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_jwt_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export function generateJWT(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyJWT(token: string): object | string {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
