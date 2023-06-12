import { generateCryptoRandomString } from "../generateCryptoRandomString";
import {
  ACCOUNT_SECRET_REGEX,
  ACCOUNT_VERSION_LENGTH,
  ACCOUNT_VERSION_REGEX,
  MAX_ACCOUNT_KEY_SNIPPET_LENGTH,
} from "./constants";
import {
  IncorrectAccountSecretError,
  IncorrectAccountSecretLengthError,
  IncorrectAccountVersionError,
  IncorrectAccountVersionLengthError,
} from "./errors";
import { toFormatKey } from "./utils/toFormatKey";

/**
 *  Generates the account unique key
 *  @param {string} versionCode the account version consisting of two characters: `A1`
 *  @param {string} secret any account unique secret
 *  @returns {string} the generated account key
 *  @example
 *  ```ts
 *  generateAccountKey("A3", "secret"); // A3-ASWWYB-798JRY-LJVD4-23DC2-86TVM-H43EB
 *  ```
 */
export function generateAccountKey(versionCode: string, secret: string) {
  const formattedVersionCode = versionCode.trim();
  const formattedSecret = secret.trim();

  if (formattedVersionCode.length !== ACCOUNT_VERSION_LENGTH) {
    throw new IncorrectAccountVersionLengthError(formattedVersionCode);
  }

  if (formattedSecret.length > MAX_ACCOUNT_KEY_SNIPPET_LENGTH) {
    throw new IncorrectAccountSecretLengthError(formattedSecret, MAX_ACCOUNT_KEY_SNIPPET_LENGTH);
  }

  if (!ACCOUNT_VERSION_REGEX.test(formattedVersionCode)) {
    throw new IncorrectAccountVersionError(formattedVersionCode);
  }

  if (!ACCOUNT_SECRET_REGEX.test(formattedSecret)) {
    throw new IncorrectAccountSecretError(formattedSecret);
  }

  const randomStringLength = MAX_ACCOUNT_KEY_SNIPPET_LENGTH - formattedSecret.length;
  const randomString = generateCryptoRandomString(randomStringLength);

  return toFormatKey(formattedVersionCode.toUpperCase(), formattedSecret.toUpperCase() + randomString);
}
