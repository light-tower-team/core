import { RSA } from "@common/rsa";

import { SymmetricKey } from "../SymmetricKey";
import { PrivateKey } from "./PrivateKey";

describe("private key", () => {
  it("should encrypt and decrypt the primary key by symmetric key", async () => {
    const symmetricKey = await SymmetricKey.generate();

    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const encryptedPrimaryKey = await PrivateKey.encryptBySymmetricKey(privateKey, symmetricKey);
    const decryptedPrimaryKey = await PrivateKey.decryptBySymmetricKey(encryptedPrimaryKey, symmetricKey);

    const data = JSON.stringify({ msg: "test" });
    const encryptedData = await publicKey.encrypt(data);

    expect(decryptedPrimaryKey.decrypt(encryptedData)).resolves.toEqual(data);
  });
});
