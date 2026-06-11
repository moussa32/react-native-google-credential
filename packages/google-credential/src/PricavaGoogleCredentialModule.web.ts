import type {
  GoogleCredentialResult,
  PricavaGoogleCredentialNativeModule,
  ResolvedGoogleCredentialOptions,
} from "./types";

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptMomentNotification = {
  isDismissedMoment(): boolean;
  isDisplayed(): boolean;
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  getDismissedReason(): string;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
};

type GoogleIdentityService = {
  accounts: {
    id: {
      cancel(): void;
      disableAutoSelect(): void;
      initialize(config: {
        auto_select?: boolean;
        callback(response: GoogleCredentialResponse): void;
        cancel_on_tap_outside?: boolean;
        client_id: string;
        nonce?: string;
        use_fedcm_for_prompt?: boolean;
      }): void;
      prompt(
        callback?: (notification: GooglePromptMomentNotification) => void,
      ): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityService;
  }
}

type GoogleIdTokenPayload = {
  email?: string;
  family_name?: string;
  given_name?: string;
  name?: string;
  phone_number?: string;
  picture?: string;
  sub?: string;
};

const GOOGLE_IDENTITY_SCRIPT_ID = "google-identity-services-script";
const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const SIGN_IN_TIMEOUT_MS = 120_000;

let scriptLoadPromise: Promise<void> | null = null;
let pendingSignInReject: ((error: Error) => void) | null = null;

function getGoogleIdentityService() {
  return typeof window === "undefined" ? undefined : window.google;
}

function toErrorMessage(reason: string | null | undefined) {
  if (reason === "unregistered_origin") {
    const origin =
      typeof window === "undefined"
        ? "the current web origin"
        : window.location.origin;

    return [
      "Google sign-in was not completed: this web origin is not authorized for the configured Google OAuth web client.",
      `Add ${origin} to Authorized JavaScript origins for GOOGLE_WEB_CLIENT_ID in Google Cloud Console.`,
      "For localhost development, Google also requires http://localhost and the exact ported origin, for example http://localhost:8081.",
    ].join(" ");
  }

  return reason?.trim()
    ? `Google sign-in was not completed: ${reason}.`
    : "Google sign-in was not completed.";
}

function createGoogleSignInError(reason?: string | null) {
  return new Error(toErrorMessage(reason));
}

function loadGoogleIdentityScript() {
  if (getGoogleIdentityService()) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_IDENTITY_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (getGoogleIdentityService()) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_IDENTITY_SCRIPT_ID;
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Identity Services."));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function decodeBase64UrlJson<T>(value: string): T {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const decoded = window.atob(paddedBase64);
  const bytes = Uint8Array.from(decoded, (character) =>
    character.charCodeAt(0),
  );
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json) as T;
}

function decodeGoogleIdToken(idToken: string) {
  const [, payload] = idToken.split(".");

  if (!payload) {
    return {};
  }

  try {
    return decodeBase64UrlJson<GoogleIdTokenPayload>(payload);
  } catch {
    return {};
  }
}

function mapCredentialResult(idToken: string): GoogleCredentialResult {
  const payload = decodeGoogleIdToken(idToken);

  return {
    idToken,
    displayName: payload.name ?? null,
    email: payload.email ?? null,
    familyName: payload.family_name ?? null,
    givenName: payload.given_name ?? null,
    id: payload.sub ?? payload.email ?? null,
    phoneNumber: payload.phone_number ?? null,
    profilePictureUri: payload.picture ?? null,
  };
}

function rejectPendingSignIn(error: Error) {
  pendingSignInReject?.(error);
  pendingSignInReject = null;
}

const module: PricavaGoogleCredentialNativeModule = {
  async isAvailableAsync() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  },
  async signInAsync(options: ResolvedGoogleCredentialOptions) {
    if (!options.webClientId.trim()) {
      throw new Error("Missing Google web client ID.");
    }

    if (!(await module.isAvailableAsync())) {
      throw new Error("Google sign-in is not available in this environment.");
    }

    rejectPendingSignIn(
      createGoogleSignInError("another sign-in request started"),
    );

    await loadGoogleIdentityScript();

    const google = getGoogleIdentityService();

    if (!google) {
      throw new Error("Google Identity Services is not available.");
    }

    return new Promise<GoogleCredentialResult>((resolve, reject) => {
      let settled = false;
      const timeoutId = window.setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        pendingSignInReject = null;
        google.accounts.id.cancel();
        reject(createGoogleSignInError("request timed out"));
      }, SIGN_IN_TIMEOUT_MS);

      function settleWithCredential(idToken: string) {
        if (settled) {
          return;
        }

        settled = true;
        pendingSignInReject = null;
        window.clearTimeout(timeoutId);
        resolve(mapCredentialResult(idToken));
      }

      function settleWithError(error: Error) {
        if (settled) {
          return;
        }

        settled = true;
        pendingSignInReject = null;
        window.clearTimeout(timeoutId);
        reject(error);
      }

      pendingSignInReject = settleWithError;

      google.accounts.id.initialize({
        client_id: options.webClientId,
        nonce: options.nonce ?? undefined,
        auto_select: options.webAutoSelect,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: options.webUseFedCm,
        callback(response) {
          if (response.credential) {
            settleWithCredential(response.credential);
            return;
          }

          settleWithError(createGoogleSignInError("missing credential"));
        },
      });

      google.accounts.id.prompt((notification) => {
        if (settled || notification.isDisplayed()) {
          return;
        }

        if (notification.isNotDisplayed()) {
          settleWithError(
            createGoogleSignInError(notification.getNotDisplayedReason()),
          );
          return;
        }

        if (notification.isSkippedMoment()) {
          settleWithError(
            createGoogleSignInError(notification.getSkippedReason()),
          );
          return;
        }

        if (notification.isDismissedMoment()) {
          settleWithError(
            createGoogleSignInError(notification.getDismissedReason()),
          );
        }
      });
    });
  },
  async clearCredentialStateAsync() {
    getGoogleIdentityService()?.accounts.id.disableAutoSelect();
  },
};

export default module;
