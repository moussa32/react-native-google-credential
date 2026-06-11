# React Native Google Credential

Google credential sign-in package for React Native and Expo apps across Android, iOS, and web.
The native runtime is implemented as a React Native TurboModule/native module.
Expo development builds and prebuild projects use the same native module path.

The JavaScript API intentionally returns only the Google credential payload. App
features decide how to exchange the ID token with an auth provider, which keeps
this module extractable as a standalone package later.

## API

Use `signInWithGoogleCredential` from app code. The package checks platform
availability internally and dispatches to the matching native or web
implementation, so consumers do not need to check `Platform.OS`.

The lower-level `signInAsync`, `isAvailableAsync`, and
`clearCredentialStateAsync` exports remain available for advanced use.

Use generic environment variable names in app config and examples:

```text
GOOGLE_WEB_CLIENT_ID=...
GOOGLE_IOS_CLIENT_ID=...
GOOGLE_IOS_URL_SCHEME=...
```

Optional auth provider helpers are exported from:

```ts
import { createSupabaseGoogleAuthAdapter } from "@pricava/react-native-google-credential/adapters";
```

Future provider integrations such as Clerk, Auth0, and Convex should live in
the package `src/adapters/` folder.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full architecture,
platform support matrix, setup requirements, and feature behavior.

## Android

`signInAsync` uses Credential Manager with `GetSignInWithGoogleOption` by
default for an explicit "Sign in with Google" button. Set
`android.flow: "credential"` to use `GetGoogleIdOption` instead. Pass the OAuth
web client ID as `webClientId`. If your auth provider validates an OIDC nonce,
pass the hashed nonce to this module and the original nonce to the provider
exchange.

## Web

`signInAsync` loads Google Identity Services on demand and returns the same ID
token result shape as Android. The web implementation uses the OAuth web client
ID as `webClientId`, passes through the nonce for provider-side validation,
uses FedCM prompts by default, and disables auto-select in
`clearCredentialStateAsync`.

## iOS

`signInAsync` uses the GoogleSignIn iOS SDK. Pass the OAuth web client ID as
`webClientId` and the OAuth iOS client ID as `iosClientId`, or bundle
`GoogleService-Info.plist` so the native SDK can resolve the iOS client ID.
The iOS app must also register the reversed iOS client ID URL scheme.

