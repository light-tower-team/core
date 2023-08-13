export type JsonWebEncryption = {
  /**
   * The key ID parameter is used to match a specific key.
   */
  kid: string;
  /**
   * The content Type
   * The "cty" (content type) Header Parameter is used by JWE applications
   * to declare the media type of the secured content
   */
  cty: "jwk+json";
  /**
   *  The content encryption key is encrypted to the recipient using the
   *  PSE2-HS256+A128KW algorithm to produce the JWE Encrypted Key
   * @link https://www.rfc-editor.org/rfc/rfc7518#section-4.1
   */
  alg?: "RSA-OAEP-256" | "PBKDF2-HS256";
  /**
   * Authenticated encryption is performed on the plaintext using the
   * algorithm to produce the ciphertext and the Authentication Tag
   */
  enc: "A256GCM";
  data: string;
  /**
   *  The initialization vector
   */
  iv?: string;
  /**
   * The authentication Tag
   */
  tag?: number;
  /**
   *  The PBKDF2 Salt Input
   */
  p2s?: string;
  /**
   * The PBKDF2 Count
   */
  p2c?: number;
};
