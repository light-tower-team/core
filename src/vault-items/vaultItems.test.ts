import { createVault } from "@src/vaults/__tests__/helpers/createVault";

import { createVaultItem } from "./__tests__/createVaultItem";
import { decryptVaultItemByVault } from "./decryptVaultItem";
import { encryptVaultItemByVault } from "./encryptVaultItem";

describe("vaultItems", () => {
  it("should encrypt and decrypt the vault item by the vault", async () => {
    const vault = await createVault();

    const vaultItem = createVaultItem();

    const encryptedVaultItem = await encryptVaultItemByVault(vaultItem, vault);
    const decryptedVaultItem = await decryptVaultItemByVault(encryptedVaultItem, vault);

    expect(decryptedVaultItem).toEqual(vaultItem);
  });
});
