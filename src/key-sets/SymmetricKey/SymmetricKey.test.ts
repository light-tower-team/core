import { _crypto } from "@common/crypto";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";
import { RSA } from "@common/rsa";

import { AUK } from "../AUK";
import { SymmetricKey } from "./SymmetricKey";

describe("symmetric key", () => {
  it("should encrypt and decrypt symmetric key by account unlock key (AUK)", async () => {
    const masterPassword = await generateCryptoRandomString();

    const auk = await AUK.derive(masterPassword);

    const symmetricKey = await SymmetricKey.generate();

    const data = JSON.stringify({ msg: "test" });
    const encryptedData = await symmetricKey.encrypt(data);

    const encryptedSymmetricKey = await SymmetricKey.encryptByAUK(symmetricKey, auk);
    const decryptedSymmetricKey = await SymmetricKey.decryptByAUK(encryptedSymmetricKey, auk);

    expect(decryptedSymmetricKey.decrypt(encryptedData)).resolves.toEqual(data);
  });

  it("should encrypt and decrypt symmetric key by primary key set key pair", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const symmetricKey = await SymmetricKey.generate();

    const data = JSON.stringify({ msg: "test" });
    const encryptedData = await symmetricKey.encrypt(data);

    const encryptedSymmetricKey = await SymmetricKey.encryptByPublicKey(symmetricKey, publicKey);
    const decryptedSymmetricKey = await SymmetricKey.decryptByPrivateKey(encryptedSymmetricKey, privateKey);

    expect(decryptedSymmetricKey.decrypt(encryptedData)).resolves.toEqual(data);
  });
});
