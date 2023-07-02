import { H } from "../params";

/**
 * Derive private key
 * @param {string} secretKey
 * @param {string} password
 * @param {string} salt
 * @returns {string} private key
 */
export const derivePrivateKey = (secretKey: string, password: string, salt: string): string => {
  const s = salt;
  const I = secretKey;
  const p = password;
  return H(s, H(`${I}:${p}`)).toHex();
};
