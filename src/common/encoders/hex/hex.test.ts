import { _crypto } from "@common/crypto";

import { Hex } from "./hex";

describe("[hex]", () => {
  it("should encode and decode bytes to hex", () => {
    const buffer = new Uint8Array(16);

    _crypto.getRandomValues(buffer);

    const hex = Hex.stringify(buffer);

    expect(hex).toBeDefined();
    expect(Hex.parse(hex)).toEqual(buffer);
  });
});
