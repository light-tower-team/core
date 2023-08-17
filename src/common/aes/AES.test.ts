import { generateCryptoRandomString, RSA } from "..";
import { AES } from "./AES";

describe("AES", () => {
  it("should encrypt and decrypt data", async () => {
    const data = JSON.stringify({ msg: "test" });

    const key = await AES.generate();

    const encryptedData = await key.encrypt(data);
    const decryptedData = await key.decrypt(encryptedData);

    expect(decryptedData).toEqual(data);
  });

  it("should wrap and unwrap AES key", async () => {
    const [key, keyToWrap] = await Promise.all([AES.generate(), AES.generate()]);

    const wrappedKey = await key.wrapKey(keyToWrap);
    const unwrappedKey = await key.unwrapKey(wrappedKey);

    expect(unwrappedKey).toEqual(keyToWrap);
  });

  it("should wrap and unwrap RSA private key", async () => {
    const [key, { publicKey, privateKey }] = await Promise.all([AES.generate(), RSA.generateKeyPair()]);

    const wrappedPrivateKey = await key.wrapKey(privateKey);
    const unwrappedPrivateKey = await key.unwrapKey<RSA.PrivateKey>(wrappedPrivateKey);

    const data = generateCryptoRandomString();
    const encryptedData = await publicKey.encrypt(data);

    expect(unwrappedPrivateKey.decrypt(encryptedData)).resolves.toEqual(data);
  });
});
