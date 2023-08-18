import { AES } from "@common/aes";

import { KeySet } from "./types";

export async function createKeySet(): Promise<KeySet> {
  const symmetricKey = await AES.generate();

  return {
    symmetricKey,
  };
}
