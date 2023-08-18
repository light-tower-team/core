import { AES } from "@common/aes";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";
import { createPrimaryKeySet } from "@src/key-sets/PrimaryKeySet";

import { Vault } from "../types";
import { decryptVaultByPrimaryKeySet } from "./decryptVaultByPrimaryKeySet";
import { encryptVaultByPublicKeySet } from "./encryptVaultByPublicKeySet";

describe("primaryKeySet", () => {
  it("should encrypt and decrypt the vault by the primary key set", async () => {
    const masterPassword = generateCryptoRandomString();

    const primaryKeySet = await createPrimaryKeySet(masterPassword);

    const vault: Vault<{ name: string; desc: string }> = {
      key: await AES.generate(),
      overview: { name: generateCryptoRandomString(), desc: generateCryptoRandomString() },
    };

    const encryptedVault = await encryptVaultByPublicKeySet(vault, primaryKeySet);
    const decryptedVault = await decryptVaultByPrimaryKeySet(encryptedVault, primaryKeySet);

    expect(decryptedVault).toEqual(vault);
  });
});
