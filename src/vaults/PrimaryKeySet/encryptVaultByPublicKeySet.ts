import { JSON } from "@common/json";
import { PrimaryKeySet } from "@src/key-sets/PrimaryKeySet";

import { EncryptedVault, Vault } from "../types";

export async function encryptVaultByPublicKeySet<TOverview extends JSON>(
  vault: Vault<TOverview>,
  primaryKeySet: PrimaryKeySet
): Promise<EncryptedVault<TOverview>> {
  const { publicKey } = primaryKeySet;

  const encKey = await publicKey.wrapKey(vault.key);

  return {
    encKey,
    overview: vault.overview,
  };
}
