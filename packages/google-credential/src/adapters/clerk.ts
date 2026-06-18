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

export type ClerkGoogleAuthClient<
  TAuthenticateResult,
  TResult = TAuthenticateResult,
  TCallbackOptions = unknown,
> = {
  authenticateWithGoogleOneTap: ClerkGoogleOneTapAuthentication<TAuthenticateResult>;
  handleGoogleOneTapCallback?: ClerkGoogleOneTapCallback<
    TAuthenticateResult,
    TResult,
    TCallbackOptions
  >;
};

export type ClerkGoogleAuthOptions<
  TAuthenticateResult,
  TResult = TAuthenticateResult,
  TCallbackOptions = unknown,
> = GoogleCredentialOptions & {
  clerk: ClerkGoogleAuthClient<
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

export function createClerkGoogleAuth<
  TAuthenticateResult,
  TResult = TAuthenticateResult,
  TCallbackOptions = unknown,
>({
  clerk,
  callbackOptions,
  ...credentialOptions
}: ClerkGoogleAuthOptions<
  TAuthenticateResult,
  TResult,
  TCallbackOptions
>) {
  return createClerkGoogleAuthAdapter({
    credentialOptions,
    authenticateWithGoogleOneTap:
      clerk.authenticateWithGoogleOneTap.bind(clerk),
    handleGoogleOneTapCallback: clerk.handleGoogleOneTapCallback?.bind(clerk),
    callbackOptions,
  });
}
