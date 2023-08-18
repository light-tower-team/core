import { Json } from "@common/json";
import { PrimaryKeySet } from "@src/key-sets/PrimaryKeySet";

import { EncryptedVault, Vault } from "../types";

export async function decryptVaultByPrimaryKeySet<TOverview extends Json>(
  encryptedVault: EncryptedVault<TOverview>,
  primaryKeySet: PrimaryKeySet
): Promise<Vault<TOverview>> {
  const { privateKey } = primaryKeySet;

  const key = await privateKey.unwrapKey(encryptedVault.encKey);

  return {
    key,
    overview: encryptedVault.overview,
  };
}
