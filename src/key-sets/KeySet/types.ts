import { AES } from "@common/aes";
import { JsonWebEncryption } from "@common/jwe";

export type EncryptedKeySet = {
  encSymmetricKey: JsonWebEncryption;
};

export type KeySet = {
  symmetricKey: AES;
};
