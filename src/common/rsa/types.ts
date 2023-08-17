import { AES } from "@common/aes";
import { _crypto } from "@common/crypto";
import { JsonWebEncryption } from "@common/jwe";

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

  public async wrapKey(key: AES): Promise<JsonWebEncryption> {
    const encryptedKey = await _crypto.subtle.wrapKey("jwk", key.origin, this.origin, this.origin.algorithm);

    return {
      kid: "aes",
      cty: "jwk+json",
      enc: "A256GCM",
      data: Buffer.from(encryptedKey).toString("base64"),
      alg: "RSA-OAEP-256",
    };
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

  public async unwrapKey<TEncKey extends AES>(encryptedKey: JsonWebEncryption): Promise<TEncKey> {
    const origin = await _crypto.subtle.unwrapKey(
      "jwk",
      Buffer.from(encryptedKey.data, "base64"),
      this.origin,
      this.origin.algorithm,
      { name: "AES-GCM", length: 256, hash: "SHA-256" },
      true,
      ["wrapKey", "unwrapKey", "decrypt", "encrypt"]
    );

    return new AES(origin) as unknown as TEncKey;
  }
}

export type CryptoKeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};
