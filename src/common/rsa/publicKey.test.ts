import { generateKeyPair } from "./generateKeyPair";
import { parsePublicKey, stringifyPublicKey } from "./publicKey";

describe("public key", () => {
  it("should stringify and parse the public key", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const stringifiedPublicKey = await stringifyPublicKey(publicKey);

    const parsedPublicKey = await parsePublicKey(stringifiedPublicKey);

    const data = JSON.stringify({ v1: "test" });
    const encryptedData = await parsedPublicKey.encrypt(data);

    expect(privateKey.decrypt(encryptedData)).resolves.toEqual(data);
  });
});
