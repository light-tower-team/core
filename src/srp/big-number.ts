import { BigInteger } from "jsbn";
import * as forge from "node-forge";

const kBigInteger = Symbol("big-integer");
const kHexLength = Symbol("hex-length");

export class BigNumber {
  public static ZERO: BigNumber = new BigNumber(new BigInteger("0"), 0);

  [kBigInteger]: BigInteger;
  [kHexLength]: number;

  constructor(bigInteger: BigInteger, hexLength: number) {
    this[kBigInteger] = bigInteger;
    this[kHexLength] = hexLength;
  }

  add(val: BigNumber) {
    return new BigNumber(this[kBigInteger].add(val[kBigInteger]), 0);
  }

  equals(val: BigNumber) {
    return this[kBigInteger].equals(val[kBigInteger]);
  }

  multiply(val: BigNumber) {
    return new BigNumber(this[kBigInteger].multiply(val[kBigInteger]), 0);
  }

  modPow(exponent: BigNumber, m: BigNumber) {
    return new BigNumber(this[kBigInteger].modPow(exponent[kBigInteger], m[kBigInteger]), m[kHexLength]);
  }

  mod(m: BigNumber) {
    return new BigNumber(this[kBigInteger].mod(m[kBigInteger]), m[kHexLength]);
  }

  subtract(val: BigNumber) {
    return new BigNumber(this[kBigInteger].subtract(val[kBigInteger]), this[kHexLength]);
  }

  xor(val: BigNumber) {
    return new BigNumber(this[kBigInteger].xor(val[kBigInteger]), this[kHexLength]);
  }

  inspect() {
    const hex = this[kBigInteger].toString(16);

    return `<BigNumber ${hex.slice(0, 16)}${hex.length > 16 ? "..." : ""}>`;
  }

  toHex() {
    if (this[kHexLength] === null) {
      throw new Error("This BigNumber has no specified length");
    }

    return this[kBigInteger].toString(16).padStart(this[kHexLength], "0");
  }

  static fromHex(input: string) {
    return new BigNumber(new BigInteger(input, 16), input.length);
  }

  static randomInteger(bytes: number) {
    return BigNumber.fromHex(forge.util.bytesToHex(forge.random.getBytesSync(bytes)));
  }
}
