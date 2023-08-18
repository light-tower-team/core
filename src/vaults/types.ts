import { AES } from "@common/aes";
import { Json } from "@common/json";
import { JsonWebEncryption } from "@common/jwe";

export type Vault<TOverview extends Json = Json> = {
  key: AES;
  overview: TOverview;
};

export type EncryptedVault<TOverview extends Json = Json> = {
  encKey: JsonWebEncryption;
  overview: TOverview;
};
