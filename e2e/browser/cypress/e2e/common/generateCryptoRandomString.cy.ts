import { Common } from "@light-tower-team/core";

describe("generateCryptoRandomString", () => {
  it("should generate crypto random string", () => {
    const str = Common.generateCryptoRandomString();

    expect(str).have.length(32);
  });
});
