import { _crypto } from "@common/crypto";

export class PublicKey {
  public constructor(public readonly origin: CryptoKey) {}

  public async encrypt(plaintext: string) {
    const encryptedData = await _crypto.subtle.encrypt(
      this.origin.algorithm,
      this.origin,
      Buffer.from(plaintext, "utf-8")
    );

    return Buffer.from(encryptedData).toString("base64");
  }

  public async wrapKey(key: CryptoKey): Promise<string> {
    const encryptedData = await _crypto.subtle.wrapKey("jwk", key, this.origin, this.origin.algorithm);

    return Buffer.from(encryptedData).toString("base64");
  }
}

export class PrivateKey {
  public constructor(public readonly origin: CryptoKey) {}

  public async decrypt(encryptedData: string): Promise<string> {
    const decryptedData = await _crypto.subtle.decrypt(
      this.origin.algorithm,
      this.origin,
      Buffer.from(encryptedData, "base64")
    );

    return Buffer.from(decryptedData).toString("utf-8");
  }

  public unwrapKey(
    encryptedKey: string,
    unwrappedKeyAlgorithm:
      | AlgorithmIdentifier
      | RsaHashedImportParams
      | EcKeyImportParams
      | HmacImportParams
      | AesKeyAlgorithm,
    keyUsages: KeyUsage[]
  ): Promise<CryptoKey> {
    return _crypto.subtle.unwrapKey(
      "jwk",
      Buffer.from(encryptedKey, "base64"),
      this.origin,
      this.origin.algorithm,
      unwrappedKeyAlgorithm,
      true,
      keyUsages
    );
  }
}

export type CryptoKeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};
