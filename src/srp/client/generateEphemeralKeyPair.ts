import { BigNumber } from "../big-number";
import { g, N } from "../params";
import { Ephemeral } from "../types";

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
