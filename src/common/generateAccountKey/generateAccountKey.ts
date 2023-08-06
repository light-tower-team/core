import { generateCryptoRandomString } from "../generateCryptoRandomString";
import {
  ACCOUNT_SALT_REGEX,
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
 *  @param {string} salt some unique string
 *  @returns {string} the generated account key
 *  @example
 *  generateAccountKey("A3", "00SALT"); // A3-00SALT-798JRY-LJVD4-23DC2-86TVM-H43EB
 */
export function generateAccountKey(versionCode: string, salt: string) {
  const formattedVersionCode = versionCode.trim();
  const formattedSalt = salt.trim();

  if (formattedVersionCode.length !== ACCOUNT_VERSION_LENGTH) {
    throw new IncorrectAccountVersionLengthError(formattedVersionCode);
  }

  if (formattedSalt.length > MAX_ACCOUNT_KEY_SNIPPET_LENGTH) {
    throw new IncorrectAccountSecretLengthError(formattedSalt, MAX_ACCOUNT_KEY_SNIPPET_LENGTH);
  }

  if (!ACCOUNT_VERSION_REGEX.test(formattedVersionCode)) {
    throw new IncorrectAccountVersionError(formattedVersionCode);
  }

  if (!ACCOUNT_SALT_REGEX.test(formattedSalt)) {
    throw new IncorrectAccountSecretError(formattedSalt);
  }

  const randomStringLength = MAX_ACCOUNT_KEY_SNIPPET_LENGTH - formattedSalt.length;
  const randomString = generateCryptoRandomString(randomStringLength);

  return toFormatKey(formattedVersionCode.toUpperCase(), formattedSalt.toUpperCase() + randomString);
}
