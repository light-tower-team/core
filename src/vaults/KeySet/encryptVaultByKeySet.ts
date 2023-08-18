import { JSON } from "@common/json";
import { KeySet } from "@src/key-sets/KeySet";

import { EncryptedVault, Vault } from "../types";

export async function encryptVaultByKeySet<TOverview extends JSON>(
  vault: Vault<TOverview>,
  keySet: KeySet
): Promise<EncryptedVault<TOverview>> {
  return {
    encKey: await keySet.symmetricKey.wrapKey(vault.key),
    overview: vault.overview,
  };
}
