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

export type SupabaseAuthClient<TResult> = {
  auth: {
    signInWithIdToken(input: {
      provider: "google";
      token: string;
      nonce: string;
    }): Promise<TResult>;
  };
};

export type SupabaseGoogleAuthOptions<TResult> = GoogleCredentialOptions & {
  supabase: SupabaseAuthClient<TResult>;
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

export function createSupabaseGoogleAuth<TResult>({
  supabase,
  ...credentialOptions
}: SupabaseGoogleAuthOptions<TResult>) {
  return createSupabaseGoogleAuthAdapter({
    credentialOptions,
    exchangeGoogleIdToken: ({ idToken, nonce }) =>
      supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
        nonce,
      }),
  });
}
