import { generateCryptoRandomString } from "@common/generateCryptoRandomString";
import { createPrimaryKeySet } from "@src/key-sets/PrimaryKeySet";

import { createVault } from "../__tests__/helpers/createVault";
import { decryptVaultByPrimaryKeySet } from "./decryptVaultByPrimaryKeySet";
import { encryptVaultByPublicKeySet } from "./encryptVaultByPublicKeySet";

describe("primaryKeySet", () => {
  it("should encrypt and decrypt the vault by the primary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const primaryKeySet = await createPrimaryKeySet(masterPassword);

    const vault = await createVault();

    const encryptedVault = await encryptVaultByPublicKeySet(vault, primaryKeySet);
    const decryptedVault = await decryptVaultByPrimaryKeySet(encryptedVault, primaryKeySet);

    expect(decryptedVault).toEqual(vault);
  });
});
