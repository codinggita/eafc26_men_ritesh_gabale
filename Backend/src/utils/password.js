import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);
const keyLength = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, keyLength);

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, storedHash = "") {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const derivedKey = await scrypt(password, salt, keyLength);
  const storedBuffer = Buffer.from(hash, "hex");

  return storedBuffer.length === derivedKey.length && crypto.timingSafeEqual(storedBuffer, derivedKey);
}
