import { _crypto } from "@common/crypto";

import { normalizeMasterPassword } from "./helpers/normalize-master-password";

export class AUK {
  public static async derive(masterPassword: string): Promise<CryptoKey> {
    const normalizedMasterPassword = normalizeMasterPassword(masterPassword);

    const accountUnlockKey = await _crypto.subtle.importKey(
      "raw",
      Buffer.from(normalizedMasterPassword, "utf-8"),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return accountUnlockKey;
  }
}
