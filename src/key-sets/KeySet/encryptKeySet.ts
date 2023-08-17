import { _crypto } from "@common/crypto";

import { PrimaryKeySet } from "../PrimaryKeySet";
import { EncryptedKeySet, KeySet } from "./types";

export async function encryptKeySet(keySet: KeySet, primaryKetSet: PrimaryKeySet): Promise<EncryptedKeySet> {
  const encSymmetricKey = await primaryKetSet.publicKey.wrapKey(keySet.symmetricKey);

  return {
    encSymmetricKey,
  };
}
