import { ACCOUNT_KEY_SNIPPET_LENGTH } from "../constants";

export function toFormatKey(versionCode: string, secret: string): string {
  const parts: string[] = [versionCode];

  for (let i = 0; i < secret.length; i += ACCOUNT_KEY_SNIPPET_LENGTH) {
    parts.push(secret.slice(i, i + ACCOUNT_KEY_SNIPPET_LENGTH));
  }

  return parts.join("-");
}
