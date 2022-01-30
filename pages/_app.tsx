import { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const toggleTheme = () => {
    document.body.classList.toggle('opposite-theme');
  };

  return (
    <>
      <header>
        <div onClick={toggleTheme}>
          <p>Toggle light 💡</p>
        </div>
      </header>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
