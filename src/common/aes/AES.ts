import { _crypto } from "@common/crypto";
import { generateCryptoRandomSalt } from "@common/generateCryptoRandomSalt";
import { IEncryptionKey, JsonWebEncryption } from "@common/jwe";
import { RSA } from "@common/rsa";

export class AES implements IEncryptionKey {
  public constructor(public readonly origin: CryptoKey) {}

  public static async generate(): Promise<AES> {
    const symKey = await _crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return new AES(symKey);
  }

  public async encrypt(data: string): Promise<JsonWebEncryption> {
    const iv = generateCryptoRandomSalt();

    const encryptedData = await _crypto.subtle.encrypt(
      { name: "AES-GCM", iv, length: 256 },
      this.origin,
      Buffer.from(data, "utf-8")
    );

    return {
      kid: "vk",
      cty: "jwk+json",
      enc: "A256GCM",
      data: Buffer.from(encryptedData).toString("base64"),
      iv: Buffer.from(iv).toString("base64"),
    };
  }

  public async decrypt(encryptedData: JsonWebEncryption): Promise<string> {
    const { iv, data } = encryptedData;

    if (!iv) {
      throw new TypeError("The initialization vector is required");
    }

    const decryptedData = await _crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Buffer.from(iv, "base64"), length: 256 },
      this.origin,
      Buffer.from(data, "base64")
    );

    return Buffer.from(decryptedData).toString("utf-8");
  }

  public async wrapKey(key: AES | RSA.PrivateKey): Promise<JsonWebEncryption> {
    const iv = generateCryptoRandomSalt();
    const tag = 128;

    const encryptedKey = await _crypto.subtle.wrapKey("jwk", key.origin, this.origin, {
      name: "AES-GCM",
      length: 256,
      iv,
      tagLength: tag,
    });

    return {
      kid: "aes",
      enc: "A256GCM",
      cty: "jwk+json",
      iv: Buffer.from(iv).toString("base64"),
      data: Buffer.from(encryptedKey).toString("base64"),
      alg: key.origin.algorithm.name === "RSA-OAEP" ? "RSA-OAEP-256" : undefined,
      tag,
    };
  }

  public async unwrapKey<TEncKey extends AES | RSA.PrivateKey>(encryptedKey: JsonWebEncryption): Promise<TEncKey> {
    if (!encryptedKey.iv) {
      throw new TypeError(`The initialization vector is required`);
    }

    if (!encryptedKey.tag) {
      throw new TypeError(`The authentication Tag is required`);
    }

    const isRSA = encryptedKey.alg === "RSA-OAEP-256";

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
      isRSA ? { name: "RSA-OAEP", hash: "SHA-256" } : { name: "AES-GCM", length: 256, hash: "SHA-256" },
      true,
      isRSA ? ["unwrapKey", "decrypt"] : ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return (isRSA ? new RSA.PrivateKey(origin) : new AES(origin)) as unknown as TEncKey;
  }
}
