import {
  ArrowRight,
  Blocks,
  Check,
  ExternalLink,
  Globe2,
  KeyRound,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import Link from "next/link";

const platforms = [
  {
    name: "Android",
    detail: "Credential Manager",
    icon: "/platforms/android.svg",
  },
  {
    name: "iOS",
    detail: "Native Google Sign-In",
    icon: "/platforms/apple.svg",
    iconBackground: "#1d1d1f",
  },
  {
    name: "Web",
    detail: "Google Identity Services",
    icon: "/platforms/web-google.png",
  },
];

const adapters = [
  {
    name: "Firebase Auth",
    description: "Create a Firebase session from the Google credential.",
    icon: "/adapters/firebase.svg",
    href: "/docs/adapters/firebase",
  },
  {
    name: "Supabase",
    description: "Exchange the ID token with Supabase Auth.",
    icon: "/adapters/supabase.svg",
    href: "/docs/adapters/supabase",
  },
  {
    name: "Clerk",
    description: "Use native Google sign-in with Clerk sessions.",
    icon: "/adapters/clerk.svg",
    href: "/docs/adapters/clerk",
  },
];

const codeExample = `const credential = await signInWithGoogleCredential({
  webClientId,
  iosClientId,
});

await authenticate({
  idToken: credential.idToken,
});`;

export default async function HomePage() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="border-b border-fd-border">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
            <KeyRound className="size-4 text-emerald-500" />
            Modern Google sign-in for React Native and Expo
          </div>

          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal text-fd-foreground sm:text-6xl lg:text-7xl">
            React Native Google Credential
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-fd-muted-foreground sm:text-xl">
            Acquire Google ID tokens across Android, iOS, and web through one
            typed API. Use Android Credential Manager instead of building on
            legacy Google Sign-In token flows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="https://github.com/moussa32/react-native-google-credential"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-fd-border bg-fd-background px-5 text-sm font-medium transition-colors hover:bg-fd-accent"
            >
              <ExternalLink className="size-4" />
              View on GitHub
            </Link>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-lg border border-fd-border bg-fd-card lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-fd-border p-6 lg:border-r lg:border-b-0 lg:p-8">
              <p className="text-xs font-semibold uppercase text-fd-muted-foreground">
                One call, every platform
              </p>
              <div className="mt-5 space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-3">
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: platform.iconBackground }}
                    >
                      <img
                        src={platform.icon}
                        alt=""
                        className={
                          platform.iconBackground
                            ? "size-4 object-contain"
                            : "size-7 object-contain rounded-full"
                        }
                      />
                    </span>
                    <span className="w-16 text-sm font-medium">
                      {platform.name}
                    </span>
                    <span className="text-sm text-fd-muted-foreground">
                      {platform.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ServerCodeBlock
              code={codeExample}
              lang="ts"
              themes={{
                light: "github-dark",
                dark: "github-dark",
              }}
              codeblock={{
                title: "sign-in.ts",
                allowCopy: true,
                keepBackground: true,
                className:
                  "my-0 border-neutral-800 bg-neutral-950 min-w-0 p-4 lg:p-6",
                viewportProps: {
                  className: "text-sm",
                },
              }}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Modern by default
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
                Stop rebuilding Google sign-in for every platform
              </h2>
              <p className="mt-5 leading-7 text-fd-muted-foreground">
                The package normalizes the platform-specific credential flow
                while keeping the Google ID token available for your auth
                provider or backend.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-lg border border-fd-border bg-fd-border sm:grid-cols-2">
              <div className="bg-fd-background p-6">
                <ShieldCheck className="size-5 text-emerald-500" />
                <h3 className="mt-4 font-semibold">Current Android APIs</h3>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  Built around Android Credential Manager and Google ID
                  credentials, not a deprecated Android sign-in path.
                </p>
              </div>
              <div className="bg-fd-background p-6">
                <Globe2 className="size-5 text-sky-500" />
                <h3 className="mt-4 font-semibold">Unified result</h3>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  Receive the same typed credential shape on Android, iOS, and
                  web without branching on the platform.
                </p>
              </div>
              <div className="bg-fd-background p-6">
                <Smartphone className="size-5 text-amber-500" />
                <h3 className="mt-4 font-semibold">React Native and Expo</h3>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  Use it in bare React Native apps or Expo development builds,
                  with a config plugin for native setup.
                </p>
              </div>
              <div className="bg-fd-background p-6">
                <Blocks className="size-5 text-rose-500" />
                <h3 className="mt-4 font-semibold">Provider-ready</h3>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  Exchange the token directly, use a packaged adapter, or own
                  the integration through a custom callback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row">
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                Authentication integrations
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
                From Google credential to app session
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-fd-muted-foreground">
                Many provider social-auth flows send users through a browser.
                These helpers connect the native Google account experience to
                your provider session while removing the standard token-exchange
                boilerplate.
              </p>
            </div>
            <Link
              href="/docs/adapters"
              className="inline-flex justify-start items-center gap-2 text-sm font-medium hover:underline"
            >
              Explore adapters
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {adapters.map((adapter) => (
              <Link
                key={adapter.name}
                href={adapter.href}
                className="group rounded-lg border border-fd-border p-6 transition-colors hover:bg-fd-accent"
              >
                <img
                  src={adapter.icon}
                  alt=""
                  className="size-8 object-contain"
                />
                <h3 className="mt-5 flex items-center gap-2 font-semibold">
                  {adapter.name}
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  {adapter.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 border-l-2 border-emerald-500 pl-4">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <p className="text-sm leading-6 text-fd-muted-foreground">
              Firebase Auth, Supabase, and Clerk are available now. The adapter
              surface is designed to grow with additional authentication and
              backend providers.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Start with one Google credential API
            </h2>
            <p className="mt-2 text-fd-muted-foreground">
              Open source, typed, and built for modern React Native
              applications.
            </p>
          </div>
          <Link
            href="/docs/getting-started"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground"
          >
            Read the documentation
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
