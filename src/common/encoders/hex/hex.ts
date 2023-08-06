export class Hex {
  public static stringify(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  public static parse(hex: string): Uint8Array {
    const output = new Uint8Array(Math.ceil(hex.length / 2));

    let i = 0;
    let j = 0;

    // odd number of characters, convert first character alone
    if (hex.length & 1) {
      i = 1;
      output[j++] = Number.parseInt(hex[0], 16);
    }

    // convert 2 characters (1 byte) at a time
    for (; i < hex.length; i += 2) {
      output[j++] = Number.parseInt(hex.slice(i, i + 2), 16);
    }

    return output;
  }
}
