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

Google authentication uses a different SDK and configuration model on each
platform. Without a shared layer, applications must maintain separate Android,
iOS, and web implementations just to obtain the same Google ID token.

React Native Google Credential provides:

- One TypeScript API and one credential result shape.
- Android Credential Manager instead of deprecated Android Google Sign-In APIs.
- Native account selection on Android and iOS.
- Google Identity Services and FedCM support on web.
- React Native TurboModule support.
- Expo config plugin and development-build support.
- Ready-to-use Firebase Auth, Supabase, and Clerk integrations.
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

## Credential result

Every platform returns the same shape:

```ts
type GoogleCredentialResult = {
  idToken: string;
  displayName: string | null;
  email: string | null;
  familyName: string | null;
  givenName: string | null;
  id: string | null;
  phoneNumber: string | null;
  profilePictureUri: string | null;
};
```

Use `idToken` to authenticate with your backend or identity provider. Profile
fields are convenience metadata and should not be treated as authorization
proof.

## Platform support

| Platform | Credential experience | Implementation |
| --- | --- | --- |
| Android | Native Google account picker | Android Credential Manager |
| iOS | Native Google sign-in | GoogleSignIn iOS SDK |
| Web | Google account prompt | Google Identity Services |
| Expo web | Web account prompt | Google Identity Services |
| Expo development build | Native platform flow | React Native native module |

Expo Go's native app cannot load custom native modules. Use
`npx expo start --web` to test the web implementation, or create an Android
development build to test Credential Manager:

```bash
npx expo run:android
```

## Authentication adapters

Many authentication providers default to browser-based social OAuth in React
Native applications. The included helpers connect the native Google account
experience to the provider session.

### Firebase Auth

```ts
import { getAuth } from "@react-native-firebase/auth";
import { createFirebaseGoogleAuth } from "@pricava/react-native-google-credential/adapters/firebase";

const signInWithGoogle = createFirebaseGoogleAuth({
  auth: getAuth(),
  webClientId,
  iosClientId,
});

const userCredential = await signInWithGoogle();
```

### Supabase

```ts
import { createClient } from "@supabase/supabase-js";
import { createSupabaseGoogleAuth } from "@pricava/react-native-google-credential/adapters/supabase";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const signInWithGoogle = createSupabaseGoogleAuth({
  supabase,
  webClientId,
  iosClientId,
});

const result = await signInWithGoogle();
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

await signInWithGoogle();
```

Each provider also exposes a custom integration factory for analytics, backend
exchanges, account linking, and manual provider flows.

## Configuration

At minimum, create a Google OAuth Web client. Its client ID is used as the ID
token audience on every platform.

```text
GOOGLE_WEB_CLIENT_ID=...
GOOGLE_IOS_CLIENT_ID=...
GOOGLE_IOS_URL_SCHEME=...
```

Additional requirements:

- **Android:** Register the package name and every signing certificate
  fingerprint in Google Cloud or Firebase.
- **iOS:** Create an iOS OAuth client and register its reversed client ID URL
  scheme.
- **Web:** Add every application origin to the OAuth Web client's authorized
  JavaScript origins.

### Expo config plugin

```ts
export default {
  plugins: [
    [
      "@pricava/react-native-google-credential",
      {
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME,
      },
    ],
  ],
};
```

Rebuild the native application after changing native configuration.

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

## Project direction

The core package will remain focused on reliable Google credential acquisition.
Provider adapters will continue expanding so applications can preserve a native
Google sign-in experience while using their preferred authentication or backend
platform.

Current integrations:

- Firebase Auth
- Supabase
- Clerk

## Documentation

- [Getting started](./docs/content/docs/getting-started.mdx)
- [Configuration](./docs/content/docs/configuration.mdx)
- [Expo setup](./docs/content/docs/expo.mdx)
- [Adapters](./docs/content/docs/adapters/index.mdx)
- [Troubleshooting](./docs/content/docs/troubleshooting.mdx)
- [Implementation details](./packages/google-credential/IMPLEMENTATION.md)

## License

MIT
