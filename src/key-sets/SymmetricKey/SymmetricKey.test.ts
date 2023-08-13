import { _crypto } from "@common/crypto";
import { generateCryptoRandomSalt } from "@common/generateCryptoRandomSalt";
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
    const iv = generateCryptoRandomSalt();

    const encryptedData = await _crypto.subtle.encrypt(
      { name: "AES-GCM", iv, length: 256 },
      symmetricKey,
      Buffer.from(data, "utf-8")
    );

    const encryptedSymmetricKey = await SymmetricKey.encryptByAUK(symmetricKey, auk);
    const decryptedSymmetricKey = await SymmetricKey.decryptByAUK(encryptedSymmetricKey, auk);

    expect(_crypto.subtle.decrypt({ name: "AES-GCM", iv, length: 256 }, decryptedSymmetricKey, encryptedData));
  });

  it("should encrypt and decrypt symmetric key by primary key set key pair", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const symmetricKey = await SymmetricKey.generate();

    const data = JSON.stringify({ msg: "test" });
    const iv = generateCryptoRandomSalt();

    const encryptedData = await _crypto.subtle.encrypt(
      { name: "AES-GCM", iv, length: 256, tagLength: 128 },
      symmetricKey,
      Buffer.from(data, "utf-8")
    );

    const encryptedSymmetricKey = await SymmetricKey.encryptByPublicKey(symmetricKey, publicKey);
    const decryptedSymmetricKey = await SymmetricKey.decryptByPrivateKey(encryptedSymmetricKey, privateKey);

    expect(
      _crypto.subtle.decrypt({ name: "AES-GCM", iv, length: 256, tagLength: 128 }, decryptedSymmetricKey, encryptedData)
    );
  });
});
