import forge from "node-forge";

/**
 *  Generates the crypto string of the passed length
 *  @param {number} length the length of the generated crypto string
 *  @returns {string} the generated crypto string with the length
 */
export function generateCryptoRandomString(length: number) {
  return forge.util.bytesToHex(forge.random.getBytesSync(length)).slice(0, length).toUpperCase();
}
