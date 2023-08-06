import { BigNumber } from "../big-number";
import { H } from "../params";
import { Session } from "../types";

export class IncorrectServerSessionProofError extends Error {
  public constructor() {
    super("Server provided session proof is invalid");

    Error.captureStackTrace(this, IncorrectServerSessionProofError);
  }
}
/**
 * Verify session
 * @param {string} clientPublicEphemeral
 * @param {Session} clientSession
 * @param {string} serverSessionProof
 * @throws Throws an error if the session proof is invalid
 */
export async function verifySession(
  clientPublicEphemeral: string,
  clientSession: Session,
  serverSessionProof: string
): Promise<void> {
  const A = BigNumber.fromHex(clientPublicEphemeral);
  const M = BigNumber.fromHex(clientSession.proof);
  const K = BigNumber.fromHex(clientSession.key);

  const expected = await H(A, M, K);
  const actual = BigNumber.fromHex(serverSessionProof);

  if (!actual.equals(expected)) {
    throw new IncorrectServerSessionProofError();
  }
}
