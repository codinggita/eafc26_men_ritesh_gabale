import crypto from "crypto";

import { env } from "../config/env.js";

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signPart(data) {
  return base64Url(JSON.stringify(data));
}

function createSignature(unsignedToken) {
  return crypto.createHmac("sha256", env.jwtSecret).update(unsignedToken).digest("base64url");
}

export function generateToken(payload, expiresInSeconds = env.jwtExpiresInSeconds) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };
  const unsignedToken = `${signPart(header)}.${signPart(body)}`;

  return `${unsignedToken}.${createSignature(unsignedToken)}`;
}

export function verifyToken(token) {
  const [header, payload, signature] = String(token || "").split(".");
  if (!header || !payload || !signature) {
    throw new Error("Invalid token");
  }

  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = createSignature(unsignedToken);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    throw new Error("Invalid token signature");
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return decoded;
}
