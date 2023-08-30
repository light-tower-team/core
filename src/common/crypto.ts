let _crypto: Crypto;

if (typeof window !== "undefined" && window.crypto) {
  // Native crypto from window (Browser)
  _crypto = window.crypto;
} else if (typeof self !== "undefined" && self.crypto) {
  // Native crypto in web worker (Browser)
  _crypto = self.crypto;
} else if (typeof process !== "undefined" && process.versions && process.versions.node) {
  // Native crypto import via import (NodeJS)

  // it needs to prevent vite optimization for browser compatibility
  const nodeCryptoPath = "node:crypto";

  (async () => {
    const { webcrypto } = await import(nodeCryptoPath);

    _crypto = webcrypto as Crypto;
  })();
}

export { _crypto };
