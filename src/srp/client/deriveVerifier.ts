import { BigNumber } from "../big-number";
import { g, N } from "../params";
import { Verifier } from "../types";
import { derivePrivateKey } from "./derivePrivateKey";

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
