import { _crypto } from "@common/crypto";

import { PublicKey } from "./types";

export async function stringifyPublicKey(publicKey: PublicKey): Promise<JsonWebKey> {
  return _crypto.subtle.exportKey("jwk", publicKey.origin);
}

export async function parsePublicKey(jwk: JsonWebKey): Promise<PublicKey> {
  const publicKey = await _crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, [
    "encrypt",
    "wrapKey",
  ]);

  return new PublicKey(publicKey);
}
