import PricavaGoogleCredentialModule from "./PricavaGoogleCredentialModule";
import type {
  AndroidGoogleCredentialAccountFilter,
  AndroidGoogleCredentialFlow,
  GoogleCredentialOptions,
  GoogleCredentialResult,
  ResolvedGoogleCredentialOptions,
} from "./types";

export * from "./types";

const DEFAULT_ANDROID_FLOW: AndroidGoogleCredentialFlow = "sign-in-button";
const DEFAULT_ANDROID_ACCOUNT_FILTER: AndroidGoogleCredentialAccountFilter =
  "authorized-first";
const DEFAULT_ANDROID_AUTO_SELECT = true;
const DEFAULT_WEB_AUTO_SELECT = true;
const DEFAULT_WEB_USE_FED_CM = true;

export class GoogleCredentialUnavailableError extends Error {
  constructor(message = "Google credential sign-in is not available.") {
    super(message);
    this.name = "GoogleCredentialUnavailableError";
  }
}

export async function isAvailableAsync(): Promise<boolean> {
  return PricavaGoogleCredentialModule.isAvailableAsync();
}

export async function isGoogleCredentialAvailable(): Promise<boolean> {
  return isAvailableAsync();
}

export async function signInAsync(
  options: GoogleCredentialOptions,
): Promise<GoogleCredentialResult> {
  return PricavaGoogleCredentialModule.signInAsync(
    resolveGoogleCredentialOptions(options),
  );
}

export async function signInWithGoogleCredential(
  options: GoogleCredentialOptions,
): Promise<GoogleCredentialResult> {
  if (!options.webClientId.trim()) {
    throw new Error("Missing Google web client ID.");
  }

  const isAvailable = await isGoogleCredentialAvailable();

  if (!isAvailable) {
    throw new GoogleCredentialUnavailableError(
      "Google credential sign-in is not available on this platform.",
    );
  }

  return signInAsync(options);
}

export function resolveGoogleCredentialOptions(
  options: GoogleCredentialOptions,
): ResolvedGoogleCredentialOptions {
  return {
    webClientId: options.webClientId,
    iosClientId: options.iosClientId,
    nonce: options.nonce,
    androidFlow: options.android?.flow ?? DEFAULT_ANDROID_FLOW,
    androidAccountFilter:
      options.android?.accountFilter ?? DEFAULT_ANDROID_ACCOUNT_FILTER,
    androidAutoSelect:
      options.android?.autoSelect ?? DEFAULT_ANDROID_AUTO_SELECT,
    webAutoSelect: options.web?.autoSelect ?? DEFAULT_WEB_AUTO_SELECT,
    webUseFedCm: options.web?.useFedCm ?? DEFAULT_WEB_USE_FED_CM,
  };
}

export async function clearCredentialStateAsync(): Promise<void> {
  return PricavaGoogleCredentialModule.clearCredentialStateAsync();
}

export async function clearGoogleCredentialState(): Promise<void> {
  const isAvailable = await isGoogleCredentialAvailable();

  if (!isAvailable) {
    return;
  }

  return clearCredentialStateAsync();
}

export default {
  clearGoogleCredentialState,
  isAvailableAsync,
  isGoogleCredentialAvailable,
  signInAsync,
  signInWithGoogleCredential,
  clearCredentialStateAsync,
};
