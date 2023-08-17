import { RSA } from "@common/rsa";

import { AUK } from "../AUK";
import { SymmetricKey } from "../SymmetricKey";
import { PrimaryKeySet } from "./types";

export async function createPrimaryKeySet(masterPassword: string): Promise<PrimaryKeySet> {
  const [auk, symmetricKey, { publicKey, privateKey }] = await Promise.all([
    AUK.derive(masterPassword),
    SymmetricKey.generate(),
    RSA.generateKeyPair(),
  ]);

  return {
    auk,
    publicKey,
    privateKey,
    symmetricKey,
  };
}
