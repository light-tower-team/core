import { RSA } from "@common/rsa";

import { PrivateKey } from "../PrivateKey";
import { SymmetricKey } from "../SymmetricKey";
import { EncryptedPrimaryKeySet, PrimaryKeySet } from "./types";

export async function encryptPrimaryKeySet(primaryKeySet: PrimaryKeySet): Promise<EncryptedPrimaryKeySet> {
  const { auk, publicKey, privateKey, symmetricKey } = primaryKeySet;

  const [encryptedSymmetricKey, encryptedPrivateKey, stringifiedPublicKey] = await Promise.all([
    SymmetricKey.encryptByAUK(symmetricKey, auk),
    PrivateKey.encryptBySymmetricKey(privateKey, symmetricKey),
    RSA.stringifyPublicKey(publicKey),
  ]);

  return {
    encSymmetricKey: encryptedSymmetricKey,
    encPrivateKey: encryptedPrivateKey,
    publicKey: stringifiedPublicKey,
  };
}
