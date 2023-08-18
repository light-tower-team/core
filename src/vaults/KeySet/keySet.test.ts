import { createKeySet } from "@src/key-sets/KeySet";

import { createVault } from "../__tests__/helpers/createVault";
import { decryptVaultByKeySet } from "./decryptVaultByKeySet";
import { encryptVaultByKeySet } from "./encryptVaultByKeySet";

describe("keySet", () => {
  it("should encrypt and decrypt the vault by the secondary key set", async () => {
    const keySet = await createKeySet();

    const vault = await createVault();

    const encryptedVault = await encryptVaultByKeySet(vault, keySet);
    const decryptedVault = await decryptVaultByKeySet(encryptedVault, keySet);

    expect(decryptedVault).toEqual(vault);
  });
});
