import { _crypto } from "@common/crypto";

import { generateKeyPair } from "./generateKeyPair";

describe("rsa", () => {
  it("should encrypt and decrypt data", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const data = JSON.stringify({ msg: "test" });
    const encryptedData = await publicKey.encrypt(data);

    expect(privateKey.decrypt(encryptedData)).resolves.toEqual(data);
  });
});
