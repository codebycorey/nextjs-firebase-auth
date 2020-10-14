import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '../lib/auth';
import fetcher from '../util/fetcher';

export default function Dashboard() {
  const { auth, loading, signOut } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/');
    }
  }, [auth, loading]);

  const { data } = useSWR(auth ? ['/api/user', auth.token] : null, fetcher);

  return (
    <div>
      <p>Dashboard: Hello World</p>
      {auth && (
        <div>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      )}
      {data && (
        <p>USER RESPONSE: {JSON.stringify(data)}</p>
      )}
    </div>
  );
}
