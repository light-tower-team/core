import { BigNumber } from "../big-number.js";
import { g, k, N } from "../params.js";
import type { Ephemeral } from "../types.js";

/**
 * Generates public and secret ephemeral key pair
 * @param {string} verifier
 * @return {Ephemeral} ephemeral key pair
 */
export function generateEphemeralKeyPair(verifier: string): Ephemeral {
  const v = BigNumber.fromHex(verifier);

  const b = BigNumber.randomInteger(256 / 8);
  const B = k.multiply(v).add(g.modPow(b, N)).mod(N);

  return {
    secret: b.toHex(),
    public: B.toHex(),
  };
}
