import { _crypto } from "@common/crypto";

import { CryptoKeyPair, PrivateKey, PublicKey } from "./types";

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await _crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
  );

  return {
    publicKey: new PublicKey(keyPair.publicKey),
    privateKey: new PrivateKey(keyPair.privateKey),
  };
}
