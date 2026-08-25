import {
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import type { GoogleCredentialOptions } from "../types";
import { signInWithGoogleAuthProvider } from "./google-auth-provider";

type FirebaseSignInWithCredential = typeof signInWithCredential;
type FirebaseAuth = Parameters<FirebaseSignInWithCredential>[0];
type FirebaseAuthCredential = Parameters<FirebaseSignInWithCredential>[1];
type FirebaseUserCredential = Awaited<ReturnType<FirebaseSignInWithCredential>>;

export type FirebaseGoogleCredentialFactory<TCredential> = (
  idToken: string,
) => TCredential;

export type FirebaseCredentialSignIn<TCredential, TResult> = (
  credential: TCredential,
) => Promise<TResult>;

export type FirebaseGoogleAuthAdapterOptions<TCredential, TResult> = {
  credentialOptions: GoogleCredentialOptions;
  createGoogleCredential: FirebaseGoogleCredentialFactory<TCredential>;
  signInWithCredential: FirebaseCredentialSignIn<TCredential, TResult>;
};

export type FirebaseGoogleAuthOptions = GoogleCredentialOptions & {
  auth: FirebaseAuth;
};

export function createFirebaseGoogleAuthAdapter<TCredential, TResult>({
  credentialOptions,
  createGoogleCredential,
  signInWithCredential,
}: FirebaseGoogleAuthAdapterOptions<TCredential, TResult>) {
  return function signInWithGoogleUsingFirebase() {
    return signInWithGoogleAuthProvider({
      credentialOptions,
      exchangeCredential: ({ idToken }) => {
        const googleCredential = createGoogleCredential(idToken);

        return signInWithCredential(googleCredential);
      },
    });
  };
}

export function createFirebaseGoogleAuth({
  auth,
  ...credentialOptions
}: FirebaseGoogleAuthOptions) {
  return createFirebaseGoogleAuthAdapter<
    FirebaseAuthCredential,
    FirebaseUserCredential
  >({
    credentialOptions,
    createGoogleCredential: (idToken) => GoogleAuthProvider.credential(idToken),
    signInWithCredential: (credential) =>
      signInWithCredential(auth, credential),
  });
}
