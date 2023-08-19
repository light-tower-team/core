/**
 * @link https://github.com/walling/unorm#nodejs-example
 */
export function normalizeMasterPassword(masterPassword: string): string {
  const trimmedMasterPassword = masterPassword.trim();

  const combiningCharacters = /[\u0300-\u036F]/g;

  return trimmedMasterPassword.normalize("NFKD").replace(combiningCharacters, "");
}
