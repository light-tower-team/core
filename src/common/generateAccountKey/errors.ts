export class IncorrectAccountVersionLengthError extends Error {
  constructor(versionCode: string) {
    super(`The "${versionCode}" version code is less than two characters`);

    Object.setPrototypeOf(this, IncorrectAccountVersionError.prototype);
  }
}

export class IncorrectAccountVersionError extends Error {
  constructor(versionCode: string) {
    super(`The "${versionCode}" account version contains not valid characters`);

    Object.setPrototypeOf(this, IncorrectAccountVersionError.prototype);
  }
}

export class IncorrectAccountSecretLengthError extends Error {
  constructor(secret: string, length: number) {
    super(`The "${secret}" account secret length is greater than ${length} length`);

    Object.setPrototypeOf(this, IncorrectAccountVersionError.prototype);
  }
}

export class IncorrectAccountSecretError extends Error {
  constructor(secret: string) {
    super(`The "${secret}" account secret contains not valid characters`);

    Object.setPrototypeOf(this, IncorrectAccountVersionError.prototype);
  }
}
