import { Json } from "@common/json";
import { Vault } from "@src/vaults";

import { EncryptedVaultItem, VaultItem } from "./types";

export async function encryptVaultItemByVault<
  TOverview extends Json = Json,
  TDetails extends Json = Json,
  TVault extends Vault = Vault
>(vaultItem: VaultItem<TOverview, TDetails>, vault: TVault): Promise<EncryptedVaultItem<TOverview>> {
  return {
    overview: vaultItem.overview,
    encDetails: await vault.key.encrypt(JSON.stringify(vaultItem.details)),
  };
}
