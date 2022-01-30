import Head from 'next/head';
import { useAuth } from '../lib/auth';
import Link from 'next/link';

export default function Home() {
  const { auth, signOut, signInWithTwitter } = useAuth();

  return (
    <>
      <Head>
        <title>Next.js with Firebase Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Home</h1>
        {auth ? (
          <div>
            <Link href="/dashboard">
              <p>
                <a>Go to Dashboard →</a>
              </p>
            </Link>
            <div>
              <button onClick={() => signOut()}>Sign Out</button>
            </div>
          </div>
        ) : (
          <button onClick={() => signInWithTwitter()}>Sign In</button>
        )}
      </main>
    </>
  );
}
