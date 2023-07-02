import { generateAccountKey, generateCryptoRandomString } from "@common/index";
import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import * as srp from "./src";

describe("[SRP] ...", () => {
  it("should correct generate verifier in the client", () => {
    const TEST_ACCOUNT_SECRET = generateCryptoRandomString(16);
    const TEST_ACCOUNT_VERSION = "A1";
    const TEST_ACCOUNT_KEY = generateAccountKey(TEST_ACCOUNT_VERSION, TEST_ACCOUNT_SECRET);
    const TEST_PASSWORD = faker.internet.password();

    const verifier = srp.client.deriveVerifier(TEST_ACCOUNT_KEY, TEST_PASSWORD);

    expect(typeof verifier.salt).toEqual("string");
    expect(typeof verifier.verifier).toEqual("string");
    expect(typeof verifier.privateKey).toEqual("string");
    expect(TEST_ACCOUNT_KEY).toStrictEqual(TEST_ACCOUNT_KEY.toUpperCase());

    const trimmedAccountId = TEST_ACCOUNT_KEY.split("-").join("").toUpperCase();
    const trimmedAccountSecret = TEST_ACCOUNT_SECRET.split("-").join("").toUpperCase();

    expect(trimmedAccountId).not.toStrictEqual(TEST_ACCOUNT_KEY);
    expect(trimmedAccountId.slice(0, 2)).toEqual(TEST_ACCOUNT_VERSION);
    expect(trimmedAccountId.slice(2, 12)).toEqual(trimmedAccountSecret.slice(0, 10));
  });

  it("should correct generate verifier in the server", () => {
    // client
    const TEST_ACCOUNT_SECRET = generateCryptoRandomString(16);
    const TEST_ACCOUNT_VERSION = "A1";
    const TEST_ACCOUNT_KEY = generateAccountKey(TEST_ACCOUNT_VERSION, TEST_ACCOUNT_SECRET);
    const TEST_PASSWORD = faker.internet.password();

    const { salt, verifier, privateKey } = srp.client.deriveVerifier(TEST_ACCOUNT_KEY, TEST_PASSWORD);

    const clientEphemeral = srp.client.generateEphemeralKeyPair();

    expect(typeof clientEphemeral.public).toEqual("string");
    expect(typeof clientEphemeral.secret).toEqual("string");

    // server

    const serverEphemeral = srp.server.generateEphemeralKeyPair(verifier);

    expect(typeof serverEphemeral.public).toEqual("string");
    expect(typeof serverEphemeral.secret).toEqual("string");

    // client

    const clientSession = srp.client.deriveSession(
      clientEphemeral.secret,
      serverEphemeral.public,
      salt,
      TEST_ACCOUNT_KEY,
      privateKey
    );

    expect(typeof clientSession.key).toEqual("string");
    expect(typeof clientSession.proof).toEqual("string");

    // server

    const serverSession = srp.server.deriveSession(
      serverEphemeral.secret,
      clientEphemeral.public,
      salt,
      TEST_ACCOUNT_KEY,
      verifier,
      clientSession.proof
    );

    expect(typeof serverSession.key).toEqual("string");
    expect(typeof serverSession.proof).toEqual("string");

    // client

    srp.client.verifySession(clientEphemeral.public, clientSession, serverSession.proof);
  });

  it("should throw error while verifying session with invalid proof key", () => {
    // client
    const TEST_ACCOUNT_SECRET = generateCryptoRandomString(16);
    const TEST_ACCOUNT_VERSION = "A1";
    const TEST_ACCOUNT_KEY = generateAccountKey(TEST_ACCOUNT_VERSION, TEST_ACCOUNT_SECRET);
    const TEST_PASSWORD = faker.internet.password();

    const { salt, verifier, privateKey } = srp.client.deriveVerifier(TEST_ACCOUNT_KEY, TEST_PASSWORD);

    const clientEphemeral = srp.client.generateEphemeralKeyPair();

    // server

    const serverEphemeral = srp.server.generateEphemeralKeyPair(verifier);

    // client

    const clientSession = srp.client.deriveSession(
      clientEphemeral.secret,
      serverEphemeral.public,
      salt,
      TEST_ACCOUNT_KEY,
      privateKey
    );

    // server

    const serverSession = srp.server.deriveSession(
      serverEphemeral.secret,
      clientEphemeral.public,
      salt,
      TEST_ACCOUNT_KEY,
      verifier,
      clientSession.proof
    );

    // client

    expect(() => srp.client.verifySession(faker.string.uuid(), clientSession, serverSession.proof)).toThrowError();
  });
});
