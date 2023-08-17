import { _crypto } from "@common/crypto";

import { PrimaryKeySet } from "../PrimaryKeySet";
import { EncryptedKeySet, KeySet } from "./types";

export async function decryptKeySet(encryptedKeySet: EncryptedKeySet, primaryKetSet: PrimaryKeySet): Promise<KeySet> {
  const symmetricKey = await primaryKetSet.privateKey.unwrapKey(encryptedKeySet.encSymmetricKey);

  return {
    symmetricKey,
  };
}
