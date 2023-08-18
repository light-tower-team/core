import { AES } from "@common/aes";
import { JSON } from "@common/json";
import { KeySet } from "@src/key-sets/KeySet";

import { EncryptedVault, Vault } from "../types";

export async function decryptVaultByKeySet<TOverview extends JSON>(
  encryptedVault: EncryptedVault<TOverview>,
  keySet: KeySet
): Promise<Vault<TOverview>> {
  const key = await keySet.symmetricKey.unwrapKey<AES>(encryptedVault.encKey);

  return {
    key,
    overview: encryptedVault.overview,
  };
}
