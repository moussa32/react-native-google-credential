import {
  GoogleAuthProvider,
  signInWithCredential,
  type FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import type { GoogleCredentialOptions } from "../types";
import { signInWithGoogleAuthProvider } from "./google-auth-provider";

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
  auth: FirebaseAuthTypes.Module;
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
    FirebaseAuthTypes.AuthCredential,
    FirebaseAuthTypes.UserCredential
  >({
    credentialOptions,
    createGoogleCredential: (idToken) =>
      GoogleAuthProvider.credential(idToken),
    signInWithCredential: (credential) =>
      signInWithCredential(auth, credential),
  });
}
