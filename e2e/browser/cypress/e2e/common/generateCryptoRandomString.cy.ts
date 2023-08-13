import { common } from "@light-tower-team/core";

describe("generateCryptoRandomString", () => {
  it("should generate crypto random string", () => {
    const str = common.generateCryptoRandomString();

    expect(str).have.length(32);
  });
});
