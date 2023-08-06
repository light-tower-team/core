import { H } from "../params";

/**
 * Derive private key
 * @param {string} secretKey
 * @param {string} password
 * @param {string} salt
 * @returns {string} private key
 */
export async function derivePrivateKey(secretKey: string, password: string, salt: string): Promise<string> {
  const s = salt;
  const I = secretKey;
  const p = password;
  return (await H(s, await H(`${I}:${p}`))).toHex();
}
