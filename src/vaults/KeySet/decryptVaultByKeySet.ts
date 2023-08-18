import { AES } from "@common/aes";
import { Json } from "@common/json";
import { KeySet } from "@src/key-sets/KeySet";

import { EncryptedVault, Vault } from "../types";

export async function decryptVaultByKeySet<TOverview extends Json>(
  encryptedVault: EncryptedVault<TOverview>,
  keySet: KeySet
): Promise<Vault<TOverview>> {
  const key = await keySet.symmetricKey.unwrapKey<AES>(encryptedVault.encKey);

  return {
    key,
    overview: encryptedVault.overview,
  };
}
