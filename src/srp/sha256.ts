import * as forge from "node-forge";

import { BigNumber } from "./big-number";

/**
 * @description SHA-256 hash function
 * @param args
 * @returns {BigNumber} big number
 */
export function sha256(...args: (string | BigNumber)[]) {
  const h = forge.md.sha256.create();

  for (const arg of args) {
    if (arg instanceof BigNumber) {
      h.update(arg.toHex());
    } else if (typeof arg === "string") {
      h.update(arg);
    } else {
      throw new TypeError("Expected string or SRPInteger");
    }
  }

  return BigNumber.fromHex(h.digest().toHex());
}
