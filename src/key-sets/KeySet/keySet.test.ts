import { AES } from "@common/aes";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";

import { createPrimaryKeySet } from "../PrimaryKeySet";
import { createKeySet } from "./createKeySet";
import { decryptKeySet } from "./decryptKeySet";
import { encryptKeySet } from "./encryptKeySet";

describe("secondaryKeySets", () => {
  it("should create secondary key set", async () => {
    const keySet = await createKeySet();

    expect(keySet.symmetricKey).toBeInstanceOf(AES);
  });

  it("should encrypt and decrypt secondary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const primaryKeySet = await createPrimaryKeySet(masterPassword);

    const secondaryKeySet = await createKeySet();

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
