import { BigNumber } from "../big-number.js";
import { g, N } from "../params.js";
import { Verifier } from "../types.js";
import { derivePrivateKey } from "./derivePrivateKey.js";

/**
 * Derives verifier
 * @param {string} secretKey
 * @returns {Verifier} verifier
 */
export function deriveVerifier(secretKey: string, password: string): Verifier {
  const salt = BigNumber.randomInteger(256 / 8).toHex();
  const privateKey = derivePrivateKey(secretKey, password, salt);

  const x = BigNumber.fromHex(privateKey);
  const v = g.modPow(x, N);
  const verifier = v.toHex();

  return {
    verifier,
    privateKey,
    salt,
  };
}
