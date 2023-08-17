import { AES } from "@common/aes";
import { _crypto } from "@common/crypto";
import { JsonWebEncryption } from "@common/jwe";
import { RSA } from "@common/rsa";

export class PrivateKey {
  public static async encryptBySymmetricKey(privateKey: RSA.PrivateKey, symmetricKey: AES): Promise<JsonWebEncryption> {
    return symmetricKey.wrapKey(privateKey);
  }

  public static async decryptBySymmetricKey(
    encryptedPrimaryKey: JsonWebEncryption,
    symmetricKey: AES
  ): Promise<RSA.PrivateKey> {
    return symmetricKey.unwrapKey(encryptedPrimaryKey);
  }
}
