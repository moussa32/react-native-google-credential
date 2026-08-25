# React Native Google Credential

Open-source Google credential sign-in for React Native and Expo applications.

Use one typed API to acquire a Google ID token across Android, iOS, and web:

- **Android:** Credential Manager with Google ID credentials.
- **iOS:** Native Google Sign-In.
- **Web:** Google Identity Services.

The package gives Android applications a modern alternative to legacy Google
Sign-In token acquisition while keeping application code consistent across
every supported platform.

## Why this package?

- One TypeScript API and one credential result shape.
- Android Credential Manager instead of deprecated Android Google Sign-In APIs.
- Native account selection on Android and iOS.
- Google Identity Services and FedCM support on web.
- React Native TurboModule support.
- Expo config plugin and development-build support.
- Firebase Auth, Supabase, and Clerk integrations.
- Custom integration factories for backends and advanced provider flows.

## Installation

```bash
npm install @pricava/react-native-google-credential
```

```bash
yarn add @pricava/react-native-google-credential
```

```bash
pnpm add @pricava/react-native-google-credential
```

## Basic usage

```ts
import { signInWithGoogleCredential } from "@pricava/react-native-google-credential";

const credential = await signInWithGoogleCredential({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID!,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
});

await authenticate({
  idToken: credential.idToken,
});
```

The package selects the correct native or web implementation internally. Your
application does not need to branch on `Platform.OS`.

## Platform support

| Platform | Credential experience | Implementation |
| --- | --- | --- |
| Android | Native Google account picker | Android Credential Manager |
| iOS | Native Google sign-in | GoogleSignIn iOS SDK |
| Web | Google account prompt | Google Identity Services |
| Expo web | Web account prompt | Google Identity Services |
| Expo development build | Native platform flow | React Native native module |

Expo Go's native app cannot load custom native modules. Use Expo web to test the
web implementation or an Expo development build to test Android Credential
Manager and native Google Sign-In on iOS.

## Authentication adapters

Many authentication providers default to browser-based social OAuth in React
Native applications. These helpers connect the native Google account experience
to the provider session.

### Firebase Auth

Install matching versions of React Native Firebase App and Auth. This package
supports React Native Firebase Auth from `24.1.1` through `26.x`.

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

```ts
import { getAuth } from "@react-native-firebase/auth";
import { createFirebaseGoogleAuth } from "@pricava/react-native-google-credential/adapters/firebase";

const signInWithGoogle = createFirebaseGoogleAuth({
  auth: getAuth(),
  webClientId,
  iosClientId,
});
```

Expo applications must also follow React Native Firebase's native installation
instructions. Its iOS linkage differs by major version, so use the setup for
the exact App/Auth version installed in your application.

### Supabase

```ts
import { createSupabaseGoogleAuth } from "@pricava/react-native-google-credential/adapters/supabase";

const signInWithGoogle = createSupabaseGoogleAuth({
  supabase,
  webClientId,
  iosClientId,
});
```

### Clerk

```ts
import { createClerkGoogleAuth } from "@pricava/react-native-google-credential/adapters/clerk";

const signInWithGoogle = createClerkGoogleAuth({
  clerk,
  webClientId,
  iosClientId,
  callbackOptions: {
    signInFallbackRedirectUrl: "/",
  },
});
```

Each provider also exposes a custom integration factory for backend exchanges,
analytics, account linking, and manual provider flows.

## Configuration

Create a Google OAuth Web client for the ID token audience. iOS also requires an
iOS OAuth client and its reversed client ID URL scheme.

```text
GOOGLE_WEB_CLIENT_ID=...
GOOGLE_IOS_CLIENT_ID=...
GOOGLE_IOS_URL_SCHEME=...
```

For Android, register the package name and signing certificate fingerprints in
Google Cloud or Firebase. For web, register every authorized JavaScript origin.

## Advanced options

```ts
const credential = await signInWithGoogleCredential({
  webClientId,
  iosClientId,
  nonce,
  android: {
    flow: "sign-in-button",
    accountFilter: "authorized-first",
    autoSelect: true,
  },
  web: {
    autoSelect: true,
    useFedCm: true,
  },
});
```

Lower-level exports such as `signInAsync`, `isAvailableAsync`, and
`clearCredentialStateAsync` remain available for advanced usage.

## Documentation

See the [project documentation](https://github.com/moussa32/react-native-google-credential/tree/main/docs/content/docs)
for platform setup, Expo configuration, adapters, API details, and
troubleshooting.

## Project direction

The core package remains focused on reliable Google credential acquisition.
Provider adapters will continue expanding so applications can preserve a native
Google sign-in experience with their preferred authentication platform.

## License

MIT
