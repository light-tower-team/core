import { _crypto } from "./crypto";
import { Hex } from "./encoders/hex";

/**
 *  Generates the crypto string of the passed length
 *  @param {number} length the length of the generated crypto string
 *  @returns {string} the generated crypto string with the length
 */
export function generateCryptoRandomString(length = 16) {
  const randomValues = _crypto.getRandomValues(new Uint8Array(length));

  return Hex.stringify(randomValues).slice(0, length).toUpperCase();
}
