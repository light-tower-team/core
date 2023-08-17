import { AES } from "@common/aes";
import { _crypto } from "@common/crypto";
import { generateCryptoRandomSalt } from "@common/generateCryptoRandomSalt";
import { JsonWebEncryption } from "@common/jwe";
import { pbkdf2 } from "@common/pbkdf2";
import { RSA } from "@common/rsa";

export class SymmetricKey {
  public static async generate(): Promise<AES> {
    return AES.generate();
  }

  public static async encryptByAUK(symmetricKey: AES, auk: CryptoKey): Promise<JsonWebEncryption> {
    const p2s = generateCryptoRandomSalt();
    const p2c = 650_000;

    const accountUnlockKey = await pbkdf2(auk, p2s, p2c);

    const encryptedSymmetricKey = await accountUnlockKey.wrapKey(symmetricKey);

    return {
      ...encryptedSymmetricKey,
      kid: "mp",
      p2s: Buffer.from(p2s).toString("base64"),
      alg: "PBKDF2-HS256",
      p2c,
    };
  }

  public static async decryptByAUK(symmetricKey: JsonWebEncryption, auk: CryptoKey): Promise<AES> {
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

    const accountUnlockKey = await pbkdf2(auk, Buffer.from(symmetricKey.p2s, "base64"), symmetricKey.p2c);

    const encryptedSymKey = await accountUnlockKey.unwrapKey<AES>(symmetricKey);

    return encryptedSymKey;
  }

  public static async encryptByPublicKey(symmetricKey: AES, publicKey: RSA.PublicKey): Promise<JsonWebEncryption> {
    return publicKey.wrapKey(symmetricKey);
  }

  public static async decryptByPrivateKey(
    encryptedSymmetricKey: JsonWebEncryption,
    privateKey: RSA.PrivateKey
  ): Promise<AES> {
    return privateKey.unwrapKey(encryptedSymmetricKey);
  }
}
