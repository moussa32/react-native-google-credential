export type AndroidGoogleCredentialFlow = "credential" | "sign-in-button";

export type AndroidGoogleCredentialAccountFilter =
  | "all"
  | "authorized-first";

export type GoogleCredentialAndroidOptions = {
  flow?: AndroidGoogleCredentialFlow;
  accountFilter?: AndroidGoogleCredentialAccountFilter;
  autoSelect?: boolean;
};

export type GoogleCredentialWebOptions = {
  autoSelect?: boolean;
  useFedCm?: boolean;
};

export type GoogleCredentialOptions = {
  webClientId: string;
  iosClientId?: string | null;
  nonce?: string | null;
  android?: GoogleCredentialAndroidOptions;
  web?: GoogleCredentialWebOptions;
};

export type ResolvedGoogleCredentialOptions = {
  webClientId: string;
  iosClientId?: string | null;
  nonce?: string | null;
  androidFlow: AndroidGoogleCredentialFlow;
  androidAccountFilter: AndroidGoogleCredentialAccountFilter;
  androidAutoSelect: boolean;
  webAutoSelect: boolean;
  webUseFedCm: boolean;
};

export type GoogleCredentialResult = {
  idToken: string;
  displayName: string | null;
  email: string | null;
  familyName: string | null;
  givenName: string | null;
  id: string | null;
  phoneNumber: string | null;
  profilePictureUri: string | null;
};

export type PricavaGoogleCredentialNativeModule = {
  isAvailableAsync(): Promise<boolean>;
  signInAsync(
    options: ResolvedGoogleCredentialOptions,
  ): Promise<GoogleCredentialResult>;
  clearCredentialStateAsync(): Promise<void>;
};
