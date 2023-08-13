import { _crypto } from "@common/crypto";
import { generateCryptoRandomSalt } from "@common/generateCryptoRandomSalt";
import { JsonWebEncryption } from "@common/jwe";
import { RSA } from "@common/rsa";

export class SymmetricKey {
  public static async generate(): Promise<CryptoKey> {
    const symmetricKey = await _crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["wrapKey", "unwrapKey", "encrypt", "decrypt"]
    );

    return symmetricKey;
  }

  public static async encryptByAUK(symmetricKey: CryptoKey, auk: CryptoKey): Promise<JsonWebEncryption> {
    const [iv, p2s] = await Promise.all([generateCryptoRandomSalt(), generateCryptoRandomSalt()]);
    const p2c = 650_000;
    const tag = 128;

    const accountUnlockKey = await _crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: p2s,
        iterations: p2c,
        hash: "SHA-256",
      },
      auk,
      { name: "AES-GCM", length: 256, hash: "SHA-256" },
      true,
      ["wrapKey", "unwrapKey"]
    );

    const encryptedSymKey = await _crypto.subtle.wrapKey("jwk", symmetricKey, accountUnlockKey, {
      name: "AES-GCM",
      length: 256,
      iv,
      tagLength: tag,
    });

    return {
      kid: "mp",
      enc: "A256GCM",
      cty: "jwk+json",
      iv: Buffer.from(iv).toString("base64"),
      p2s: Buffer.from(p2s).toString("base64"),
      data: Buffer.from(encryptedSymKey).toString("base64"),
      alg: "PBKDF2-HS256",
      p2c,
      tag,
    };
  }

  public static async decryptByAUK(symmetricKey: JsonWebEncryption, auk: CryptoKey): Promise<CryptoKey> {
    if (!symmetricKey.iv) {
      throw new TypeError(`The initialization vector is required`);
    }

    if (!symmetricKey.p2s) {
      throw new TypeError(`The PBKDF2 Salt Input is required`);
    }

    if (!symmetricKey.p2c) {
      throw new TypeError(`The PBKDF2 Count is required`);
    }

    if (!symmetricKey.tag) {
      throw new TypeError(`The authentication Tag is required`);
    }

    const accountUnlockKey = await _crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: Buffer.from(symmetricKey.p2s, "base64"),
        iterations: symmetricKey.p2c,
        hash: "SHA-256",
      },
      auk,
      { name: "AES-GCM", length: 256 },
      true,
      ["wrapKey", "unwrapKey"]
    );

    const encryptedSymKey = await _crypto.subtle.unwrapKey(
      "jwk",
      Buffer.from(symmetricKey.data, "base64"),
      accountUnlockKey,
      {
        name: "AES-GCM",
        length: 256,
        iv: Buffer.from(symmetricKey.iv, "base64"),
        tagLength: symmetricKey.tag,
      },
      { name: "AES-GCM", length: 256, hash: "SHA-256" },
      true,
      ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return encryptedSymKey;
  }

  public static async encryptByPublicKey(
    symmetricKey: CryptoKey,
    publicKey: RSA.PublicKey
  ): Promise<JsonWebEncryption> {
    const encryptedSymKey = await publicKey.wrapKey(symmetricKey);

    return {
      kid: "pub",
      enc: "A256GCM",
      cty: "jwk+json",
      data: encryptedSymKey,
      alg: "RSA-OAEP-256",
    };
  }

  public static async decryptByPrivateKey(
    encryptedSymmetricKey: JsonWebEncryption,
    privateKey: RSA.PrivateKey
  ): Promise<CryptoKey> {
    const encryptedSymKey = await privateKey.unwrapKey(
      encryptedSymmetricKey.data,
      { name: "AES-GCM", length: 256, hash: "SHA-256" },
      ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return encryptedSymKey;
  }
}
