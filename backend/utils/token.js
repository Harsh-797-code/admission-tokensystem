import crypto from "crypto";

/**
 * Generates a cryptographically secure random token.
 * The raw token is sent to the student's email.
 */
export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a raw token before storing it in the database.
 * The raw token should never be stored in PostgreSQL.
 */
export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}