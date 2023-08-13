import { _crypto } from "./crypto";

/**
 *  Generates the crypto string of the passed length
 *  @param {number} length the length of the generated crypto string
 *  @returns {string} the generated crypto string with the length
 */
export function generateCryptoRandomString(length = 32): string {
  const randomValues = _crypto.getRandomValues(new Uint8Array(length));

  return Buffer.from(randomValues).toString("hex").slice(0, length).toUpperCase();
}
