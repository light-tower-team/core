import { Json } from "@common/json";
import { Vault } from "@src/vaults";

import { EncryptedVaultItem, VaultItem } from "./types";

export async function decryptVaultItemByVault<
  TOverview extends Json = Json,
  TDetails extends Json = Json,
  TVault extends Vault = Vault
>(encryptedVaultItem: EncryptedVaultItem<TOverview>, vault: TVault): Promise<VaultItem<TOverview, TDetails>> {
  return {
    overview: encryptedVaultItem.overview,
    details: JSON.parse(await vault.key.decrypt(encryptedVaultItem.encDetails)),
  };
}
