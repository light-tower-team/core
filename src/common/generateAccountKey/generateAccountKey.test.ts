import { describe, expect, it } from "vitest";

import { generateCryptoRandomString } from "../generateCryptoRandomString";
import { generateAccountKey } from ".";
import { MAX_ACCOUNT_KEY_SNIPPET_LENGTH } from "./constants";
import {
  IncorrectAccountSecretError,
  IncorrectAccountSecretLengthError,
  IncorrectAccountVersionError,
  IncorrectAccountVersionLengthError,
} from "./errors";

describe("generateAccountKey", () => {
  it("should generate account key", () => {
    const versionCode = "d5";
    const secret = "secret";

    const accountKey = generateAccountKey(versionCode, secret);
    const accountKeySnippets = accountKey.split("-");

    expect(accountKeySnippets.at(0)).toEqual(versionCode.toUpperCase());
    expect(accountKeySnippets.at(1)).toEqual(secret.toUpperCase());
    expect(accountKeySnippets.length).toEqual(6);
  });

  it.each`
    versionCode  | secret      | Error
    ${"d"}       | ${"secret"} | ${IncorrectAccountVersionLengthError}
    ${"d45asd6"} | ${"secret"} | ${IncorrectAccountVersionLengthError}
    ${""}        | ${"secret"} | ${IncorrectAccountVersionLengthError}
    ${"5-"}      | ${"secret"} | ${IncorrectAccountVersionError}
  `(
    "should throw an $Error error while generate account key by incorrect account version: $versionCode",
    ({ versionCode, secret, Error }) => {
      expect(() => generateAccountKey(versionCode, secret)).toThrowError(new Error(versionCode));
    }
  );

  it.each`
    versionCode | secret                            | Error                                | args
    ${"a1"}     | ${generateCryptoRandomString(50)} | ${IncorrectAccountSecretLengthError} | ${[MAX_ACCOUNT_KEY_SNIPPET_LENGTH]}
    ${"a1"}     | ${"s_/\\ecret"}                   | ${IncorrectAccountSecretError}       | ${[]}
  `(
    "should throw an $Error error while generate account key by incorrect account secret: $secret",
    ({ versionCode, secret, Error, args }) => {
      expect(() => generateAccountKey(versionCode, secret)).toThrowError(new Error(secret, ...args));
    }
  );
});
