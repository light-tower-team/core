import { AES } from "./aes";
import { _crypto } from "./crypto";
import { generateCryptoRandomSalt } from "./generateCryptoRandomSalt";
import { IEncryptionKey, JsonWebEncryption } from "./jwe";

export class WrappingKey implements IEncryptionKey {
  public constructor(public readonly origin: CryptoKey) {}

  public async wrapKey(key: IEncryptionKey): Promise<JsonWebEncryption> {
    const iv = generateCryptoRandomSalt();
    const tag = 128;

    const encryptedSymKey = await _crypto.subtle.wrapKey("jwk", key.origin, this.origin, {
      name: "AES-GCM",
      length: 256,
      iv,
      tagLength: tag,
    });

    return {
      kid: "",
      cty: "jwk+json",
      enc: "A256GCM",
      data: Buffer.from(encryptedSymKey).toString("base64"),
      iv: Buffer.from(iv).toString("base64"),
      tag,
    };
  }

  public async unwrapKey<TEncKey extends IEncryptionKey>(encryptedKey: JsonWebEncryption): Promise<TEncKey> {
    if (!encryptedKey.iv) {
      throw new TypeError(`The initialization vector is required`);
    }

    if (!encryptedKey.tag) {
      throw new TypeError(`The authentication Tag is required`);
    }

    const origin = await _crypto.subtle.unwrapKey(
      "jwk",
      Buffer.from(encryptedKey.data, "base64"),
      this.origin,
      {
        name: "AES-GCM",
        length: 256,
        iv: Buffer.from(encryptedKey.iv, "base64"),
        tagLength: encryptedKey.tag,
      },
      { name: "AES-GCM", length: 256, hash: "SHA-256" },
      true,
      ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return new AES(origin) as unknown as TEncKey;
  }
}

export async function pbkdf2(baseKey: CryptoKey, p2s: ArrayBuffer, p2c: number): Promise<WrappingKey> {
  const origin = await _crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: p2s,
      iterations: p2c,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256, hash: "SHA-256" },
    true,
    ["wrapKey", "unwrapKey"]
  );

  return new WrappingKey(origin);
}
