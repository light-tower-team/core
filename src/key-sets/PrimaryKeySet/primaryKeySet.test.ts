import { AES } from "@common/aes";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";
import { RSA } from "@common/rsa";

import { createPrimaryKeySet } from "./createPrimaryKeySet";
import { decryptPrimaryKeySet } from "./decryptPrimaryKeySet";
import { encryptPrimaryKeySet } from "./encryptPrimaryKeySet";

describe("primaryKeySet", () => {
  it("should create a primary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const encryptedPrimaryKeySet = await createPrimaryKeySet(masterPassword);

    expect(encryptedPrimaryKeySet.auk).toBeDefined();
    expect(encryptedPrimaryKeySet.symmetricKey).toBeInstanceOf(AES);
    expect(encryptedPrimaryKeySet.publicKey).toBeInstanceOf(RSA.PublicKey);
    expect(encryptedPrimaryKeySet.privateKey).toBeInstanceOf(RSA.PrivateKey);
  });

  it("should encrypt and decrypt a primary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const primaryKeySet = await createPrimaryKeySet(masterPassword);

    const encryptedPrimaryKeySet = await encryptPrimaryKeySet(primaryKeySet);
    const decryptedPrimaryKeySet = await decryptPrimaryKeySet(encryptedPrimaryKeySet, masterPassword);

    const data = JSON.stringify({ msg: "test" });

    expect(decryptedPrimaryKeySet.privateKey.decrypt(await primaryKeySet.publicKey.encrypt(data))).resolves.toEqual(
      data
    );

    expect(primaryKeySet.privateKey.decrypt(await decryptedPrimaryKeySet.publicKey.encrypt(data))).resolves.toEqual(
      data
    );
  });
});
