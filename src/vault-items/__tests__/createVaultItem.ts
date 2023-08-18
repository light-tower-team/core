import { generateCryptoRandomString } from "@common/generateCryptoRandomString";

import { VaultItem } from "../types";

export function createVaultItem(): VaultItem<{ name: string; desc: string }, { fields: [] }> {
  return {
    overview: {
      name: generateCryptoRandomString(),
      desc: generateCryptoRandomString(),
    },
    details: {
      fields: [],
    },
  };
}
