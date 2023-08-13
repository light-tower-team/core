import { _crypto } from "./crypto";

/**
 *  Generates the crypto salt of the passed length
 *  @param {number} length the length of the generated crypto salt
 *  @returns {string} the generated crypto salt with the length
 */
export function generateCryptoRandomSalt(length = 32): Buffer {
  const salt = _crypto.getRandomValues(new Uint8Array(length));

  return Buffer.from(salt);
}
