import { NativeModules } from "react-native";

import type { PricavaGoogleCredentialNativeModule } from "./types";
import NativePricavaGoogleCredential from "./NativePricavaGoogleCredential";

const MODULE_NAME = "PricavaGoogleCredential";

function getReactNativeModule() {
  return (
    NativePricavaGoogleCredential ??
    (NativeModules[MODULE_NAME] as
      | PricavaGoogleCredentialNativeModule
      | undefined)
  );
}

function requireGoogleCredentialModule() {
  const nativeModule = getReactNativeModule();

  if (!nativeModule) {
    throw new Error(
      `${MODULE_NAME} native module is not available. Install the native package and rebuild the React Native or Expo development app.`,
    );
  }

  return nativeModule;
}

const PricavaGoogleCredentialModule = requireGoogleCredentialModule();

export default PricavaGoogleCredentialModule;
