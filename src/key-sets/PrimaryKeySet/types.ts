import { AES } from "@common/aes";
import { JsonWebEncryption } from "@common/jwe";
import { RSA } from "@common/rsa";

export type EncryptedPrimaryKeySet = {
  encSymmetricKey: JsonWebEncryption;
  encPrivateKey: JsonWebEncryption;
  publicKey: JsonWebKey;
};

export type PrimaryKeySet = {
  auk: CryptoKey;
  publicKey: RSA.PublicKey;
  privateKey: RSA.PrivateKey;
  symmetricKey: AES;
};
