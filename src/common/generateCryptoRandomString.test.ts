import { generateCryptoRandomString } from "./generateCryptoRandomString";

describe("[generateCryptoRandomString]", () => {
  it("should generate crypto radom string", () => {
    const CRYPTO_STRING_LEN = 16;

    const cryptoString = generateCryptoRandomString(CRYPTO_STRING_LEN);

    expect(cryptoString).toHaveLength(CRYPTO_STRING_LEN);
  });
});
