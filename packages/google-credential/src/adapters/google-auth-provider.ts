import {
  type GoogleCredentialOptions,
  type GoogleCredentialResult,
  signInWithGoogleCredential,
} from "../index";

const BASE64_URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

type ExpoCryptoModule = {
  CryptoDigestAlgorithm: {
    SHA256: string;
  };
  CryptoEncoding: {
    HEX: string;
  };
  digestStringAsync(
    algorithm: string,
    value: string,
    options: { encoding: string },
  ): Promise<string>;
  getRandomBytes(byteCount: number): Uint8Array;
};

type OptionalRequire = (id: string) => unknown;

declare const require: OptionalRequire | undefined;

function getExpoCrypto() {
  if (typeof require !== "function") {
    return null;
  }

  try {
    return require("expo-crypto") as ExpoCryptoModule;
  } catch {
    return null;
  }
}

function getRandomBytes(byteCount: number) {
  const bytes = new Uint8Array(byteCount);
  const webCrypto = globalThis.crypto;

  if (webCrypto?.getRandomValues) {
    webCrypto.getRandomValues(bytes);
    return bytes;
  }

  const expoCrypto = getExpoCrypto();

  if (expoCrypto) {
    return expoCrypto.getRandomBytes(byteCount);
  }

  throw new Error(
    "Google auth provider adapter requires crypto.getRandomValues or expo-crypto.",
  );
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string) {
  const subtle = globalThis.crypto?.subtle;

  if (subtle) {
    const encodedValue = new TextEncoder().encode(value);
    const digest = await subtle.digest("SHA-256", encodedValue);

    return toHex(new Uint8Array(digest));
  }

  const expoCrypto = getExpoCrypto();

  if (expoCrypto) {
    return expoCrypto.digestStringAsync(
      expoCrypto.CryptoDigestAlgorithm.SHA256,
      value,
      { encoding: expoCrypto.CryptoEncoding.HEX },
    );
  }

  throw new Error(
    "Google auth provider adapter requires crypto.subtle.digest or expo-crypto.",
  );
}

export type GoogleAuthProviderExchangeInput = {
  credential: GoogleCredentialResult;
  idToken: string;
  nonce: string;
};

export type GoogleAuthProviderExchange<TResult> = (
  input: GoogleAuthProviderExchangeInput,
) => Promise<TResult>;

export type SignInWithGoogleAuthProviderOptions<TResult> = {
  credentialOptions: GoogleCredentialOptions;
  exchangeCredential: GoogleAuthProviderExchange<TResult>;
};

function toBase64Url(bytes: Uint8Array) {
  let output = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const hasSecond = index + 1 < bytes.length;
    const hasThird = index + 2 < bytes.length;
    const chunk = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);

    output += BASE64_URL_ALPHABET[(chunk >> 18) & 63];
    output += BASE64_URL_ALPHABET[(chunk >> 12) & 63];

    if (hasSecond) {
      output += BASE64_URL_ALPHABET[(chunk >> 6) & 63];
    }

    if (hasThird) {
      output += BASE64_URL_ALPHABET[chunk & 63];
    }
  }

  return output;
}

async function createOidcNoncePair() {
  const nonce = toBase64Url(getRandomBytes(32));
  const hashedNonce = await sha256Hex(nonce);

  return { nonce, hashedNonce };
}

export async function signInWithGoogleAuthProvider<TResult>({
  credentialOptions,
  exchangeCredential,
}: SignInWithGoogleAuthProviderOptions<TResult>) {
  const { nonce, hashedNonce } = await createOidcNoncePair();
  const credential = await signInWithGoogleCredential({
    ...credentialOptions,
    nonce: credentialOptions.nonce ?? hashedNonce,
  });

  return exchangeCredential({
    credential,
    idToken: credential.idToken,
    nonce,
  });
}
