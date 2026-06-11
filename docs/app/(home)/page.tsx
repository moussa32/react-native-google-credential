import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center px-6 py-20">
      <p className="mb-3 text-sm font-medium text-fd-muted-foreground">
        Android Credential Manager, iOS GoogleSignIn, and Google Identity Services for web
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-6xl">
        React Native Google Credential
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-fd-muted-foreground">
        Acquire Google ID tokens from React Native and Expo apps with one typed API,
        then exchange them with Supabase or your own backend.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          Read the docs
        </Link>{' '}
        <Link
          href="https://github.com/moussa32/react-native-google-credential"
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          GitHub
        </Link>
      </div>
    </main>
  );
}
