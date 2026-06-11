import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export type GoogleCredentialOptionsSpec = {
  webClientId: string;
  iosClientId?: string | null;
  nonce?: string | null;
  androidFlow: string;
  androidAccountFilter: string;
  androidAutoSelect: boolean;
  webAutoSelect: boolean;
  webUseFedCm: boolean;
};

export type GoogleCredentialResultSpec = {
  idToken: string;
  displayName: string | null;
  email: string | null;
  familyName: string | null;
  givenName: string | null;
  id: string | null;
  phoneNumber: string | null;
  profilePictureUri: string | null;
};

export interface Spec extends TurboModule {
  isAvailableAsync(): Promise<boolean>;
  signInAsync(options: GoogleCredentialOptionsSpec): Promise<GoogleCredentialResultSpec>;
  clearCredentialStateAsync(): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>("PricavaGoogleCredential");
