import { generateCryptoRandomString } from "../generateCryptoRandomString";
import { MAX_ACCOUNT_KEY_SNIPPET_LENGTH } from "./constants";
import {
  IncorrectAccountSecretError,
  IncorrectAccountSecretLengthError,
  IncorrectAccountVersionError,
  IncorrectAccountVersionLengthError,
} from "./errors";
import { generateAccountKey } from "./generateAccountKey";

describe("generateAccountKey", () => {
  it("should generate account key", () => {
    const versionCode = "d5";
    const salt = "00salt";

    const accountKey = generateAccountKey(versionCode, salt);
    const accountKeySnippets = accountKey.split("-");

    expect(accountKeySnippets.at(0)).toEqual(versionCode.toUpperCase());
    expect(accountKeySnippets.at(1)).toEqual(salt.toUpperCase());
    expect(accountKeySnippets.length).toEqual(6);
  });

  it.each`
    versionCode  | salt      | Error
    ${"d"}       | ${"salt"} | ${IncorrectAccountVersionLengthError}
    ${"d45asd6"} | ${"salt"} | ${IncorrectAccountVersionLengthError}
    ${""}        | ${"salt"} | ${IncorrectAccountVersionLengthError}
    ${"5-"}      | ${"salt"} | ${IncorrectAccountVersionError}
  `(
    "should throw an $Error error while generate account key by incorrect account version: $versionCode",
    ({ versionCode, salt, Error }) => {
      expect(() => generateAccountKey(versionCode, salt)).toThrowError(new Error(versionCode));
    }
  );

  it.each`
    versionCode | salt                              | Error                                | args
    ${"a1"}     | ${generateCryptoRandomString(50)} | ${IncorrectAccountSecretLengthError} | ${[MAX_ACCOUNT_KEY_SNIPPET_LENGTH]}
    ${"a1"}     | ${"s_/\\ecret"}                   | ${IncorrectAccountSecretError}       | ${[]}
  `(
    "should throw an $Error error while generate account key by incorrect account salt: $salt",
    ({ versionCode, salt, Error, args }) => {
      expect(() => generateAccountKey(versionCode, salt)).toThrowError(new Error(salt, ...args));
    }
  );
});
