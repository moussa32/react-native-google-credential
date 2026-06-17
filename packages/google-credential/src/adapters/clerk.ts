import type { GoogleCredentialOptions } from "../types";
import { signInWithGoogleAuthProvider } from "./google-auth-provider";

export type ClerkGoogleOneTapAuthentication<TAuthenticateResult> = (input: {
  token: string;
}) => Promise<TAuthenticateResult>;

export type ClerkGoogleOneTapCallback<
  TAuthenticateResult,
  TResult,
  TCallbackOptions,
> = (
  authenticateResult: TAuthenticateResult,
  options?: TCallbackOptions,
) => Promise<TResult>;

export type ClerkGoogleAuthAdapterOptions<
  TAuthenticateResult,
  TResult = TAuthenticateResult,
  TCallbackOptions = unknown,
> = {
  credentialOptions: GoogleCredentialOptions;
  authenticateWithGoogleOneTap: ClerkGoogleOneTapAuthentication<TAuthenticateResult>;
  handleGoogleOneTapCallback?: ClerkGoogleOneTapCallback<
    TAuthenticateResult,
    TResult,
    TCallbackOptions
  >;
  callbackOptions?: TCallbackOptions;
};

export function createClerkGoogleAuthAdapter<
  TAuthenticateResult,
  TResult = TAuthenticateResult,
  TCallbackOptions = unknown,
>({
  credentialOptions,
  authenticateWithGoogleOneTap,
  handleGoogleOneTapCallback,
  callbackOptions,
}: ClerkGoogleAuthAdapterOptions<
  TAuthenticateResult,
  TResult,
  TCallbackOptions
>) {
  return function signInWithGoogleUsingClerk() {
    return signInWithGoogleAuthProvider({
      credentialOptions,
      exchangeCredential: async ({ idToken }) => {
        const authenticateResult = await authenticateWithGoogleOneTap({
          token: idToken,
        });

        if (!handleGoogleOneTapCallback) {
          return authenticateResult;
        }

        return handleGoogleOneTapCallback(authenticateResult, callbackOptions);
      },
    });
  };
}
