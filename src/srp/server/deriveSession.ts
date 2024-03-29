import { BigNumber } from "../big-number";
import { g, H, k, N } from "../params";
import type { Session } from "../types";

/**
 * Device session
 * @param {string} serverSecretEphemeralKey
 * @param {string} clientPublicEphemeralKey
 * @param {string} salt
 * @param {string} secretKey
 * @param {string} verifier
 * @param {string} clientSessionProofKey
 * @return {Session} session
 */
export async function deriveSession(
  serverSecretEphemeralKey: string,
  clientPublicEphemeralKey: string,
  salt: string,
  secretKey: string,
  verifier: string,
  clientSessionProofKey: string
): Promise<Session> {
  const b = BigNumber.fromHex(serverSecretEphemeralKey);
  const A = BigNumber.fromHex(clientPublicEphemeralKey);
  const s = BigNumber.fromHex(salt);
  const I = secretKey;
  const v = BigNumber.fromHex(verifier);

  const B = k.multiply(v).add(g.modPow(b, N)).mod(N);

  if (A.mod(N).equals(BigNumber.ZERO)) {
    throw new Error("The client sent an invalid public ephemeral");
  }

  const u = await H(A, B);

  const S = A.multiply(v.modPow(u, N)).modPow(b, N);

  const K = await H(S);

  const M = await H((await H(N)).xor(await H(g)), await H(I), s, A, B, K);

  const expected = M;
  const actual = BigNumber.fromHex(clientSessionProofKey);

  if (!actual.equals(expected)) {
    throw new Error("Client provided session proof is invalid");
  }

  const P = await H(A, M, K);

  return {
    key: K.toHex(),
    proof: P.toHex(),
  };
}
