import { _crypto } from "@common/crypto";
import { generateCryptoRandomSalt } from "@common/generateCryptoRandomSalt";
import { JsonWebEncryption } from "@common/jwe";
import { RSA } from "@common/rsa";

export class PrivateKey {
  public static async encryptBySymmetricKey(
    privateKey: RSA.PrivateKey,
    symmetricKey: CryptoKey
  ): Promise<JsonWebEncryption> {
    const iv = generateCryptoRandomSalt();
    const tag = 128;

    const encryptedPrivateKey = await _crypto.subtle.wrapKey("jwk", privateKey.origin, symmetricKey, {
      name: "AES-GCM",
      iv,
      tagLength: tag,
    });

    return {
      kid: "sk",
      cty: "jwk+json",
      enc: "A256GCM",
      data: Buffer.from(encryptedPrivateKey).toString("base64"),
      iv: Buffer.from(iv).toString("base64"),
      tag,
    };
  }

  public static async decryptBySymmetricKey(
    encryptedPrimaryKey: JsonWebEncryption,
    symmetricKey: CryptoKey
  ): Promise<RSA.PrivateKey> {
    if (!encryptedPrimaryKey.iv) {
      throw new TypeError("The initialization vector is required");
    }

    if (!encryptedPrimaryKey.tag) {
      throw new TypeError("The authentication tag is required");
    }

    const decryptedPrivateKey = await _crypto.subtle.unwrapKey(
      "jwk",
      Buffer.from(encryptedPrimaryKey.data, "base64"),
      symmetricKey,
      { name: "AES-GCM", iv: Buffer.from(encryptedPrimaryKey.iv, "base64"), tagLength: encryptedPrimaryKey.tag },
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );

    return new RSA.PrivateKey(decryptedPrivateKey);
  }
}
