import type { GoogleCredentialOptions } from "../types";
import { signInWithGoogleAuthProvider } from "./google-auth-provider";

export type SupabaseGoogleIdTokenExchange<TResult> = (input: {
  idToken: string;
  nonce: string;
}) => Promise<TResult>;

export type SupabaseGoogleAuthAdapterOptions<TResult> = {
  credentialOptions: GoogleCredentialOptions;
  exchangeGoogleIdToken: SupabaseGoogleIdTokenExchange<TResult>;
};

export function createSupabaseGoogleAuthAdapter<TResult>({
  credentialOptions,
  exchangeGoogleIdToken,
}: SupabaseGoogleAuthAdapterOptions<TResult>) {
  return function signInWithGoogleUsingSupabase() {
    return signInWithGoogleAuthProvider({
      credentialOptions,
      exchangeCredential: ({ idToken, nonce }) =>
        exchangeGoogleIdToken({
          idToken,
          nonce,
        }),
    });
  };
}
