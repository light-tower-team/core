import { generateCryptoRandomString } from "@common/generateCryptoRandomString";

import { AUK } from "./AUK";

describe("AUK", () => {
  it("should derive account unlock key", async () => {
    const masterPassword = await generateCryptoRandomString();

    const auk = await AUK.derive(masterPassword);

    expect(auk).toBeDefined();
  });
});
