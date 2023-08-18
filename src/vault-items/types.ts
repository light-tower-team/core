import { Json } from "@common/json";
import { JsonWebEncryption } from "@common/jwe";

export type VaultItem<TOverview extends Json, TDetails extends Json> = {
  overview: TOverview;
  details: TDetails;
};

export type EncryptedVaultItem<TOverview extends Json> = {
  overview: TOverview;
  encDetails: JsonWebEncryption;
};
