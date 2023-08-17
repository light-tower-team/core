import { AES } from "@common/aes";

import { KeySet } from "./types";

export function createKeySet(sourceKey: AES): KeySet {
  return {
    symmetricKey: sourceKey,
  };
}
