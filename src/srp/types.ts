export type Ephemeral = {
  public: string;
  secret: string;
};

export type Session = {
  key: string;
  proof: string;
};

export type Verifier = {
  verifier: string;
  privateKey: string;
  salt: string;
};
