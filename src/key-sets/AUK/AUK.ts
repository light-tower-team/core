import { _crypto } from "@common/crypto";

export class AUK {
  public static async derive(masterPassword: string): Promise<CryptoKey> {
    const accountUnlockKey = await _crypto.subtle.importKey(
      "raw",
      Buffer.from(masterPassword, "utf-8"),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return accountUnlockKey;
  }
}
