export interface Ephemeral {
  public: string;
  secret: string;
}

export interface Session {
  key: string;
  proof: string;
}

export interface Verifier {
  verifier: string;
  privateKey: string;
  salt: string;
}
