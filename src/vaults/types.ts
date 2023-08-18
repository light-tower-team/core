import { AES } from "@common/aes";
import { JSON } from "@common/json";
import { JsonWebEncryption } from "@common/jwe";

export type Vault<TOverview extends JSON> = {
  key: AES;
  overview: TOverview;
};

export type EncryptedVault<TOverview extends JSON> = {
  encKey: JsonWebEncryption;
  overview: TOverview;
};
