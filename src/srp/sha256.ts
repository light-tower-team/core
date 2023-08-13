import { _crypto } from "@common/crypto";

import { BigNumber } from "./big-number";

/**
 * @description SHA-256 hash function
 * @param args
 * @returns {BigNumber} big number
 */
export async function sha256(...args: (string | BigNumber)[]) {
  const buffers: Uint8Array[] = [];
  const textAsBuffer = new TextEncoder();

  for (const arg of args) {
    if (arg instanceof BigNumber) {
      buffers.push(Buffer.from(arg.toHex(), "hex"));
    } else if (typeof arg === "string") {
      buffers.push(textAsBuffer.encode(arg));
    } else {
      throw new TypeError("Expected string or SRPInteger");
    }
  }

  const buffer = new Uint8Array(buffers.reduce((length, buffer) => length + buffer.length, 0));
  let i = 0;

  for (const b of buffers) {
    for (const byte of b) {
      buffer[i++] = byte;
    }
  }

  const hashBuffer = await _crypto.subtle
    .digest("SHA-256", buffer)
    .then((output) => Buffer.from(new Uint8Array(output)).toString("hex"));

  return BigNumber.fromHex(hashBuffer);
}
