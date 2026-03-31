import crypto from "crypto";

const KEY_LENGTH = 64;

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto
    .scryptSync(password, salt, KEY_LENGTH)
    .toString("hex");

  return `${salt}:${derivedKey}`;
};

export const comparePassword = async (password, hashedPassword) => {
  const [salt, storedHash] = String(hashedPassword || "").split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = crypto
    .scryptSync(password, salt, KEY_LENGTH)
    .toString("hex");

  const storedBuffer = Buffer.from(storedHash, "hex");
  const derivedBuffer = Buffer.from(derivedKey, "hex");

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
};
