import { BigNumber } from "../big-number.js";
import { g, N } from "../params.js";
import { Ephemeral } from "../types.js";

/**
 * Generates public and secret ephemeral key pair
 * @return {Ephemeral} ephemeral key pair
 */
export function generateEphemeralKeyPair(): Ephemeral {
  const a = BigNumber.randomInteger(256 / 8);
  const A = g.modPow(a, N);

  return {
    secret: a.toHex(),
    public: A.toHex(),
  };
}
