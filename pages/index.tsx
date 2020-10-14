import Head from 'next/head';
import { useAuth } from '../lib/auth';
import Link from 'next/link';

export default function Home() {
  const { auth, signOut, signInWithTwitter } = useAuth();

  return (
    <div>
      <Head>
        <title>Next.js with Firebase Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {auth ? (
        <div>
          <Link href="/dashboard">
            <a>Dashboard link.</a>
          </Link>
          <div>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        </div>
      ) : (
        <button onClick={() => signInWithTwitter()}>Sign In</button>
      )}
    </div>
  );
}
