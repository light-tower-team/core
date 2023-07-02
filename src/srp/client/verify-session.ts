import { BigNumber } from "../big-number.js";
import { H } from "../params.js";
import { Session } from "../types.js";

/**
 * Verify session
 * @param {string} clientPublicEphemeral
 * @param {Session} clientSession
 * @param {string} serverSessionProof
 * @throws Throws an error if the session proof is invalid
 */
export function verifySession(clientPublicEphemeral: string, clientSession: Session, serverSessionProof: string): void {
  const A = BigNumber.fromHex(clientPublicEphemeral);
  const M = BigNumber.fromHex(clientSession.proof);
  const K = BigNumber.fromHex(clientSession.key);

  const expected = H(A, M, K);
  const actual = BigNumber.fromHex(serverSessionProof);

  if (!actual.equals(expected)) {
    throw new Error("Server provided session proof is invalid");
  }
}
