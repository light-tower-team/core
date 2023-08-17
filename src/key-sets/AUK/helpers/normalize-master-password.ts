import unorm from "unorm";

/**
 *
 * @param masterPassword
 * @returns
 * @link https://github.com/walling/unorm#nodejs-example
 */
export function normalizeMasterPassword(masterPassword: string): string {
  const trimmedMasterPassword = masterPassword.trim();

  const combiningCharacters = /[\u0300-\u036F]/g;

  return unorm.nfkd(trimmedMasterPassword).replace(combiningCharacters, "");
}
