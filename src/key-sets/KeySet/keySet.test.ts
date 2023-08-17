import { AES } from "@common/aes";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";

import { createPrimaryKeySet } from "../PrimaryKeyset";
import { createKeySet } from "./createKeySet";
import { decryptKeySet } from "./decryptKeySet";
import { encryptKeySet } from "./encryptKeySet";

describe("secondaryKeySets", () => {
  it("should create secondary key set", async () => {
    const vaultKey = await AES.generate();

    const keySet = createKeySet(vaultKey);

    expect(keySet.symmetricKey).toEqual(vaultKey);
  });

  it("should encrypt and decrypt secondary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const primaryKeySet = await createPrimaryKeySet(masterPassword);

    const vaultKey = await AES.generate();

    const secondaryKeySet = createKeySet(vaultKey);

    const encryptedSecKeySet = await encryptKeySet(secondaryKeySet, primaryKeySet);
    const decryptedSecKeySet = await decryptKeySet(encryptedSecKeySet, primaryKeySet);

    const data = generateCryptoRandomString();

    expect(decryptedSecKeySet.symmetricKey.decrypt(await secondaryKeySet.symmetricKey.encrypt(data))).resolves.toEqual(
      data
    );

    expect(secondaryKeySet.symmetricKey.decrypt(await decryptedSecKeySet.symmetricKey.encrypt(data))).resolves.toEqual(
      data
    );
  });
});
