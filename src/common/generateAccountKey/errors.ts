export class IncorrectAccountVersionLengthError extends Error {
  public constructor(versionCode: string) {
    super(`The "${versionCode}" version code is less than two characters`);

    Error.captureStackTrace(this, IncorrectAccountVersionLengthError);
  }
}

export class IncorrectAccountVersionError extends Error {
  public constructor(versionCode: string) {
    super(`The "${versionCode}" account version contains not valid characters`);

    Error.captureStackTrace(this, IncorrectAccountVersionError);
  }
}

export class IncorrectAccountSecretLengthError extends Error {
  public constructor(secret: string, length: number) {
    super(`The "${secret}" account secret length is greater than ${length} length`);

    Error.captureStackTrace(this, IncorrectAccountSecretLengthError);
  }
}

export class IncorrectAccountSecretError extends Error {
  public constructor(secret: string) {
    super(`The "${secret}" account secret contains not valid characters`);

    Error.captureStackTrace(this, IncorrectAccountSecretError);
  }
}
