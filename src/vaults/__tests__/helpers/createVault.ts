import { AES } from "@common/aes";
import { generateCryptoRandomString } from "@common/generateCryptoRandomString";
import { Vault } from "@src/vaults";

export async function createVault(): Promise<Vault<{ name: string; desc: string }>> {
  return {
    key: await AES.generate(),
    overview: { name: generateCryptoRandomString(), desc: generateCryptoRandomString() },
  };
}
