import { RSA } from "@common/rsa";

import { AUK } from "../AUK";
import { PrivateKey } from "../PrivateKey";
import { SymmetricKey } from "../SymmetricKey";
import { EncryptedPrimaryKeySet, PrimaryKeySet } from "./types";

export async function decryptPrimaryKeySet(
  encryptedPrimaryKeySet: EncryptedPrimaryKeySet,
  masterPassword: string
): Promise<PrimaryKeySet> {
  const { encSymmetricKey, encPrivateKey, publicKey } = encryptedPrimaryKeySet;

  const [auk, parsedPublicKey] = await Promise.all([AUK.derive(masterPassword), RSA.parsePublicKey(publicKey)]);

  const symmetricKey = await SymmetricKey.decryptByAUK(encSymmetricKey, auk);
  const privateKey = await PrivateKey.decryptBySymmetricKey(encPrivateKey, symmetricKey);

  return {
    auk,
    privateKey,
    symmetricKey,
    publicKey: parsedPublicKey,
  };
}
